import supabase from './db';

interface CreditRow {
  user_id: string;
  daily_credits: number;
  daily_limit: number;
  pack_credits: number;
  daily_reset_at: string;
}

export async function getOrCreateCredits(userId: string): Promise<CreditRow> {
  const { data } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!data) {
    const resetAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data: created } = await supabase
      .from('user_credits')
      .insert({ user_id: userId, daily_credits: 5, daily_limit: 5, pack_credits: 0, daily_reset_at: resetAt })
      .select()
      .single();
    return created!;
  }

  if (new Date(data.daily_reset_at) < new Date()) {
    const resetAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data: updated } = await supabase
      .from('user_credits')
      .update({ daily_credits: data.daily_limit, daily_reset_at: resetAt })
      .eq('user_id', userId)
      .select()
      .single();

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: data.daily_limit,
      type: 'daily_reset',
      description: 'Daily credits reset',
    });

    return updated!;
  }

  return data;
}

interface DeductResult {
  ok: boolean;
  remaining?: { daily: number; pack: number };
  resetAt?: string;
}

export async function deductCredit(userId: string): Promise<DeductResult> {
  const credits = await getOrCreateCredits(userId);

  if (credits.daily_credits > 0) {
    const { data } = await supabase
      .from('user_credits')
      .update({ daily_credits: credits.daily_credits - 1 })
      .eq('user_id', userId)
      .select()
      .single();

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -1,
      type: 'daily_deduct',
      description: 'AI tutor message',
    });

    return {
      ok: true,
      remaining: { daily: data!.daily_credits, pack: data!.pack_credits },
      resetAt: data!.daily_reset_at,
    };
  }

  if (credits.pack_credits > 0) {
    const { data } = await supabase
      .from('user_credits')
      .update({ pack_credits: credits.pack_credits - 1 })
      .eq('user_id', userId)
      .select()
      .single();

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: -1,
      type: 'pack_deduct',
      description: 'AI tutor message (pack)',
    });

    return {
      ok: true,
      remaining: { daily: data!.daily_credits, pack: data!.pack_credits },
      resetAt: data!.daily_reset_at,
    };
  }

  return { ok: false, resetAt: credits.daily_reset_at };
}

export async function addPackCredits(userId: string, amount: number, description: string): Promise<void> {
  const credits = await getOrCreateCredits(userId);

  await supabase
    .from('user_credits')
    .update({ pack_credits: credits.pack_credits + amount })
    .eq('user_id', userId);

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    type: 'pack_add',
    description,
  });
}

export async function updateDailyLimit(userId: string, newLimit: number): Promise<void> {
  const credits = await getOrCreateCredits(userId);

  await supabase
    .from('user_credits')
    .update({
      daily_limit: newLimit,
      ...(credits.daily_credits > newLimit ? { daily_credits: newLimit } : {}),
    })
    .eq('user_id', userId);
}

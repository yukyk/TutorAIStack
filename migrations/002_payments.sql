-- 002_payments.sql
-- Idempotent payment fulfilment. Run once in the Supabase SQL editor.
-- A unique payment ID makes replayed verification requests harmless, and the
-- function applies credits atomically in a single transaction.

create table if not exists payments (
  razorpay_payment_id text primary key,
  razorpay_order_id   text not null,
  user_id             text not null,
  type                text not null check (type in ('pack', 'subscription')),
  item_id             text not null,
  amount_paise        integer not null,
  created_at          timestamptz not null default now()
);

create or replace function fulfil_pack_payment(
  p_payment_id text, p_order_id text, p_user_id text,
  p_item_id text, p_amount_paise integer,
  p_credits integer, p_description text
) returns boolean
language plpgsql
as $$
declare
  inserted_rows int;
begin
  insert into payments (razorpay_payment_id, razorpay_order_id, user_id, type, item_id, amount_paise)
  values (p_payment_id, p_order_id, p_user_id, 'pack', p_item_id, p_amount_paise)
  on conflict (razorpay_payment_id) do nothing;

  get diagnostics inserted_rows = row_count;
  if inserted_rows = 0 then
    return false;  -- already processed
  end if;

  update user_credits
     set pack_credits = pack_credits + p_credits
   where user_id = p_user_id;

  insert into credit_transactions (user_id, amount, type, description)
  values (p_user_id, p_credits, 'pack_add', p_description);

  return true;
end;
$$;

-- Lock down: only the server (service key) should touch these.
alter table payments enable row level security;
revoke execute on function fulfil_pack_payment(text, text, text, text, integer, integer, text)
  from public, anon, authenticated;

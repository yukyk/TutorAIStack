-- Run once in the Supabase SQL editor.

create table if not exists user_credits (
  user_id        text primary key,
  daily_credits  int  not null default 5,
  daily_limit    int  not null default 5,
  pack_credits   int  not null default 0,
  daily_reset_at timestamptz not null default (now() + interval '24 hours')
);

create table if not exists credit_transactions (
  id          bigserial primary key,
  user_id     text not null,
  amount      int  not null,
  type        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists subscriptions (
  user_id     text primary key,
  plan        text not null default 'free',
  status      text not null default 'inactive',
  razorpay_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table user_credits       disable row level security;
alter table credit_transactions disable row level security;
alter table subscriptions       disable row level security;

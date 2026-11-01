create table public.youtube_vsl_chat_events (
 id uuid primary key,
 session_id uuid not null,
 message_id uuid not null,
 sequence bigint not null check (sequence >= 0),
 kind text not null check (kind in ('draft', 'sent')),
 text text not null check (length(text) <= 4000),
 lead_id text,
 lead_name text not null,
 lead_email text not null,
 lead_phone text not null,
 origin text not null,
 client_at timestamptz not null,
 received_at timestamptz not null default now()
);
create index youtube_vsl_chat_email_time on public.youtube_vsl_chat_events (lead_email, received_at);
create index youtube_vsl_chat_session_message on public.youtube_vsl_chat_events (session_id, message_id, sequence);
alter table public.youtube_vsl_chat_events enable row level security;
revoke all on public.youtube_vsl_chat_events from anon, authenticated;
grant select, insert on public.youtube_vsl_chat_events to service_role;
comment on table public.youtube_vsl_chat_events is 'YouTube VSL: private append-only draft snapshots and sent messages. Browser has no read access.';

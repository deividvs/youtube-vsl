# Chat YouTube VSL — CENTRAL

Project: `kcpbemdzalwzvdjgpjlg` (CENTRAL). Table: `public.youtube_vsl_chat_events`.

Each row is an immutable snapshot (`draft`) or submitted message (`sent`). Group by
`session_id` and `message_id`, order by `sequence`; `lead_email` links returning
leads and `lead_id` contains the popup submission ID for new registrations.
`client_at` is the browser timestamp; `received_at` is the authoritative receipt time.
Older locally saved leads are linked by email and may have a null `lead_id`.

Draft snapshots: after one second idle, at most five seconds while typing, on blur,
and on page hide. Erased text produces an empty snapshot, preserving previous
snapshots. This is not a per-keystroke log. A local queue retries every 15 seconds,
on reconnect and on reopening the page. Abrupt browser termination can still
prevent final delivery until the visitor returns; clearing browser storage deletes
pending items. Only new chat activity is captured, not historical local messages.

The chat and popup disclose that unsent drafts are stored. The local Clear button
only clears the browser's displayed history, not server records. No automatic
retention/deletion schedule is configured. Authorized CENTRAL admins can query,
export, or delete records through Supabase; there is no public history endpoint.

RLS enabled, no anon/authenticated table privileges or policies. The INFO advisor
`rls_enabled_no_policy` is intentional (backend-only access):
https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

Next.js `/api/chat` validates requests and forwards to the `youtube-vsl-chat` Edge
Function with server-only `CHAT_INGEST_SECRET`. `CHAT_INGEST_URL` is also server-only.
The Edge Function authenticates SHA-256 of a random 256-bit secret against
`auth-hash.json` (a non-secret verifier), then inserts using its built-in service
credential. Never expose the raw secret or Supabase service credential to clients.
To rotate: generate a new random secret, update the verifier, deploy the Edge
Function, update Vercel's secret and redeploy. Coordinate rotation to minimize
failed writes; queued client writes retry.

Deploy Edge files: `index.ts`, `auth-hash.json`, plus `lib/chat-validation.mjs` copied
as `chat-validation.mjs`. JWT verification is disabled because this function performs
its own shared-key authentication. `chat-schema.sql` was applied as the migration
`youtube_vsl_chat_events`. Do not apply it again to CENTRAL.

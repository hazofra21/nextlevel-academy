create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    event text not null,
    status text not null check (status in ('success', 'failure', 'info')),
    actor_id uuid references public.profiles(id) on delete set null,
    ip text,
    route text,
    metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_event on public.audit_logs(event);
create index if not exists idx_audit_logs_status on public.audit_logs(status);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);

alter table public.audit_logs enable row level security;

drop policy if exists "admins_audit_logs" on public.audit_logs;
create policy "admins_audit_logs" on public.audit_logs
    for select
    using (
        exists (
            select 1
            from public.profiles
            where id = auth.uid() and rol in ('admin', 'superadmin')
        )
    );

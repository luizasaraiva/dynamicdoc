-- DynamicDoc | Banco de dados + Auth
-- Cole este SQL no Supabase > SQL Editor > New query > Run

-- =========================
-- ARTIGOS E PROCESSOS
-- =========================
create table if not exists public.artigos (
  id text primary key,
  title text,
  summary text,
  system text,
  department text,
  status text default 'publicado',
  tags jsonb default '[]'::jsonb,
  image text,
  video text,
  content text,
  "createdAt" text,
  "updatedAt" text,
  comments jsonb default '[]'::jsonb,
  kind text default 'article',
  likes integer default 0,
  dislikes integer default 0,
  history jsonb default '[]'::jsonb,
  relacionados jsonb default '[]'::jsonb,
  status_admin text default 'Homologado',
  homologation text default 'Homologado',
  version text default '1.0'
);

alter table public.artigos
add column if not exists likes integer default 0,
add column if not exists dislikes integer default 0,
add column if not exists history jsonb default '[]'::jsonb,
add column if not exists relacionados jsonb default '[]'::jsonb,
add column if not exists status_admin text default 'Homologado',
add column if not exists homologation text default 'Homologado',
add column if not exists version text default '1.0';

alter table public.artigos enable row level security;

drop policy if exists "permitir leitura publica artigos" on public.artigos;
create policy "permitir leitura publica artigos"
on public.artigos
for select
using (true);

drop policy if exists "permitir cadastro artigos" on public.artigos;
create policy "permitir cadastro artigos"
on public.artigos
for insert
with check (true);

drop policy if exists "permitir edicao artigos" on public.artigos;
create policy "permitir edicao artigos"
on public.artigos
for update
using (true)
with check (true);

drop policy if exists "permitir exclusao artigos" on public.artigos;
create policy "permitir exclusao artigos"
on public.artigos
for delete
using (true);

-- =========================
-- CLIENTES
-- =========================
create table if not exists public.clientes (
  id text primary key,
  name text,
  email text,
  company text,
  role text default 'usuário comum',
  department text
);

alter table public.clientes
add column if not exists department text;

alter table public.clientes enable row level security;

drop policy if exists "permitir leitura clientes" on public.clientes;
create policy "permitir leitura clientes"
on public.clientes
for select
using (true);

drop policy if exists "permitir cadastro clientes" on public.clientes;
create policy "permitir cadastro clientes"
on public.clientes
for insert
with check (true);

drop policy if exists "permitir edicao clientes" on public.clientes;
create policy "permitir edicao clientes"
on public.clientes
for update
using (true)
with check (true);

-- =========================
-- USUÁRIOS AGÊNCIA
-- =========================
create table if not exists public.usuarios_agencia (
  id text primary key,
  name text,
  email text,
  department text,
  access text default 'colaborador'
);

alter table public.usuarios_agencia enable row level security;

drop policy if exists "permitir leitura usuarios agencia" on public.usuarios_agencia;
create policy "permitir leitura usuarios agencia"
on public.usuarios_agencia
for select
using (true);

drop policy if exists "permitir cadastro usuarios agencia" on public.usuarios_agencia;
create policy "permitir cadastro usuarios agencia"
on public.usuarios_agencia
for insert
with check (true);

drop policy if exists "permitir edicao usuarios agencia" on public.usuarios_agencia;
create policy "permitir edicao usuarios agencia"
on public.usuarios_agencia
for update
using (true)
with check (true);

-- =========================
-- PERFIS DO SUPABASE AUTH
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text unique,
  perfil text default 'usuario',
  departamento text,
  empresa text,
  criado_em timestamp default now()
);

alter table public.profiles enable row level security;

-- Limpa policies antigas para evitar erro "policy already exists"
drop policy if exists "ler profiles" on public.profiles;
drop policy if exists "criar proprio profile" on public.profiles;
drop policy if exists "admin cria profiles" on public.profiles;
drop policy if exists "editar proprio profile" on public.profiles;
drop policy if exists "admin edita profiles" on public.profiles;
drop policy if exists "usuarios podem ver perfis" on public.profiles;
drop policy if exists "usuarios podem criar seu perfil" on public.profiles;
drop policy if exists "usuarios podem atualizar seu perfil" on public.profiles;

create policy "ler profiles"
on public.profiles
for select
using (true);

create policy "criar proprio profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "admin cria profiles"
on public.profiles
for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.perfil = 'admin'
  )
);

create policy "editar proprio profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "admin edita profiles"
on public.profiles
for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.perfil = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.perfil = 'admin'
  )
);

-- Trigger: quando um usuário é criado no Supabase Auth, cria automaticamente o perfil
-- Isso corrige o problema de usuário existir em Authentication, mas não conseguir acessar por falta de profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    nome,
    email,
    perfil,
    departamento,
    empresa
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'perfil', 'usuario'),
    coalesce(new.raw_user_meta_data->>'departamento', 'Sem departamento'),
    coalesce(new.raw_user_meta_data->>'empresa', '')
  )
  on conflict (id) do update set
    nome = excluded.nome,
    email = excluded.email,
    perfil = excluded.perfil,
    departamento = excluded.departamento,
    empresa = excluded.empresa;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

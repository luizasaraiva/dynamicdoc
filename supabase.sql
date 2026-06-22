-- Cole este SQL no Supabase > SQL Editor > New query > Run

create table if not exists artigos (
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
  kind text default 'article'
);

create table if not exists clientes (
  id text primary key,
  name text,
  email text,
  company text,
  role text default 'usuário comum'
);

create table if not exists usuarios_agencia (
  id text primary key,
  name text,
  email text,
  department text,
  access text default 'colaborador'
);

-- Ajustes para módulos vinculados aos artigos/processos
alter table public.artigos
add column if not exists module text;

create table if not exists public.modulos (
  id text primary key,
  system text not null,
  name text not null
);

alter table public.modulos enable row level security;

drop policy if exists "permitir leitura publica modulos" on public.modulos;
create policy "permitir leitura publica modulos"
on public.modulos
for select
using (true);

drop policy if exists "permitir cadastro modulos" on public.modulos;
create policy "permitir cadastro modulos"
on public.modulos
for insert
with check (true);

drop policy if exists "permitir edicao modulos" on public.modulos;
create policy "permitir edicao modulos"
on public.modulos
for update
using (true)
with check (true);

insert into public.modulos (id, system, name) values
('argo-cadastros', 'argo', 'Cadastros'),
('argo-aprovacoes', 'argo', 'Aprovações'),
('argo-politicas', 'argo', 'Políticas'),
('reserve-cadastros', 'reserve', 'Cadastros'),
('reserve-emissoes', 'reserve', 'Emissões'),
('wts-operacao', 'wts', 'Operação'),
('reserva-facil-pesquisa', 'reserva-facil', 'Pesquisa')
on conflict (id) do nothing;

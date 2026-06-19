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

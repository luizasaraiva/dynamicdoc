
-- DynamicDoc Produto Interno - estrutura completa
create table if not exists systems (id text primary key, name text not null, description text);
create table if not exists modules (id text primary key, system text references systems(id) on delete cascade, name text not null);
create table if not exists profiles (id text primary key, name text, nome text, email text unique, role text, perfil text, department text, departamento text, created_at timestamp default now());
create table if not exists articles (
  id text primary key,
  kind text default 'article', visibility text default 'publico', title text not null, summary text,
  system text, module text, department text, status text default 'rascunho', tags jsonb default '[]'::jsonb,
  content text, image text, video text, file text, internalNote text, version text default '1.0',
  versions jsonb default '[]'::jsonb, comments jsonb default '[]'::jsonb,
  views int default 0, likes int default 0, dislikes int default 0,
  createdAt text, updatedAt text
);
create table if not exists training_tracks (id text primary key, title text not null, description text, lessons jsonb default '[]'::jsonb, progress int default 0);
create table if not exists search_logs (id uuid primary key default gen_random_uuid(), query text, created_at timestamp default now());
-- Storage sugerido: criar buckets publicos chamados dynamicdoc-images, dynamicdoc-videos e dynamicdoc-files.


-- Academia Dynamic funcional
create table if not exists academy_tracks (
  id text primary key,
  title text not null,
  description text,
  category text,
  active boolean default true,
  created_at timestamp default now()
);

create table if not exists academy_lessons (
  id text primary key,
  track_id text references academy_tracks(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  duration text,
  type text default 'Aula',
  lesson_order int default 0,
  active boolean default true,
  created_at timestamp default now()
);

create table if not exists academy_progress (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  track_id text,
  lesson_id text,
  completed boolean default true,
  completed_at timestamp default now(),
  unique(user_key, lesson_id)
);

create table if not exists academy_certificates (
  id uuid primary key default gen_random_uuid(),
  user_key text not null,
  user_name text,
  track_id text,
  track_title text,
  issued_at timestamp default now(),
  unique(user_key, track_id)
);


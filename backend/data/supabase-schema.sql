-- Supabase 프로젝트의 SQL Editor에서 한 번만 실행하면 된다.
create table if not exists projects (
  id uuid primary key,
  title text not null default '',
  role text not null default '',
  description text not null default '',
  date text not null default '',
  member_count text not null default '',
  note text not null default '',
  video_url text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

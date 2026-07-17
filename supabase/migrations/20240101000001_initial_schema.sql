-- ============================================================
-- AI Smart Notebook — Full PostgreSQL Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── INSTITUTIONS ────────────────────────────────────────────
create table if not exists institutions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text,
  phone       text,
  email       text,
  logo_url    text,
  created_at  timestamptz default now()
);

-- ─── PROFILES ────────────────────────────────────────────────
create table if not exists profiles (
  id              uuid primary key references auth.users on delete cascade,
  role            text not null check (role in ('student','teacher','admin')),
  full_name       text not null,
  institution_id  uuid references institutions,
  employee_id     text unique,
  roll_number     text,
  grade           text,
  section         text,
  department      text,
  designation     text,
  phone           text,
  avatar_url      text,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── SUBJECTS ────────────────────────────────────────────────
create table if not exists subjects (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid references institutions,
  name            text not null,
  code            text not null,
  description     text,
  color           text default '#6366f1',
  icon            text,
  created_at      timestamptz default now()
);

-- ─── CLASSES ─────────────────────────────────────────────────
create table if not exists classes (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid references institutions,
  grade           text not null,
  section         text not null,
  teacher_id      uuid references profiles,
  academic_year   text default '2024-25',
  room            text,
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- ─── ENROLLMENTS ─────────────────────────────────────────────
create table if not exists enrollments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references profiles on delete cascade,
  class_id    uuid references classes on delete cascade,
  enrolled_at timestamptz default now(),
  unique (student_id, class_id)
);

-- ─── TIMETABLE ───────────────────────────────────────────────
create table if not exists timetable (
  id              uuid primary key default gen_random_uuid(),
  class_id        uuid references classes on delete cascade,
  subject_id      uuid references subjects,
  teacher_id      uuid references profiles,
  day_of_week     int not null check (day_of_week between 1 and 7), -- 1=Mon
  period_number   int not null,
  start_time      time not null,
  end_time        time not null,
  room            text,
  unique (class_id, day_of_week, period_number)
);

-- ─── ATTENDANCE ───────────────────────────────────────────────
create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references profiles on delete cascade,
  class_id    uuid references classes,
  date        date not null,
  status      text not null check (status in ('present','absent','late','leave')),
  noted_by    uuid references profiles,
  remarks     text,
  created_at  timestamptz default now(),
  unique (student_id, class_id, date)
);

-- ─── HOMEWORK ────────────────────────────────────────────────
create table if not exists homework (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid references profiles,
  class_id    uuid references classes,
  subject_id  uuid references subjects,
  title       text not null,
  description text,
  due_date    date,
  max_marks   int default 10,
  attachment_url text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists homework_submissions (
  id          uuid primary key default gen_random_uuid(),
  homework_id uuid references homework on delete cascade,
  student_id  uuid references profiles on delete cascade,
  content     text,
  file_url    text,
  marks_obtained numeric,
  feedback    text,
  status      text default 'submitted' check (status in ('submitted','graded','returned','late')),
  submitted_at timestamptz default now(),
  graded_at   timestamptz,
  unique (homework_id, student_id)
);

-- ─── ASSIGNMENTS ─────────────────────────────────────────────
create table if not exists assignments (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid references profiles,
  class_id    uuid references classes,
  subject_id  uuid references subjects,
  title       text not null,
  description text,
  type        text default 'individual' check (type in ('individual','group')),
  rubric      text,
  due_date    date,
  max_marks   int default 20,
  attachment_url text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists assignment_submissions (
  id              uuid primary key default gen_random_uuid(),
  assignment_id   uuid references assignments on delete cascade,
  student_id      uuid references profiles on delete cascade,
  content         text,
  file_url        text,
  marks_obtained  numeric,
  grade           text,
  feedback        text,
  status          text default 'submitted',
  submitted_at    timestamptz default now(),
  graded_at       timestamptz,
  unique (assignment_id, student_id)
);

-- ─── TESTS ───────────────────────────────────────────────────
create table if not exists tests (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid references profiles,
  class_id    uuid references classes,
  subject_id  uuid references subjects,
  title       text not null,
  type        text default 'unit' check (type in ('unit','chapter','mid-term','final','practice','mock')),
  date        date,
  start_time  time,
  duration_minutes int,
  max_marks   int not null default 100,
  syllabus    text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ─── MARKS ───────────────────────────────────────────────────
create table if not exists marks (
  id              uuid primary key default gen_random_uuid(),
  test_id         uuid references tests on delete cascade,
  student_id      uuid references profiles on delete cascade,
  marks_obtained  numeric not null,
  grade           text,
  remarks         text,
  entered_by      uuid references profiles,
  created_at      timestamptz default now(),
  unique (test_id, student_id)
);

-- ─── NOTES ───────────────────────────────────────────────────
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles on delete cascade,
  subject_id  uuid references subjects,
  chapter_key text,
  title       text not null default 'Untitled Note',
  content     text,
  is_shared   boolean default false,
  shared_with_class_id uuid references classes,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── RESOURCES ───────────────────────────────────────────────
create table if not exists resources (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid references institutions,
  uploaded_by     uuid references profiles,
  subject_id      uuid references subjects,
  class_id        uuid references classes,
  title           text not null,
  description     text,
  type            text default 'pdf' check (type in ('pdf','notes','worksheet','video','link','other')),
  file_url        text,
  file_path       text,
  file_size_bytes bigint,
  is_approved     boolean default false,
  is_ncert        boolean default false,
  download_count  int default 0,
  created_at      timestamptz default now()
);

-- ─── NOTICES ─────────────────────────────────────────────────
create table if not exists notices (
  id                uuid primary key default gen_random_uuid(),
  institution_id    uuid references institutions,
  created_by        uuid references profiles,
  title             text not null,
  content           text not null,
  category          text default 'General',
  priority          text default 'medium' check (priority in ('high','medium','low')),
  target_audience   text default 'all' check (target_audience in ('all','students','teachers','parents','admins')),
  is_published      boolean default false,
  published_at      timestamptz,
  expires_at        date,
  attachment_url    text,
  created_at        timestamptz default now()
);

-- ─── MESSAGES ────────────────────────────────────────────────
create table if not exists messages (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid references profiles on delete cascade,
  recipient_id  uuid references profiles,
  subject       text,
  body          text not null,
  is_read       boolean default false,
  is_broadcast  boolean default false,
  broadcast_to  text,
  created_at    timestamptz default now()
);

-- ─── CALENDAR EVENTS ─────────────────────────────────────────
create table if not exists calendar_events (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid references institutions,
  created_by      uuid references profiles,
  title           text not null,
  description     text,
  event_date      date not null,
  end_date        date,
  type            text default 'event' check (type in ('exam','holiday','meeting','event','workshop','sport')),
  target_audience text default 'all',
  created_at      timestamptz default now()
);

-- ─── ACHIEVEMENTS ────────────────────────────────────────────
create table if not exists achievements (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references profiles on delete cascade,
  title       text not null,
  description text,
  icon        text default '🏆',
  category    text default 'academic',
  earned_at   timestamptz default now()
);

-- ─── ACTIVITY LOGS ───────────────────────────────────────────
create table if not exists activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles,
  action      text not null,
  entity_type text,
  entity_id   uuid,
  details     jsonb,
  created_at  timestamptz default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_institution on profiles(institution_id);
create index if not exists idx_attendance_student on attendance(student_id);
create index if not exists idx_attendance_class_date on attendance(class_id, date);
create index if not exists idx_homework_class on homework(class_id);
create index if not exists idx_marks_student on marks(student_id);
create index if not exists idx_notes_user on notes(user_id);
create index if not exists idx_notices_institution on notices(institution_id);
create index if not exists idx_messages_recipient on messages(recipient_id);
create index if not exists idx_calendar_date on calendar_events(event_date);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table institutions enable row level security;
alter table profiles enable row level security;
alter table subjects enable row level security;
alter table classes enable row level security;
alter table enrollments enable row level security;
alter table timetable enable row level security;
alter table attendance enable row level security;
alter table homework enable row level security;
alter table homework_submissions enable row level security;
alter table assignments enable row level security;
alter table assignment_submissions enable row level security;
alter table tests enable row level security;
alter table marks enable row level security;
alter table notes enable row level security;
alter table resources enable row level security;
alter table notices enable row level security;
alter table messages enable row level security;
alter table calendar_events enable row level security;
alter table achievements enable row level security;
alter table activity_logs enable row level security;

-- ─── RLS POLICIES ────────────────────────────────────────────
-- Authenticated users can read institutions
create policy "institutions_read" on institutions for select to authenticated using (true);

-- Users can read and update their own profile; admins can read all
create policy "profiles_read_own" on profiles for select to authenticated using (
  auth.uid() = id or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "profiles_update_own" on profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_service" on profiles for insert to service_role with check (true);

-- Subjects — readable by all authenticated
create policy "subjects_read" on subjects for select to authenticated using (true);
create policy "subjects_write" on subjects for all to service_role using (true);

-- Classes — readable by all authenticated
create policy "classes_read" on classes for select to authenticated using (true);
create policy "classes_write" on classes for all to service_role using (true);

-- Enrollments
create policy "enrollments_read" on enrollments for select to authenticated using (true);
create policy "enrollments_write" on enrollments for all to service_role using (true);

-- Timetable
create policy "timetable_read" on timetable for select to authenticated using (true);
create policy "timetable_write" on timetable for all to service_role using (true);

-- Attendance — teachers/admins can insert; students can read own
create policy "attendance_read" on attendance for select to authenticated using (
  student_id = auth.uid() or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "attendance_write" on attendance for all to service_role using (true);

-- Homework
create policy "homework_read" on homework for select to authenticated using (true);
create policy "homework_write" on homework for all to service_role using (true);

create policy "hw_sub_read" on homework_submissions for select to authenticated using (
  student_id = auth.uid() or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "hw_sub_write" on homework_submissions for all to service_role using (true);

-- Assignments
create policy "assignments_read" on assignments for select to authenticated using (true);
create policy "assignments_write" on assignments for all to service_role using (true);
create policy "assign_sub_read" on assignment_submissions for select to authenticated using (
  student_id = auth.uid() or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "assign_sub_write" on assignment_submissions for all to service_role using (true);

-- Tests
create policy "tests_read" on tests for select to authenticated using (true);
create policy "tests_write" on tests for all to service_role using (true);

-- Marks — students can see own marks
create policy "marks_read" on marks for select to authenticated using (
  student_id = auth.uid() or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "marks_write" on marks for all to service_role using (true);

-- Notes — users can read/write own; teachers can read shared
create policy "notes_read" on notes for select to authenticated using (
  user_id = auth.uid() or is_shared = true
);
create policy "notes_write" on notes for all to authenticated using (user_id = auth.uid());
create policy "notes_service" on notes for all to service_role using (true);

-- Resources
create policy "resources_read" on resources for select to authenticated using (true);
create policy "resources_write" on resources for all to service_role using (true);

-- Notices — published notices visible to all authenticated
create policy "notices_read" on notices for select to authenticated using (
  is_published = true or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "notices_write" on notices for all to service_role using (true);

-- Messages — own messages only
create policy "messages_read" on messages for select to authenticated using (
  sender_id = auth.uid() or recipient_id = auth.uid()
);
create policy "messages_write" on messages for all to service_role using (true);

-- Calendar — readable by all
create policy "calendar_read" on calendar_events for select to authenticated using (true);
create policy "calendar_write" on calendar_events for all to service_role using (true);

-- Achievements
create policy "achievements_read" on achievements for select to authenticated using (
  student_id = auth.uid() or
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','teacher'))
);
create policy "achievements_write" on achievements for all to service_role using (true);

-- Activity logs — admins only
create policy "logs_read" on activity_logs for select to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "logs_write" on activity_logs for all to service_role using (true);

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('ncert-pdfs', 'ncert-pdfs', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('resources', 'resources', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;

create policy "ncert_read" on storage.objects for select using (bucket_id = 'ncert-pdfs');
create policy "ncert_upload" on storage.objects for insert to authenticated with check (bucket_id = 'ncert-pdfs');
create policy "resources_storage_read" on storage.objects for select to authenticated using (bucket_id = 'resources');
create policy "resources_storage_upload" on storage.objects for insert to authenticated with check (bucket_id = 'resources');
create policy "avatars_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_upload" on storage.objects for insert to authenticated with check (bucket_id = 'avatars');

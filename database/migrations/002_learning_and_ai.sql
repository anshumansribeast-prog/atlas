-- Course progress, practice and AI operations extensions.
-- Depends on database/migrations/001_core.sql.
BEGIN;

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  learner_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','completed','paused','dropped')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id,learner_ref)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  learner_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started','in_progress','completed')),
  completion_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (completion_percent BETWEEN 0 AND 100),
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lesson_id,learner_ref)
);

CREATE TABLE IF NOT EXISTS course_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  exercise_type TEXT NOT NULL DEFAULT 'short_answer'
    CHECK (exercise_type IN ('short_answer','multiple_choice','coding','project','reflection')),
  rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
  answer_key JSONB,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercise_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES course_exercises(id) ON DELETE CASCADE,
  learner_ref TEXT NOT NULL,
  response JSONB NOT NULL,
  score NUMERIC(6,2),
  feedback TEXT,
  evaluated_by TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_shared_knowledge_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  target_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  granted_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  CHECK (source_course_id <> target_course_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_knowledge_grant
ON course_shared_knowledge_grants(source_course_id,target_course_id)
WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS model_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES model_endpoints(id) ON DELETE CASCADE,
  external_model_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('healthy','degraded','unavailable','unauthorized','unknown')),
  latency_ms INTEGER,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  error_summary TEXT
);
CREATE INDEX IF NOT EXISTS idx_model_health_latest
ON model_health_checks(endpoint_id,checked_at DESC);

CREATE TABLE IF NOT EXISTS ai_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  model_ref TEXT NOT NULL,
  evaluation_suite TEXT NOT NULL,
  test_case_count INTEGER NOT NULL DEFAULT 0,
  passed_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  score NUMERIC(6,3),
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  report JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS catalog_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES catalog_items(id) ON DELETE SET NULL,
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_learner ON lesson_progress(learner_ref,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_learner ON exercise_submissions(learner_ref,submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_change_item ON catalog_change_log(item_id,changed_at DESC);

COMMIT;

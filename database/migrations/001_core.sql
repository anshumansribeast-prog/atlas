-- AI Atlas core schema — PostgreSQL 16+
-- Apply once to a fresh database. All catalog facts should be source-backed.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  provider_type TEXT NOT NULL DEFAULT 'company',
  headquarters_country TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN
    ('tool','model','agent','api','framework','dataset','course','research','platform')),
  short_description TEXT NOT NULL,
  long_description TEXT,
  official_url TEXT NOT NULL,
  documentation_url TEXT,
  repository_url TEXT,
  access_type TEXT NOT NULL DEFAULT 'hosted'
    CHECK (access_type IN ('hosted','open_weights','open_source','local','hybrid','research','unknown')),
  lifecycle_status TEXT NOT NULL DEFAULT 'active'
    CHECK (lifecycle_status IN ('active','preview','deprecated','retired','unknown')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'unreviewed'
    CHECK (verification_status IN ('unreviewed','verified','needs_review','rejected')),
  first_seen_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_categories (
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY(item_id, category_id)
);

CREATE TABLE IF NOT EXISTS capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  capability_group TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS item_capabilities (
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  capability_id UUID NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  support_level TEXT NOT NULL DEFAULT 'documented'
    CHECK (support_level IN ('native','supported','via_integration','limited','not_supported','unknown')),
  evidence_source_id UUID,
  notes TEXT,
  PRIMARY KEY(item_id, capability_id)
);

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  publisher TEXT,
  source_type TEXT NOT NULL DEFAULT 'official_docs'
    CHECK (source_type IN ('official_docs','official_pricing','official_blog','repository','paper','benchmark','community','other')),
  published_at TIMESTAMPTZ,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_hash TEXT,
  trust_level SMALLINT NOT NULL DEFAULT 5 CHECK (trust_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_sources (
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL DEFAULT 'general',
  claim_summary TEXT NOT NULL,
  confidence NUMERIC(4,3) CHECK (confidence BETWEEN 0 AND 1),
  PRIMARY KEY(item_id, source_id, claim_type)
);

ALTER TABLE item_capabilities
  DROP CONSTRAINT IF EXISTS item_capabilities_evidence_source_id_fkey;
ALTER TABLE item_capabilities
  ADD CONSTRAINT item_capabilities_evidence_source_id_fkey
  FOREIGN KEY (evidence_source_id) REFERENCES sources(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS model_profiles (
  item_id UUID PRIMARY KEY REFERENCES catalog_items(id) ON DELETE CASCADE,
  model_id TEXT,
  model_family TEXT,
  modality_input TEXT[] NOT NULL DEFAULT ARRAY['text'],
  modality_output TEXT[] NOT NULL DEFAULT ARRAY['text'],
  context_window_tokens INTEGER CHECK (context_window_tokens > 0),
  max_output_tokens INTEGER CHECK (max_output_tokens > 0),
  parameter_count TEXT,
  license_name TEXT,
  license_url TEXT,
  weights_available BOOLEAN,
  tool_calling BOOLEAN,
  structured_output BOOLEAN,
  vision BOOLEAN,
  audio BOOLEAN,
  video BOOLEAN,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS pricing_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  billing_type TEXT NOT NULL CHECK (billing_type IN ('free','freemium','subscription','usage_based','one_time','custom','unknown')),
  price_amount NUMERIC(14,6),
  currency CHAR(3),
  unit TEXT,
  region TEXT,
  effective_from DATE,
  effective_until DATE,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_current BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  CHECK (price_amount IS NULL OR price_amount >= 0)
);
CREATE INDEX IF NOT EXISTS idx_pricing_item_current ON pricing_offers(item_id, is_current, checked_at DESC);

CREATE TABLE IF NOT EXISTS model_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  adapter_type TEXT NOT NULL CHECK (adapter_type IN ('openai_compatible','anthropic','google','ollama','custom')),
  base_url TEXT,
  secret_ref TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (secret_ref IS NULL OR secret_ref !~* '(sk-|api[_-]?key=)')
);
CREATE TABLE IF NOT EXISTS endpoint_models (
  endpoint_id UUID NOT NULL REFERENCES model_endpoints(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  external_model_id TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY(endpoint_id, external_model_id)
);

CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  benchmark_name TEXT NOT NULL,
  score NUMERIC(14,6),
  score_unit TEXT,
  evaluation_date DATE,
  methodology_url TEXT,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  sample_size INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS collection_items (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(collection_id,item_id)
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL DEFAULT 'beginner',
  language TEXT NOT NULL DEFAULT 'en',
  provider_name TEXT,
  official_url TEXT,
  is_free BOOLEAN,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS course_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(course_id,slug)
);
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES course_tracks(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  lesson_body TEXT,
  learning_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(track_id,slug)
);
CREATE TABLE IF NOT EXISTS course_knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  source_url TEXT,
  storage_key TEXT,
  mime_type TEXT,
  checksum TEXT,
  processing_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (processing_status IN ('pending','processing','indexed','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS course_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES course_knowledge_documents(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  embedding JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(document_id,chunk_index)
);
CREATE INDEX IF NOT EXISTS idx_course_chunks_course ON course_knowledge_chunks(course_id);

CREATE TABLE IF NOT EXISTS course_model_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  endpoint_id UUID NOT NULL REFERENCES model_endpoints(id) ON DELETE CASCADE,
  external_model_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary','fallback','embedding','grader')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id,role)
);

CREATE TABLE IF NOT EXISTS tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  learner_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES tutor_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system','tool')),
  content TEXT NOT NULL,
  cited_chunk_ids UUID[] NOT NULL DEFAULT '{}',
  model_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  records_created INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_ref TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS model_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID REFERENCES model_endpoints(id) ON DELETE SET NULL,
  external_model_id TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  latency_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_catalog_type_status ON catalog_items(item_type,lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_catalog_provider ON catalog_items(provider_id);
CREATE INDEX IF NOT EXISTS idx_sources_checked ON sources(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_search ON catalog_items
  USING GIN (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(long_description,'')));
CREATE INDEX IF NOT EXISTS idx_tutor_messages_session ON tutor_messages(session_id,created_at);
CREATE INDEX IF NOT EXISTS idx_usage_created ON model_usage_events(created_at DESC);

COMMIT;

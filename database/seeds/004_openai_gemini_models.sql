-- Additional model catalog entries, verified against official provider docs.
--
-- Sources (both checked 2026-11-20):
--   OpenAI  https://platform.openai.com/docs/models
--   Google  https://ai.google.dev/gemini-api/docs/models
--
-- Only values printed on those pages are stored. Where a page does not state a
-- value (for example Gemini pricing on the models page), the column is left
-- NULL instead of being guessed. Re-runnable: every insert upserts by slug.

BEGIN;

-- 1. Record where these facts came from.
INSERT INTO sources(canonical_url,title,publisher,source_type,checked_at,trust_level,notes)
VALUES
  ('https://platform.openai.com/docs/models',
   'Models | OpenAI API','OpenAI','official_docs','2026-11-20',5,
   'Official OpenAI model catalog. Model IDs, context window, max output and base token prices as displayed on the check date.'),
  ('https://ai.google.dev/gemini-api/docs/models',
   'Gemini API — Models','Google','official_docs','2026-11-20',5,
   'Official Gemini API model list. Model codes, context window, max output and supported modalities as displayed on the check date.')
ON CONFLICT(canonical_url) DO UPDATE
  SET checked_at = EXCLUDED.checked_at,
      title = EXCLUDED.title,
      notes = EXCLUDED.notes;

-- 2. Catalog items.
INSERT INTO catalog_items(
  slug, provider_id, name, item_type, short_description, long_description,
  official_url, documentation_url, access_type, lifecycle_status,
  is_verified, verification_status, first_seen_at, last_verified_at
)
SELECT
  v.slug, p.id, v.name, 'model', v.short, v.long, v.docs, v.docs,
  'hosted', 'active', true, 'verified', now(), '2026-11-20'
FROM (VALUES
  ('gpt-6-2-astra','GPT-6.2 Astra','openai-gpt-6-2-astra',
   'OpenAI flagship model for complex reasoning and coding.',
   'Positioned by OpenAI as the most capable model for hard projects end to end. Text and image input, text output, vision and tool use.',
   'https://platform.openai.com/docs/models','openai'),
  ('gpt-6-2-sol','GPT-6.2 Sol','openai-gpt-6-2-sol',
   'OpenAI everyday-work model balancing intelligence and cost.',
   'OpenAI positions Sol as the go-to model for everyday work, from coding to powering agents at scale.',
   'https://platform.openai.com/docs/models','openai'),
  ('gpt-6-1-terra','GPT-6.1 Terra','openai-gpt-6-1-terra',
   'Fast OpenAI model for visual reasoning and computer use.',
   'OpenAI describes Terra as fast and efficient for visual reasoning, precise computer use and natural writing.',
   'https://platform.openai.com/docs/models','openai'),
  ('gpt-6-luna','GPT-6 Luna','openai-gpt-6-luna',
   'OpenAI most efficient model for high-volume tasks.',
   'OpenAI positions Luna as the most efficient model for focused, high-volume workloads.',
   'https://platform.openai.com/docs/models','openai'),
  ('gemini-4-carbon','Gemini 4 Carbon','gemini-4-carbon',
   'Google strongest reasoning model for complex engineering and science.',
   'Google describes Carbon as the strongest reasoning model, built for complex software engineering, multimodal knowledge work, scientific reasoning and cybersecurity defence.',
   'https://ai.google.dev/gemini-api/docs/models','google'),
  ('gemini-4-neon','Gemini 4 Neon','gemini-4-neon',
   'Google frontier model for fast end-to-end task completion.',
   'Google describes Neon as frontier-level intelligence with fast end-to-end task completion across software engineering, knowledge work and science workflows.',
   'https://ai.google.dev/gemini-api/docs/models','google'),
  ('gemini-4-hydrogen','Gemini 4 Hydrogen','gemini-4-hydrogen',
   'Google general-purpose Gemini 4 model for everyday work.',
   'Google positions Hydrogen as bringing cutting-edge intelligence to everyone, with speed and efficiency for everyday coding and agentic workflows.',
   'https://ai.google.dev/gemini-api/docs/models','google'),
  ('gemini-4-argon','Gemini 4 Argon','gemini-4-argon',
   'Google efficient Gemini 4 reasoning model with lower token spend.',
   'Google describes Argon as an efficient frontier reasoning model delivering faster responses and lower token spend per turn than Carbon on complex coding, agentic, math and science tasks.',
   'https://ai.google.dev/gemini-api/docs/models','google')
) AS v(slug, name, model_id, short, long, docs, provider_slug)
JOIN providers p ON p.slug = v.provider_slug
ON CONFLICT(slug) DO UPDATE
  SET name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      long_description = EXCLUDED.long_description,
      documentation_url = EXCLUDED.documentation_url,
      lifecycle_status = 'active',
      is_verified = true,
      verification_status = 'verified',
      last_verified_at = EXCLUDED.last_verified_at,
      updated_at = now();

-- 3. Model specifications. Every value below is copied from the source page.
INSERT INTO model_profiles(
  item_id, model_id, model_family, modality_input, modality_output,
  context_window_tokens, max_output_tokens, weights_available,
  tool_calling, vision, notes
)
SELECT ci.id, v.model_id, v.family, v.mod_in, ARRAY['text'], v.ctx, v.maxout,
       false, true, true, v.notes
FROM (VALUES
  ('gpt-6-2-astra','gpt-6.2-astra','GPT-6.2',ARRAY['text','image'],1050000,128000,
   'OpenAI model catalog: context window 1.05M tokens, max output 128K tokens, knowledge cutoff May 18 2026. Tools: functions, web search, file search, computer use.'),
  ('gpt-6-2-sol','gpt-6.2-sol','GPT-6.2',ARRAY['text','image'],1050000,128000,
   'OpenAI model catalog: context window 1.05M tokens, max output 128K tokens, knowledge cutoff Jun 1 2026.'),
  ('gpt-6-1-terra','gpt-6.1-terra','GPT-6.1',ARRAY['text','image'],1050000,128000,
   'OpenAI model catalog: context window 1.05M tokens, max output 128K tokens, knowledge cutoff Jun 1 2026.'),
  ('gpt-6-luna','gpt-6-luna','GPT-6',ARRAY['text','image'],1050000,128000,
   'OpenAI model catalog: context window 1.05M tokens, max output 128K tokens, knowledge cutoff May 18 2026.'),
  ('gemini-4-carbon','gemini-4-carbon','Gemini 4',ARRAY['text','image','audio','video','pdf'],1000000,64000,
   'Gemini API model list: context 1M tokens, max output stated as "64K / 1M tokens". Modalities: text, image, audio, video, PDF. The 1M output figure is a separate mode; 64K is stored as the standard limit.'),
  ('gemini-4-neon','gemini-4-neon','Gemini 4',ARRAY['text','image','audio','video','pdf'],1000000,64000,
   'Gemini API model list: context 1M tokens, max output stated as "64K / 1M tokens". Modalities: text, image, audio, video, PDF.'),
  ('gemini-4-hydrogen','gemini-4-hydrogen','Gemini 4',ARRAY['text','image','audio','video','pdf'],1000000,64000,
   'Gemini API model list: context 1M tokens, max output stated as "64K / 1M tokens". Modalities: text, image, audio, video, PDF.'),
  ('gemini-4-argon','gemini-4-argon','Gemini 4',ARRAY['text','image','audio','video','pdf'],1000000,64000,
   'Gemini API model list: context 1M tokens, max output stated as "64K / 1M tokens". Modalities: text, image, audio, video, PDF.')
) AS v(slug, model_id, family, mod_in, ctx, maxout, notes)
JOIN catalog_items ci ON ci.slug = v.slug
ON CONFLICT(item_id) DO UPDATE
  SET model_id = EXCLUDED.model_id,
      model_family = EXCLUDED.model_family,
      modality_input = EXCLUDED.modality_input,
      context_window_tokens = EXCLUDED.context_window_tokens,
      max_output_tokens = EXCLUDED.max_output_tokens,
      weights_available = EXCLUDED.weights_available,
      tool_calling = EXCLUDED.tool_calling,
      vision = EXCLUDED.vision,
      notes = EXCLUDED.notes;

-- 4. Capabilities. Only claims both source pages actually make are recorded:
--    every listed model accepts text, and the published modality lists include
--    image input.
INSERT INTO item_capabilities(item_id, capability_id, support_level, notes)
SELECT ci.id, c.id, 'native', v.notes
FROM (VALUES
  ('gpt-6-2-astra','OpenAI: all latest models support text and image input, text output, and vision.'),
  ('gpt-6-2-sol','OpenAI: all latest models support text and image input, text output, and vision.'),
  ('gpt-6-1-terra','OpenAI: all latest models support text and image input, text output, and vision.'),
  ('gpt-6-luna','OpenAI: all latest models support text and image input, text output, and vision.'),
  ('gemini-4-carbon','Gemini API model list: modalities text, image, audio, video, PDF.'),
  ('gemini-4-neon','Gemini API model list: modalities text, image, audio, video, PDF.'),
  ('gemini-4-hydrogen','Gemini API model list: modalities text, image, audio, video, PDF.'),
  ('gemini-4-argon','Gemini API model list: modalities text, image, audio, video, PDF.')
) AS v(slug, notes)
JOIN catalog_items ci ON ci.slug = v.slug
JOIN capabilities c ON c.slug IN ('chat','multimodal')
ON CONFLICT(item_id, capability_id) DO UPDATE SET notes = EXCLUDED.notes;

-- 5. Pricing for the OpenAI models, which the catalog page publishes.
--    Gemini prices are not printed on the models page, so none are stored.
INSERT INTO pricing_offers(
  item_id, plan_name, billing_type, price_amount, currency, unit, region,
  effective_from, source_id, checked_at, is_current, notes
)
SELECT ci.id, v.plan_name, 'usage_based', v.amount, 'USD', v.unit, 'global',
       NULL, s.id, '2026-11-20', true, v.notes
FROM (VALUES
  ('gpt-6-2-astra','Standard API — input',8.000000,'per 1M input tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-2-astra','Standard API — output',40.000000,'per 1M output tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-2-sol','Standard API — input',2.000000,'per 1M input tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-2-sol','Standard API — output',10.000000,'per 1M output tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-1-terra','Standard API — input',1.000000,'per 1M input tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-1-terra','Standard API — output',5.000000,'per 1M output tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-luna','Standard API — input',0.100000,'per 1M input tokens','Base price per million tokens as listed by OpenAI.'),
  ('gpt-6-luna','Standard API — output',0.500000,'per 1M output tokens','Base price per million tokens as listed by OpenAI.')
) AS v(slug, plan_name, amount, unit, notes)
JOIN catalog_items ci ON ci.slug = v.slug
JOIN sources s ON s.canonical_url = 'https://platform.openai.com/docs/models'
WHERE NOT EXISTS (
  SELECT 1 FROM pricing_offers po
  WHERE po.item_id = ci.id AND po.plan_name = v.plan_name AND po.checked_at = '2026-11-20'
);

-- 6. Link every item to the source that backs its claims.
INSERT INTO item_sources(item_id, source_id, claim_type, claim_summary, confidence)
SELECT ci.id, s.id, v.claim_type, v.summary, v.confidence
FROM (VALUES
  ('gpt-6-2-astra','https://platform.openai.com/docs/models','model_specification','Official catalog lists the model ID, 1.05M context window, 128K max output, tool support and base token prices.',0.99),
  ('gpt-6-2-sol','https://platform.openai.com/docs/models','model_specification','Official catalog lists the model ID, 1.05M context window, 128K max output, tool support and base token prices.',0.99),
  ('gpt-6-1-terra','https://platform.openai.com/docs/models','model_specification','Official catalog lists the model ID, 1.05M context window, 128K max output, tool support and base token prices.',0.99),
  ('gpt-6-luna','https://platform.openai.com/docs/models','model_specification','Official catalog lists the model ID, 1.05M context window, 128K max output, tool support and base token prices.',0.99),
  ('gemini-4-carbon','https://ai.google.dev/gemini-api/docs/models','model_specification','Official model list states the model code, 1M context window, max output and supported modalities.',0.99),
  ('gemini-4-neon','https://ai.google.dev/gemini-api/docs/models','model_specification','Official model list states the model code, 1M context window, max output and supported modalities.',0.99),
  ('gemini-4-hydrogen','https://ai.google.dev/gemini-api/docs/models','model_specification','Official model list states the model code, 1M context window, max output and supported modalities.',0.99),
  ('gemini-4-argon','https://ai.google.dev/gemini-api/docs/models','model_specification','Official model list states the model code, 1M context window, max output and supported modalities.',0.99)
) AS v(slug, source_url, claim_type, summary, confidence)
JOIN catalog_items ci ON ci.slug = v.slug
JOIN sources s ON s.canonical_url = v.source_url
ON CONFLICT(item_id, source_id, claim_type) DO UPDATE SET claim_summary = EXCLUDED.claim_summary;

COMMIT;

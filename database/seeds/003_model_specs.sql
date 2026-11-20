-- Model specifications taken from Anthropic's official models overview.
--
-- Source: https://platform.claude.com/docs/en/models/overview
-- Checked: 2026-11-20
--
-- Only fields the official page states are written here. Prices are
-- deliberately NOT stored in a seed: they change, so they belong in
-- pricing_offers with an explicit checked_at timestamp and a pricing source.
-- Re-run safely.

BEGIN;

UPDATE model_profiles mp
SET context_window_tokens = v.context_window_tokens,
    max_output_tokens     = v.max_output_tokens,
    notes                 = v.notes
FROM (
  VALUES
    ('claude-fable-5-2',  1000000, 128000,
     'Context window and max output from the Anthropic models overview (checked 2026-11-20). Adaptive thinking, always on.'),
    ('claude-opus-5-5',   1000000, 128000,
     'Context window and max output from the Anthropic models overview (checked 2026-11-20). Recommended default for most workloads.'),
    ('claude-sonnet-5-5', 1000000, 128000,
     'Context window and max output from the Anthropic models overview (checked 2026-11-20). Speed/intelligence balance.'),
    ('claude-haiku-5-5',  1000000, 128000,
     'Context window and max output from the Anthropic models overview (checked 2026-11-20). Optimised for latency and volume.')
) AS v(slug, context_window_tokens, max_output_tokens, notes)
JOIN catalog_items ci ON ci.slug = v.slug
WHERE mp.item_id = ci.id;

COMMIT;

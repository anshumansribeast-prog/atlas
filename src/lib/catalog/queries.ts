import { query, queryOne, withTransaction } from "../db/pg";
import type { AIModel, AITool, PricingModel } from "../db/schema";

/**
 * Read models for the ATLAS catalog.
 *
 * Everything here queries PostgreSQL directly. There is no in-memory fallback:
 * if the database is unreachable the caller gets an error, because silently
 * serving stale seed data would make the directory lie about its freshness.
 */

export type CatalogItemType =
  | "tool"
  | "model"
  | "agent"
  | "api"
  | "framework"
  | "dataset"
  | "course"
  | "research"
  | "platform";

export interface CatalogItemRow {
  id: string;
  slug: string;
  name: string;
  item_type: CatalogItemType;
  short_description: string;
  long_description: string | null;
  official_url: string;
  documentation_url: string | null;
  repository_url: string | null;
  access_type: string;
  lifecycle_status: string;
  is_verified: boolean;
  verification_status: string;
  last_verified_at: Date | null;
  provider_slug: string | null;
  provider_name: string | null;
  provider_url: string | null;
  categories: string[];
  capabilities: string[];
  source_urls: string[];
  billing_type: string | null;
  plan_name: string | null;
  price_summary: string | null;
  price_offer_count: number;
}

const ITEM_COLUMNS = `
  ci.id,
  ci.slug,
  ci.name,
  ci.item_type,
  ci.short_description,
  ci.long_description,
  ci.official_url,
  ci.documentation_url,
  ci.repository_url,
  ci.access_type,
  ci.lifecycle_status,
  ci.is_verified,
  ci.verification_status,
  ci.last_verified_at,
  p.slug AS provider_slug,
  p.name AS provider_name,
  p.website_url AS provider_url,
  COALESCE((
    SELECT array_agg(cat.name ORDER BY cat.sort_order, cat.name)
    FROM item_categories ic
    JOIN categories cat ON cat.id = ic.category_id
    WHERE ic.item_id = ci.id
  ), '{}') AS categories,
  COALESCE((
    SELECT array_agg(c.name ORDER BY c.capability_group, c.name)
    FROM item_capabilities icap
    JOIN capabilities c ON c.id = icap.capability_id
    WHERE icap.item_id = ci.id
  ), '{}') AS capabilities,
  COALESCE((
    SELECT array_agg(DISTINCT s.canonical_url)
    FROM item_sources isrc
    JOIN sources s ON s.id = isrc.source_id
    WHERE isrc.item_id = ci.id
  ), '{}') AS source_urls,
  po.billing_type,
  po.plan_name,
  pr.price_summary,
  COALESCE(pr.price_offer_count, 0)::int AS price_offer_count
`;

const ITEM_JOINS = `
  FROM catalog_items ci
  LEFT JOIN providers p ON p.id = ci.provider_id
  LEFT JOIN LATERAL (
    SELECT billing_type, plan_name
    FROM pricing_offers
    WHERE item_id = ci.id AND is_current
    ORDER BY checked_at DESC
    LIMIT 1
  ) po ON true
  LEFT JOIN LATERAL (
    SELECT string_agg(
             regexp_replace(plan_name, '^Standard API — ', '') || ': ' ||
             trim(trailing '.' from trim(trailing '0' from price_amount::text)) || ' ' ||
             currency || ' ' || unit,
             ' | ' ORDER BY plan_name
           ) AS price_summary,
           count(*) AS price_offer_count
    FROM pricing_offers
    WHERE item_id = ci.id AND is_current AND price_amount IS NOT NULL
  ) pr ON true
`;

export interface ListOptions {
  /** Restrict to one catalog item type. */
  type?: CatalogItemType;
  /** Restrict to any of several catalog item types. */
  types?: CatalogItemType[];
  /** Case-insensitive category name match. */
  category?: string;
  /** Full-text search across name and description. */
  search?: string;
  /** Only return records an editor has verified. */
  verifiedOnly?: boolean;
  limit?: number;
  offset?: number;
}

export async function listCatalogItems(options: ListOptions = {}): Promise<CatalogItemRow[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (options.type) {
    params.push(options.type);
    where.push(`ci.item_type = $${params.length}`);
  }

  if (options.types && options.types.length > 0) {
    params.push(options.types);
    where.push(`ci.item_type = ANY($${params.length}::text[])`);
  }

  if (options.category && options.category !== "All") {
    params.push(options.category);
    where.push(`EXISTS (
      SELECT 1 FROM item_categories ic
      JOIN categories cat ON cat.id = ic.category_id
      WHERE ic.item_id = ci.id AND lower(cat.name) = lower($${params.length})
    )`);
  }

  if (options.search) {
    params.push(options.search);
    where.push(`to_tsvector('english',
      coalesce(ci.name, '') || ' ' || coalesce(ci.short_description, '') || ' ' || coalesce(ci.long_description, '')
    ) @@ plainto_tsquery('english', $${params.length})`);
  }

  if (options.verifiedOnly) {
    where.push(`ci.is_verified = true`);
  }

  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200);
  params.push(limit);
  const limitPlaceholder = `$${params.length}`;

  params.push(Math.max(options.offset ?? 0, 0));
  const offsetPlaceholder = `$${params.length}`;

  const sql = `
    SELECT ${ITEM_COLUMNS}
    ${ITEM_JOINS}
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY ci.name ASC
    LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
  `;

  return query<CatalogItemRow>(sql, params);
}

export async function countCatalogItems(options: ListOptions = {}): Promise<number> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (options.type) {
    params.push(options.type);
    where.push(`ci.item_type = $${params.length}`);
  }
  if (options.search) {
    params.push(options.search);
    where.push(`to_tsvector('english',
      coalesce(ci.name, '') || ' ' || coalesce(ci.short_description, '') || ' ' || coalesce(ci.long_description, '')
    ) @@ plainto_tsquery('english', $${params.length})`);
  }

  const rows = await query<{ count: number }>(
    `SELECT count(*)::int AS count FROM catalog_items ci ${where.length ? `WHERE ${where.join(" AND ")}` : ""}`,
    params
  );
  return rows[0]?.count ?? 0;
}

export async function getCatalogItemBySlug(slug: string): Promise<CatalogItemRow | null> {
  return queryOne<CatalogItemRow>(
    `SELECT ${ITEM_COLUMNS} ${ITEM_JOINS} WHERE ci.slug = $1 LIMIT 1`,
    [slug]
  );
}

export interface ModelProfileRow {
  item_id: string;
  model_id: string | null;
  model_family: string | null;
  modality_input: string[];
  modality_output: string[];
  context_window_tokens: number | null;
  max_output_tokens: number | null;
  parameter_count: string | null;
  license_name: string | null;
  license_url: string | null;
  weights_available: boolean | null;
  tool_calling: boolean | null;
  structured_output: boolean | null;
  vision: boolean | null;
  audio: boolean | null;
  video: boolean | null;
  notes: string | null;
}

export async function listModelProfiles(itemIds: string[]): Promise<ModelProfileRow[]> {
  if (itemIds.length === 0) return [];
  return query<ModelProfileRow>(
    `SELECT item_id, model_id, model_family, modality_input, modality_output,
            context_window_tokens::int, max_output_tokens::int, parameter_count,
            license_name, license_url, weights_available, tool_calling,
            structured_output, vision, audio, video, notes
     FROM model_profiles
     WHERE item_id = ANY($1::uuid[])`,
    [itemIds]
  );
}

export async function listCategories(): Promise<
  { id: string; slug: string; name: string; description: string | null; itemCount: number }[]
> {
  return query<{ id: string; slug: string; name: string; description: string | null; itemCount: number }>(
    `SELECT cat.id, cat.slug, cat.name, cat.description,
            (SELECT count(*)::int FROM item_categories ic WHERE ic.category_id = cat.id) AS "itemCount"
     FROM categories cat
     ORDER BY cat.sort_order, cat.name`
  );
}

/* ------------------------------------------------------------------ *
 * Mapping from database rows to the shapes the interface already uses *
 * ------------------------------------------------------------------ */

const PRICING_MAP: Record<string, PricingModel> = {
  free: "Free",
  freemium: "Freemium",
  subscription: "Paid",
  usage_based: "Paid",
  one_time: "Paid",
  custom: "Contact",
  unknown: "Contact",
};

function pricingLabel(row: CatalogItemRow): PricingModel {
  if (row.access_type === "open_source" || row.access_type === "open_weights") return "Open Source";
  if (row.billing_type && PRICING_MAP[row.billing_type]) return PRICING_MAP[row.billing_type];
  return "Contact";
}

function pricingDetail(row: CatalogItemRow): string {
  if (row.price_summary) {
    return `Official list price — ${row.price_summary}. Source checked 2026-11-20; confirm on the provider pricing page before relying on it.`;
  }
  if (!row.billing_type) {
    return "No official pricing recorded yet. Verify on the provider site before relying on it.";
  }
  const plan = row.plan_name ? `${row.plan_name}: ` : "";
  return `${plan}${row.billing_type.replace(/_/g, " ")}. Confirm current price on the official pricing page.`;
}

function formatContextWindow(tokens: number | null): string {
  if (!tokens) return "Not published";
  if (tokens >= 1_000_000) {
    const millions = Math.round((tokens / 1_000_000) * 100) / 100;
    return `${millions}M tokens`;
  }
  if (tokens >= 1_000) {
    const thousands = Math.round((tokens / 1_000) * 10) / 10;
    return `${thousands}K tokens`;
  }
  return `${tokens} tokens`;
}

/** Map a catalog tool/platform row onto the directory's `AITool` shape. */
export function toToolDto(row: CatalogItemRow): AITool {
  const followedDate = row.last_verified_at ?? null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories[0] ?? "Uncategorised",
    tagline: row.short_description,
    description: row.long_description ?? row.short_description,
    beginnerExplanation: row.long_description ?? row.short_description,
    websiteUrl: row.official_url,
    logoUrl: undefined,
    pricingModel: pricingLabel(row),
    pricingDetails: pricingDetail(row),
    isVerified: row.is_verified,
    lastVerifiedDate: followedDate ? followedDate.toISOString().slice(0, 10) : "",
    platforms: ["Web"],
    capabilities: row.capabilities,
    // No community review data is stored yet, so these stay empty rather
    // than inventing pros, cons or star ratings.
    pros: [],
    cons: [],
    alternatives: [],
    useCases: row.categories,
    rating: 0,
    ratingCount: 0,
  };
}

function modelCategory(profile: ModelProfileRow | undefined): AIModel["category"] {
  if (!profile) return "LLM";
  const inputs = new Set([...(profile.modality_input ?? []), ...(profile.modality_output ?? [])]);
  if (inputs.has("image") || inputs.has("audio") || inputs.has("video")) return "Multimodal";
  if (profile.vision) return "Vision";
  if (inputs.has("audio")) return "Audio";
  if (inputs.has("embedding")) return "Embedding";
  return "LLM";
}

function modelCapabilities(row: CatalogItemRow, profile: ModelProfileRow | undefined): string[] {
  const caps = new Set(row.capabilities);
  if (profile?.tool_calling) caps.add("Tool calling");
  if (profile?.structured_output) caps.add("Structured output");
  if (profile?.vision) caps.add("Vision input");
  if (profile?.audio) caps.add("Audio input");
  if (profile?.video) caps.add("Video input");
  return Array.from(caps);
}

/** Map a catalog model row plus its profile onto the `AIModel` shape. */
export function toModelDto(row: CatalogItemRow, profile: ModelProfileRow | undefined): AIModel {
  const contextWindow = formatContextWindow(profile?.context_window_tokens ?? null);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    organization: row.provider_name ?? "Unknown provider",
    category: modelCategory(profile),
    isOpenWeights: Boolean(profile?.weights_available),
    license:
      profile?.license_name ??
      (row.access_type === "hosted" ? "Proprietary (hosted API)" : "Not published"),
    contextWindow,
    capabilities: modelCapabilities(row, profile),
    description: row.long_description ?? row.short_description,
    architectureDetails: profile?.notes ?? "No architecture notes recorded yet.",
    officialDocUrl: row.documentation_url ?? row.official_url,
    benchmarks: undefined,
    limitations: [],
    releaseDate: "",
    pricingDetails: row.price_summary
      ? `${row.price_summary} (checked 2026-11-20)`
      : undefined,
  };
}

/* --------------------------------------- *
 * Community submissions (write path)      *
 * --------------------------------------- */

export interface SubmissionInput {
  name: string;
  slug: string;
  category: string;
  officialUrl: string;
  shortDescription: string;
  longDescription?: string;
}

/**
 * Store a community submission as an unverified catalog item and record who
 * did what in the audit log. Editors promote it later from the admin queue.
 */
export async function createCatalogSubmission(
  input: SubmissionInput,
  actorRef = "anonymous"
): Promise<{ id: string; slug: string }> {
  return withTransaction(async (client) => {
    const inserted = await client.query<{ id: string; slug: string }>(
      `INSERT INTO catalog_items (
         slug, name, item_type, short_description, long_description,
         official_url, access_type, lifecycle_status, is_verified, verification_status
       ) VALUES ($1, $2, 'tool', $3, $4, $5, 'hosted', 'active', false, 'unreviewed')
       ON CONFLICT (slug) DO NOTHING
       RETURNING id, slug`,
      [input.slug, input.name, input.shortDescription, input.longDescription ?? null, input.officialUrl]
    );

    const row = inserted.rows[0];
    if (!row) {
      throw new Error(`A catalog entry with the slug "${input.slug}" already exists.`);
    }

    await client.query(
      `INSERT INTO item_categories (item_id, category_id)
       SELECT $1, id FROM categories WHERE lower(name) = lower($2)
       ON CONFLICT DO NOTHING`,
      [row.id, input.category]
    );

    await client.query(
      `INSERT INTO audit_events (actor_ref, action, target_type, target_id, metadata)
       VALUES ($1, 'catalog.submission.create', 'catalog_item', $2, $3::jsonb)`,
      [actorRef, row.id, JSON.stringify({ slug: row.slug, category: input.category })]
    );

    return row;
  });
}

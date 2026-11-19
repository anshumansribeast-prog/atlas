-- Useful discovery queries for the AI Atlas API and admin console.

-- 1. Search the catalog by name and description.
SELECT id,slug,name,item_type,short_description,official_url,verification_status,last_verified_at
FROM catalog_items
WHERE to_tsvector('english',coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(long_description,''))
      @@ plainto_tsquery('english','coding assistant')
ORDER BY is_verified DESC,last_verified_at DESC NULLS LAST,name;

-- 2. List coding tools with evidence-backed code-generation capability.
SELECT i.name,p.name AS provider,ic.support_level,s.canonical_url AS evidence
FROM catalog_items i
JOIN providers p ON p.id=i.provider_id
JOIN item_capabilities ic ON ic.item_id=i.id
JOIN capabilities c ON c.id=ic.capability_id AND c.slug='code-generation'
LEFT JOIN sources s ON s.id=ic.evidence_source_id
WHERE i.item_type IN ('tool','platform','agent') AND i.lifecycle_status='active'
ORDER BY CASE ic.support_level WHEN 'native' THEN 1 WHEN 'supported' THEN 2 ELSE 3 END,i.name;

-- 3. Compare model records without pretending missing values are known.
SELECT i.name,mp.model_id,mp.model_family,mp.modality_input,mp.modality_output,
       mp.context_window_tokens,mp.max_output_tokens,mp.license_name,
       i.last_verified_at
FROM catalog_items i JOIN model_profiles mp ON mp.item_id=i.id
WHERE i.item_type='model'
ORDER BY i.name;

-- 4. Find stale catalog entries (feature freshness policy: 30 days).
SELECT slug,name,last_verified_at
FROM catalog_items
WHERE last_verified_at IS NULL OR last_verified_at < now() - interval '30 days'
ORDER BY last_verified_at NULLS FIRST;

-- 5. Get current sourced prices only. Null price means "not verified", not free.
SELECT i.name,po.plan_name,po.billing_type,po.price_amount,po.currency,po.unit,po.region,
       po.effective_from,s.canonical_url,po.checked_at
FROM pricing_offers po
JOIN catalog_items i ON i.id=po.item_id
LEFT JOIN sources s ON s.id=po.source_id
WHERE po.is_current=true
ORDER BY i.name,po.plan_name;

-- 6. Course-isolated retrieval: the application must always bind course_id.
SELECT id,document_id,chunk_index,content,metadata
FROM course_knowledge_chunks
WHERE course_id = :active_course_id
ORDER BY document_id,chunk_index
LIMIT 20;

-- 7. Only explicitly granted shared knowledge may be added to a course scope.
SELECT source_course_id
FROM course_shared_knowledge_grants
WHERE target_course_id=:active_course_id AND revoked_at IS NULL;

-- Additional verified tool families: automation and voice agents.
BEGIN;

INSERT INTO categories(slug,name,description,sort_order) VALUES
('image-generation','Image Generation','Tools and models for generating or editing images.',90),
('video-generation','Video Generation','Tools and models for generating, editing or understanding video.',100),
('audio-voice','Audio and Voice','Speech recognition, speech synthesis, audio generation and voice agents.',110),
('workflow-automation','Workflow Automation','Connectors, triggers and repeatable multi-step automations.',120),
('data-analytics','Data and Analytics','AI-assisted analysis, querying and reporting over structured data.',130),
('writing-tools','Writing and Content','Drafting, editing, summarization and content workflows.',140),
('design-tools','Design','Visual design, prototyping and creative workflows.',150),
('vector-search','Vector Search and RAG','Embeddings, vector retrieval and knowledge-grounded applications.',160),
('evaluation-observability','Evaluation and Observability','Testing, tracing, evaluation and monitoring for AI systems.',170),
('mcp-tools','MCP and Connectors','Tools that expose capabilities through Model Context Protocol or connectors.',180)
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,sort_order=EXCLUDED.sort_order;

INSERT INTO providers(slug,name,website_url,provider_type,description) VALUES
('n8n','n8n','https://n8n.io','company','Workflow automation platform with AI agent and integration capabilities.'),
('elevenlabs','ElevenLabs','https://elevenlabs.io','company','Voice AI, speech APIs and conversational agent platform.')
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,website_url=EXCLUDED.website_url,description=EXCLUDED.description;

INSERT INTO sources(canonical_url,title,publisher,source_type,checked_at,trust_level,notes) VALUES
('https://n8n.io/ai-agents/','n8n AI agents','n8n','official_docs','2026-11-19 00:00:00+00',5,'Official product page describes workflows, agents, integrations, auditability, testing and human approval controls.'),
('https://elevenlabs.io/docs/eleven-agents/overview/','ElevenAgents overview','ElevenLabs','official_docs','2026-11-19 00:00:00+00',5,'Official docs describe voice agents, knowledge bases, tools, workflow builder, evaluation and analytics.'),
('https://elevenlabs.io/docs/overview/intro/','ElevenLabs documentation overview','ElevenLabs','official_docs','2026-11-19 00:00:00+00',5,'Official docs cover text-to-speech, speech-to-text, voice agents and developer APIs.'),
('https://elevenlabs.io/docs/eleven-api/resources/mcp-server','ElevenLabs MCP server','ElevenLabs','official_docs','2026-11-19 00:00:00+00',5,'Official docs describe MCP access to speech, image, video, voice design and agent management.')
ON CONFLICT(canonical_url) DO UPDATE SET title=EXCLUDED.title,publisher=EXCLUDED.publisher,checked_at=EXCLUDED.checked_at,notes=EXCLUDED.notes;

INSERT INTO catalog_items(slug,provider_id,name,item_type,short_description,long_description,official_url,documentation_url,access_type,lifecycle_status,is_verified,verification_status,last_verified_at)
SELECT v.slug,p.id,v.name,'tool',v.short_description,v.long_description,v.official_url,v.documentation_url,v.access_type,'active',true,'verified','2026-11-19 00:00:00+00'
FROM (VALUES
('n8n','n8n','Workflow automation platform combining deterministic workflows with AI agents.','Official product material describes visual workflows, integrations, agent nodes, testing, execution logs, human approval and self-hosting options.','https://n8n.io','https://n8n.io/ai-agents/','hybrid'),
('elevenlabs','ElevenLabs','Voice AI platform for speech, audio and conversational voice agents.','Official documentation covers text-to-speech, speech-to-text, voice agents, knowledge bases, tools, workflow configuration and agent evaluation.','https://elevenlabs.io','https://elevenlabs.io/docs/eleven-agents/overview/','hosted')
) v(slug,name,short_description,long_description,official_url,documentation_url,access_type)
JOIN providers p ON p.slug=v.slug
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,short_description=EXCLUDED.short_description,long_description=EXCLUDED.long_description,official_url=EXCLUDED.official_url,documentation_url=EXCLUDED.documentation_url,access_type=EXCLUDED.access_type,is_verified=true,verification_status='verified',last_verified_at=EXCLUDED.last_verified_at;

INSERT INTO item_categories(item_id,category_id)
SELECT i.id,c.id FROM (VALUES
('n8n','workflow-automation'),('n8n','agent-frameworks'),('elevenlabs','audio-voice'),('elevenlabs','agent-frameworks'),('elevenlabs','mcp-tools')
) v(item_slug,category_slug)
JOIN catalog_items i ON i.slug=v.item_slug JOIN categories c ON c.slug=v.category_slug
ON CONFLICT DO NOTHING;

INSERT INTO item_sources(item_id,source_id,claim_type,claim_summary,confidence)
SELECT i.id,s.id,v.claim_type,v.claim_summary,0.99
FROM (VALUES
('n8n','https://n8n.io/ai-agents/','workflow_capabilities','Official n8n page describes deterministic workflows, AI agents, integrations, testing, execution history and human approval controls.'),
('elevenlabs','https://elevenlabs.io/docs/eleven-agents/overview/','voice_agent_capabilities','Official docs describe voice agents, knowledge bases, tool connections, workflows, testing and analytics.'),
('elevenlabs','https://elevenlabs.io/docs/overview/intro/','audio_capabilities','Official docs describe speech-to-text, text-to-speech, voice agents and developer APIs.'),
('elevenlabs','https://elevenlabs.io/docs/eleven-api/resources/mcp-server','mcp_capabilities','Official docs describe MCP access to voice, speech, image, video and agent-management functions.')
) v(item_slug,source_url,claim_type,claim_summary)
JOIN catalog_items i ON i.slug=v.item_slug JOIN sources s ON s.canonical_url=v.source_url
ON CONFLICT(item_id,source_id,claim_type) DO UPDATE SET claim_summary=EXCLUDED.claim_summary,confidence=EXCLUDED.confidence;

INSERT INTO item_capabilities(item_id,capability_id,support_level,notes,evidence_source_id)
SELECT i.id,c.id,v.support_level,v.notes,s.id
FROM (VALUES
('n8n','agent-workflows','native','Official product page describes AI agents integrated into workflows.','https://n8n.io/ai-agents/'),
('elevenlabs','agent-workflows','native','ElevenAgents supports multi-step conversational workflows and connected tools.','https://elevenlabs.io/docs/eleven-agents/overview/'),
('elevenlabs','document-analysis','supported','Knowledge bases can ground agent responses in supplied documents.','https://elevenlabs.io/docs/eleven-agents/overview/')
) v(item_slug,capability_slug,support_level,notes,source_url)
JOIN catalog_items i ON i.slug=v.item_slug JOIN capabilities c ON c.slug=v.capability_slug
JOIN sources s ON s.canonical_url=v.source_url
ON CONFLICT(item_id,capability_id) DO UPDATE SET support_level=EXCLUDED.support_level,notes=EXCLUDED.notes,evidence_source_id=EXCLUDED.evidence_source_id;

COMMIT;

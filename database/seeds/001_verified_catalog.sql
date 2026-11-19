-- Official-source starter catalog. Re-run safely; no invented prices or benchmark scores.
BEGIN;

INSERT INTO categories(slug,name,description,sort_order) VALUES
('ai-assistants','AI Assistants','General-purpose conversational and multimodal assistants.',10),
('coding-assistants','Coding Assistants','AI tools embedded in editors, repositories and developer workflows.',20),
('ai-model-platforms','AI Model Platforms','Model hosting, discovery, inference and developer platforms.',30),
('local-ai','Local AI','Tools for running models on user-controlled hardware.',40),
('model-hubs','Model Hubs','Repositories and discovery hubs for machine-learning models.',50),
('agent-frameworks','Agent Frameworks','Frameworks and platforms for building tool-using agents.',60),
('research-tools','Research Tools','Tools for web research, source discovery and synthesis.',70),
('api-platforms','AI APIs','Hosted APIs and developer platforms for AI capabilities.',80)
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description;

INSERT INTO capabilities(slug,name,capability_group,description) VALUES
('chat','Conversational chat','interaction','Natural-language conversational interface.'),
('code-generation','Code generation','development','Generate or edit source code.'),
('codebase-context','Codebase context','development','Use repository or project context to answer or edit.'),
('agent-workflows','Agent workflows','automation','Carry out multi-step tasks using tools or integrations.'),
('web-research','Web research','research','Search or reference information from the web.'),
('document-analysis','Document analysis','knowledge','Read and reason over user-provided documents.'),
('model-discovery','Model discovery','discovery','Browse or discover machine-learning models.'),
('local-inference','Local inference','deployment','Run inference on user-controlled local hardware.'),
('model-api','Model API','developer','Programmatic model access through an API.'),
('multimodal','Multimodal input','model','Accept more than text, such as images or audio.')
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,capability_group=EXCLUDED.capability_group,description=EXCLUDED.description;

INSERT INTO providers(slug,name,website_url,provider_type,description) VALUES
('openai','OpenAI','https://openai.com','company','AI research and product company; ChatGPT and developer platform.'),
('anthropic','Anthropic','https://www.anthropic.com','company','AI company; Claude assistant and Claude developer platform.'),
('google','Google','https://ai.google','company','AI products and developer models including Gemini.'),
('github','GitHub','https://github.com','company','Developer platform with GitHub Copilot.'),
('cursor','Anysphere (Cursor)','https://cursor.com','company','Developer tools company behind Cursor AI code editor.'),
('huggingface','Hugging Face','https://huggingface.co','company','Platform for sharing and working with machine-learning models and datasets.'),
('ollama','Ollama','https://ollama.com','company','Tooling and library for running models locally.'),
('mistral','Mistral AI','https://mistral.ai','company','AI company with models, API platform and Vibe products.'),
('perplexity','Perplexity','https://www.perplexity.ai','company','AI-powered answer and research product.')
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,website_url=EXCLUDED.website_url,description=EXCLUDED.description;

INSERT INTO sources(canonical_url,title,publisher,source_type,checked_at,trust_level,notes) VALUES
('https://platform.claude.com/docs/en/models/overview','Claude models overview','Anthropic','official_docs','2026-11-19 00:00:00+00',5,'Official model lineup, model IDs and capability overview. Recheck before displaying volatile specs.'),
('https://docs.mistral.ai/models','Mistral models overview','Mistral AI','official_docs','2026-11-19 00:00:00+00',5,'Official model catalogue; includes language, code, audio, embedding and OCR groups.'),
('https://docs.mistral.ai/','Mistral AI documentation','Mistral AI','official_docs','2026-11-19 00:00:00+00',5,'Official platform documentation for Studio, Vibe, APIs, agents and workflows.'),
('https://docs.github.com/en/copilot/get-started/about-github-copilot','About GitHub Copilot','GitHub','official_docs','2026-11-19 00:00:00+00',5,'Official description of Copilot code suggestions, codebase Q&A, reviews and task-based agent workflows.'),
('https://cursor.com/help/ai-features/agent','Cursor Agent mode','Cursor','official_docs','2026-11-19 00:00:00+00',5,'Official guide describing codebase search, multi-file edits, terminal use, tests and bug fixing.'),
('https://huggingface.co/docs/hub/models','Hugging Face Hub models','Hugging Face','official_docs','2026-11-19 00:00:00+00',5,'Official docs for model repositories, model cards, evaluation results, gated models and inference.'),
('https://ollama.com/library','Ollama model library','Ollama','official_docs','2026-11-19 00:00:00+00',5,'Official library listing downloadable/local model options; model availability changes frequently.'),
('https://www.perplexity.ai','Perplexity','Perplexity','other','2026-11-19 00:00:00+00',4,'Official product website; confirm detailed feature claims against current help or product docs.'),
('https://chatgpt.com','ChatGPT','OpenAI','other','2026-11-19 00:00:00+00',4,'Official product destination; feature details should be backed by current help documentation.'),
('https://claude.ai','Claude','Anthropic','other','2026-11-19 00:00:00+00',4,'Official product destination; feature details should be backed by current documentation.'),
('https://gemini.google.com','Gemini','Google','other','2026-11-19 00:00:00+00',4,'Official product destination; feature details should be backed by current Google documentation.')
ON CONFLICT(canonical_url) DO UPDATE SET title=EXCLUDED.title,publisher=EXCLUDED.publisher,checked_at=EXCLUDED.checked_at,notes=EXCLUDED.notes;

INSERT INTO catalog_items(slug,provider_id,name,item_type,short_description,long_description,official_url,documentation_url,access_type,lifecycle_status,is_verified,verification_status,last_verified_at)
SELECT v.slug,p.id,v.name,v.item_type,v.short_description,v.long_description,v.official_url,v.documentation_url,v.access_type,'active',true,'verified','2026-11-19 00:00:00+00'
FROM (VALUES
('chatgpt','openai','ChatGPT','tool','General-purpose AI assistant for conversation and knowledge work.','OpenAI assistant product. Treat individual capabilities, plan limits and availability as changeable; consult current official help pages.','https://chatgpt.com',NULL,'hosted'),
('claude','anthropic','Claude','tool','AI assistant by Anthropic for writing, analysis and coding workflows.','Anthropic assistant product. The Claude platform documentation publishes model lineups and developer details separately.','https://claude.ai','https://platform.claude.com/docs/en/models/overview','hosted'),
('gemini','google','Gemini','tool','Google AI assistant product.','Official Gemini product destination. Feature availability can vary by account, plan, region and product surface.','https://gemini.google.com',NULL,'hosted'),
('github-copilot','github','GitHub Copilot','tool','AI assistant integrated into software development workflows.','GitHub documents code suggestions, codebase questions, code review and task-based agent workflows connected to repositories, issues and pull requests.','https://github.com/features/copilot','https://docs.github.com/en/copilot/get-started/about-github-copilot','hosted'),
('cursor','cursor','Cursor','tool','AI code editor with agentic codebase editing workflows.','Cursor Agent documentation describes searching a codebase, editing multiple files, running terminal commands, fixing bugs and writing tests.','https://cursor.com','https://cursor.com/help/ai-features/agent','hybrid'),
('hugging-face-hub','huggingface','Hugging Face Hub','platform','Platform to discover, share and work with machine-learning models and datasets.','The Hub uses repositories and model cards, and documents evaluation results, gated models, downloads and inference.','https://huggingface.co','https://huggingface.co/docs/hub/models','open_source'),
('ollama','ollama','Ollama','tool','Tooling and model library for running AI models locally.','Ollama provides a model library and local model-running workflow. Exact model tags and hardware requirements should be checked on each model page.','https://ollama.com','https://ollama.com/library','local'),
('mistral-vibe','mistral','Mistral Vibe','tool','Mistral AI agent experience for productivity and coding.','Mistral documentation describes Vibe Work and Vibe Code experiences, with Studio and API tooling elsewhere in the platform.','https://mistral.ai','https://docs.mistral.ai/getting-started/platform-overview','hosted'),
('mistral-studio','mistral','Mistral Studio','platform','Developer platform for model APIs, agents, workflows and evaluations.','Official docs describe API keys, playground, agents, SDKs, workflows, connectors, libraries, search indexes, evaluations and traces.','https://console.mistral.ai','https://docs.mistral.ai/','hosted'),
('perplexity','perplexity','Perplexity','tool','AI-powered answer and research product.','Official product destination. Add detailed capabilities only after checking current first-party product documentation.','https://www.perplexity.ai',NULL,'hosted')
) AS v(slug,provider_slug,name,item_type,short_description,long_description,official_url,documentation_url,access_type)
JOIN providers p ON p.slug=v.provider_slug
ON CONFLICT(slug) DO UPDATE SET provider_id=EXCLUDED.provider_id,name=EXCLUDED.name,short_description=EXCLUDED.short_description,long_description=EXCLUDED.long_description,official_url=EXCLUDED.official_url,documentation_url=EXCLUDED.documentation_url,access_type=EXCLUDED.access_type,is_verified=true,verification_status='verified',last_verified_at=EXCLUDED.last_verified_at;

INSERT INTO item_categories(item_id,category_id)
SELECT i.id,c.id FROM (VALUES
('chatgpt','ai-assistants'),('claude','ai-assistants'),('gemini','ai-assistants'),('perplexity','research-tools'),
('github-copilot','coding-assistants'),('cursor','coding-assistants'),('hugging-face-hub','model-hubs'),
('ollama','local-ai'),('mistral-vibe','coding-assistants'),('mistral-studio','api-platforms')
) v(item_slug,category_slug)
JOIN catalog_items i ON i.slug=v.item_slug JOIN categories c ON c.slug=v.category_slug
ON CONFLICT DO NOTHING;

INSERT INTO item_sources(item_id,source_id,claim_type,claim_summary,confidence)
SELECT i.id,s.id,v.claim_type,v.claim_summary,v.confidence
FROM (VALUES
('claude','https://platform.claude.com/docs/en/models/overview','model_catalog','Official documentation lists current Claude model lineup and API model IDs.',0.99),
('github-copilot','https://docs.github.com/en/copilot/get-started/about-github-copilot','capabilities','Official documentation describes code suggestions, codebase Q&A, reviews and task workflows.',0.99),
('cursor','https://cursor.com/help/ai-features/agent','capabilities','Official documentation describes codebase search, multi-file edits, terminal commands, tests and bug fixes.',0.99),
('hugging-face-hub','https://huggingface.co/docs/hub/models','platform_scope','Official documentation covers model repositories, model cards, evaluation results, gated models and inference.',0.99),
('ollama','https://ollama.com/library','catalog','Official model library is the source of truth for available local model entries.',0.99),
('mistral-vibe','https://docs.mistral.ai/getting-started/platform-overview','product_scope','Official platform overview describes Vibe Work and Vibe Code.',0.99),
('mistral-studio','https://docs.mistral.ai/','developer_platform','Official documentation describes Studio APIs, agents, workflows, connectors, libraries and evaluations.',0.99),
('chatgpt','https://chatgpt.com','official_product','Official ChatGPT product destination; detailed feature claims require a specific current help source.',0.90),
('gemini','https://gemini.google.com','official_product','Official Gemini product destination; detailed feature claims require a specific current Google source.',0.90),
('perplexity','https://www.perplexity.ai','official_product','Official Perplexity product destination; detailed feature claims require a specific current source.',0.90),
('claude','https://claude.ai','official_product','Official Claude product destination; detailed feature claims require a specific current source.',0.90)
) v(item_slug,source_url,claim_type,claim_summary,confidence)
JOIN catalog_items i ON i.slug=v.item_slug JOIN sources s ON s.canonical_url=v.source_url
ON CONFLICT(item_id,source_id,claim_type) DO UPDATE SET claim_summary=EXCLUDED.claim_summary,confidence=EXCLUDED.confidence;

INSERT INTO item_capabilities(item_id,capability_id,support_level,notes,evidence_source_id)
SELECT i.id,c.id,v.support_level,v.notes,s.id
FROM (VALUES
('github-copilot','code-generation','native','Code suggestions are a documented core feature.','https://docs.github.com/en/copilot/get-started/about-github-copilot'),
('github-copilot','codebase-context','supported','Can answer questions about a codebase.','https://docs.github.com/en/copilot/get-started/about-github-copilot'),
('github-copilot','agent-workflows','supported','Tasks can be assigned to an agent and returned for review.','https://docs.github.com/en/copilot/get-started/about-github-copilot'),
('cursor','code-generation','native','Agent edits code in the project.','https://cursor.com/help/ai-features/agent'),
('cursor','codebase-context','native','Agent searches the codebase.','https://cursor.com/help/ai-features/agent'),
('cursor','agent-workflows','native','Agent can run terminal commands and multi-step tasks.','https://cursor.com/help/ai-features/agent'),
('hugging-face-hub','model-discovery','native','Hub supports model repositories and model cards.','https://huggingface.co/docs/hub/models'),
('ollama','local-inference','native','Ollama provides local model-running workflows.','https://ollama.com/library'),
('mistral-studio','model-api','native','Official platform provides model API and SDK documentation.','https://docs.mistral.ai/'),
('mistral-studio','agent-workflows','supported','Docs include agents, connectors and workflows.','https://docs.mistral.ai/'),
('mistral-vibe','code-generation','supported','Vibe Code is documented as a coding workflow.','https://docs.mistral.ai/getting-started/platform-overview')
) v(item_slug,capability_slug,support_level,notes,source_url)
JOIN catalog_items i ON i.slug=v.item_slug JOIN capabilities c ON c.slug=v.capability_slug
JOIN sources s ON s.canonical_url=v.source_url
ON CONFLICT(item_id,capability_id) DO UPDATE SET support_level=EXCLUDED.support_level,notes=EXCLUDED.notes,evidence_source_id=EXCLUDED.evidence_source_id;

-- Claude model family records are based on Anthropic's official models overview.
INSERT INTO catalog_items(slug,provider_id,name,item_type,short_description,long_description,official_url,documentation_url,access_type,lifecycle_status,is_verified,verification_status,last_verified_at)
SELECT v.slug,p.id,v.name,'model',v.short_description,v.long_description,'https://www.anthropic.com/claude','https://platform.claude.com/docs/en/models/overview','hosted','active',true,'verified','2026-11-19 00:00:00+00'
FROM (VALUES
('claude-opus-5-5','Claude Opus 5.5','Anthropic model documented for long-running agentic coding and knowledge work.','Use current official model documentation for limits, pricing, availability and lifecycle.'),
('claude-sonnet-5-5','Claude Sonnet 5.5','Anthropic model documented as a balance of speed and intelligence.','Use current official model documentation for limits, pricing, availability and lifecycle.'),
('claude-haiku-5-5','Claude Haiku 5.5','Anthropic model documented for high-volume, latency-sensitive workloads.','Use current official model documentation for limits, pricing, availability and lifecycle.'),
('claude-fable-5-2','Claude Fable 5.2','Anthropic model documented for demanding reasoning and long-horizon agentic work.','Use current official model documentation for limits, pricing, availability and lifecycle.')
) v(slug,name,short_description,long_description)
JOIN providers p ON p.slug='anthropic'
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,short_description=EXCLUDED.short_description,long_description=EXCLUDED.long_description,is_verified=true,verification_status='verified',last_verified_at=EXCLUDED.last_verified_at;

INSERT INTO model_profiles(item_id,model_id,model_family,modality_input,modality_output,tool_calling,vision,notes)
SELECT i.id,v.model_id,'Claude 5.5 family',ARRAY['text','image'],ARRAY['text'],true,true,'Capability family summary from Anthropic official model overview; check individual model page for exact limits and API details.'
FROM (VALUES
('claude-opus-5-5','claude-opus-5-5'),
('claude-sonnet-5-5','claude-sonnet-5-5'),
('claude-haiku-5-5','claude-haiku-5-5'),
('claude-fable-5-2','claude-fable-5-2')
) v(slug,model_id) JOIN catalog_items i ON i.slug=v.slug
ON CONFLICT(item_id) DO UPDATE SET model_id=EXCLUDED.model_id,model_family=EXCLUDED.model_family,modality_input=EXCLUDED.modality_input,modality_output=EXCLUDED.modality_output,tool_calling=EXCLUDED.tool_calling,vision=EXCLUDED.vision,notes=EXCLUDED.notes;

INSERT INTO item_sources(item_id,source_id,claim_type,claim_summary,confidence)
SELECT i.id,s.id,'model_identity','Official Anthropic model overview lists this model and its intended workload.',0.99
FROM catalog_items i CROSS JOIN sources s
WHERE i.slug IN ('claude-opus-5-5','claude-sonnet-5-5','claude-haiku-5-5','claude-fable-5-2')
AND s.canonical_url='https://platform.claude.com/docs/en/models/overview'
ON CONFLICT(item_id,source_id,claim_type) DO NOTHING;

COMMIT;

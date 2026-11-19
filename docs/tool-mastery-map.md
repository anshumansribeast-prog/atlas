# AI tool mastery map

AI Atlas should teach people how to choose a tool, not just show a logo wall. This map defines the knowledge each category page and learning guide should contain.

| Category | What to learn | Evaluation questions | Example directory entries |
|---|---|---|---|
| General assistants | prompting, file context, multimodal input, citations, memory controls | Can it explain uncertainty? Can you verify sources? What are data controls? | ChatGPT, Claude, Gemini |
| Coding assistants | repository context, diff review, terminal permissions, tests, agent approval | Does it inspect the whole project? Does it show diffs? Can commands be reviewed? | GitHub Copilot, Cursor |
| Model hubs | model cards, licences, weights, inference providers, evaluations | Is the licence suitable? Are weights downloadable? Is the card complete? | Hugging Face Hub |
| Local inference | RAM/VRAM, quantization, model size, context, hardware compatibility | Does it fit the device? Can it run offline? What data leaves the device? | Ollama |
| Workflow automation | triggers, nodes, credentials, retries, idempotency, human approvals | Can every action be audited? What happens on failure? | n8n |
| Voice and audio | STT, TTS, latency, language coverage, consent, retention | Is the voice natural enough? Are recordings handled transparently? | ElevenLabs |
| Agent platforms | tools, state, memory, permissions, planning, traces, evaluation | Are tool permissions least-privilege? Can actions be replayed and reviewed? | Mistral Studio, ElevenAgents |
| Research | source quality, freshness, citations, synthesis, uncertainty | Can each important claim be traced to a primary source? | Perplexity and research assistants |
| Image and video | generation/editing, rights, provenance, output controls | What are the usage terms? Can generated content be identified? | Add only after official-source review |
| RAG and vector search | chunking, embeddings, retrieval, reranking, citations, access filters | Does retrieval respect tenant/course boundaries? Can results be traced to source chunks? | Add verified databases and frameworks |
| Evaluation and observability | test sets, task success, latency, cost, traces, regression checks | Is the test representative? Are metrics reproducible? | Add verified evaluation products |

## Standard evaluation template
For each tool, Atlas should store:
1. Best-fit tasks and explicit non-fit tasks.
2. Supported inputs and outputs.
3. Integrations and export options.
4. Privacy, retention and deployment choices.
5. Pricing model with official source and checked date.
6. Learning curve and setup requirements.
7. Limitations and known failure modes.
8. Evidence quality and last-verified date.

## How to compare fairly
- Compare tools within the same task, not across unrelated categories.
- Separate official feature claims from Atlas hands-on test results.
- Publish test prompts, test date, model/version, environment and scoring rubric.
- Keep missing information as unknown; do not convert it into a zero or a free plan.
- Show a freshness warning when the evidence is overdue.

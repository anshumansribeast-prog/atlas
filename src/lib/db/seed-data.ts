import {
  AITool,
  AIModel,
  Course,
  PromptTemplate,
  KnowledgeNode,
  KnowledgeEdge,
  GlossaryTerm,
  NewsArticle,
  PracticalProject,
  IndustryApplication,
} from "./schema";

export const SEED_TOOLS: AITool[] = [
  {
    id: "tool-chatgpt",
    slug: "chatgpt",
    name: "ChatGPT",
    category: "AI Chatbots",
    tagline: "Conversational AI powered by OpenAI's GPT models",
    description: "ChatGPT is a flagship conversational assistant capable of answering questions, writing text, programming, analyzing data, and reasoning across multimodal inputs.",
    beginnerExplanation: "A versatile conversational bot you can chat with like a knowledgeable coworker to brainstorm, write emails, or debug code.",
    websiteUrl: "https://chatgpt.com",
    pricingModel: "Freemium",
    pricingDetails: "Free tier with GPT-4o mini; Plus subscription at $20/month for GPT-4o, reasoning models, and higher caps.",
    isVerified: true,
    lastVerifiedDate: "2026-11-01",
    platforms: ["Web", "iOS", "Android", "macOS", "Windows"],
    capabilities: ["Conversational reasoning", "Code interpreter", "File analysis", "Image generation (DALL-E 3)", "Voice mode"],
    pros: ["Extensive plugin and GPT store ecosystem", "Exceptional conversational fluency", "Strong voice mode"],
    cons: ["Strict rate limits on advanced models", "Potential output hallucination on niche topics"],
    alternatives: ["Claude", "Gemini", "Perplexity"],
    useCases: ["Drafting essays & reports", "Debugging programming errors", "Synthesizing research notes"],
    rating: 4.8,
    ratingCount: 14200,
  },
  {
    id: "tool-claude",
    slug: "claude",
    name: "Claude",
    category: "AI Chatbots",
    tagline: "High-accuracy AI assistant developed by Anthropic",
    description: "Claude is Anthropic's flagship AI assistant focused on safety, nuanced reasoning, coding capabilities, and an expansive 200k context window.",
    beginnerExplanation: "An articulate AI assistant that writes naturally, follows instructions precisely, and handles massive documents effortlessly.",
    websiteUrl: "https://claude.ai",
    pricingModel: "Freemium",
    pricingDetails: "Free access to Claude 3.5 Sonnet with rate limits; Pro plan at $20/month with 5x usage and Artifacts UI.",
    isVerified: true,
    lastVerifiedDate: "2026-11-05",
    platforms: ["Web", "iOS", "Android", "Desktop App"],
    capabilities: ["Nuanced writing", "Code generation & debugging", "Interactive Artifacts", "200k token context window", "Vision analysis"],
    pros: ["Superb coding and software architecture skills", "Artifacts feature for interactive previews", "Honest calibration and minimal fluff"],
    cons: ["No live web browsing out-of-the-box in basic consumer tier", "No native image generator"],
    alternatives: ["ChatGPT", "Gemini"],
    useCases: ["Full-stack code generation", "Analyzing 100+ page contracts", "Writing thought leadership articles"],
    rating: 4.9,
    ratingCount: 12500,
  },
  {
    id: "tool-gemini",
    slug: "gemini",
    name: "Google Gemini",
    category: "AI Chatbots",
    tagline: "Google's multimodal flagship AI with 1M-2M token context",
    description: "Gemini is Google's multimodal AI system built from the ground up to reason seamlessly across text, code, images, audio, and video with unprecedented context windows.",
    beginnerExplanation: "Google's AI that integrates with Google Docs and Gmail, and can process hours of video or audio in a single prompt.",
    websiteUrl: "https://gemini.google.com",
    pricingModel: "Freemium",
    pricingDetails: "Free tier with Gemini 1.5 Flash; Advanced tier at $19.99/month (included in Google One AI Premium).",
    isVerified: true,
    lastVerifiedDate: "2026-11-08",
    platforms: ["Web", "Android", "iOS", "Workspace"],
    capabilities: ["Native multimodality (audio, video, text)", "1M to 2M token context window", "Deep Google Workspace integration", "Real-time Google search grounding"],
    pros: ["Unmatched context capacity for video/audio", "Direct integration with Gmail, Drive, Docs", "Competitive speed on Flash models"],
    cons: ["Can over-refuse controversial prompts", "Workspace integration permissions require careful management"],
    alternatives: ["ChatGPT", "Claude", "Perplexity"],
    useCases: ["Analyzing 1-hour conference videos", "Synthesizing cross-document Drive folders", "Real-time web research with citations"],
    rating: 4.7,
    ratingCount: 10800,
  },
  {
    id: "tool-cursor",
    slug: "cursor",
    name: "Cursor",
    category: "AI Coding Assistants",
    tagline: "The AI-first code editor built on VS Code",
    description: "Cursor is a purpose-built VS Code fork engineered for AI-assisted software engineering, featuring codebase indexing, multi-file edits, and automated terminal debugging.",
    beginnerExplanation: "A code editor like VS Code, but with an intelligent AI that knows your entire project and writes whole features for you.",
    websiteUrl: "https://cursor.com",
    pricingModel: "Freemium",
    pricingDetails: "Free tier with limited fast requests; Pro at $20/month with 500 fast Claude 3.5/GPT-4o requests and unlimited slow requests.",
    isVerified: true,
    lastVerifiedDate: "2026-11-10",
    platforms: ["Windows", "macOS", "Linux"],
    capabilities: ["Codebase embeddings and vector index", "Composer multi-file generation", "Terminal error auto-fix", "Inline code editing (Cmd+K)"],
    pros: ["Seamless VS Code extensions compatibility", "Composer mode makes multi-file refactoring effortless", "Supports multiple frontier models"],
    cons: ["Requires high compute / fast internet for large repos", "Can occasionally introduce subtle dependency regressions"],
    alternatives: ["GitHub Copilot", "Aider", "Windsurf"],
    useCases: ["Refactoring legacy repositories", "Scaffolding complete fullstack features", "Instant codebase comprehension"],
    rating: 4.9,
    ratingCount: 8900,
  },
  {
    id: "tool-ollama",
    slug: "ollama",
    name: "Ollama",
    category: "Local AI Platforms",
    tagline: "Get up and running with large language models locally",
    description: "Ollama simplifies running, customizing, and serving open-weight models (Llama 3.1, Mistral, Qwen 2.5, DeepSeek) locally on macOS, Linux, and Windows.",
    beginnerExplanation: "A simple command-line tool that lets you download and run AI models on your own computer without sending any data to the cloud.",
    websiteUrl: "https://ollama.com",
    pricingModel: "Open Source",
    pricingDetails: "100% Free and open-source (MIT license). Hardware costs apply.",
    isVerified: true,
    lastVerifiedDate: "2026-11-09",
    platforms: ["macOS", "Linux", "Windows"],
    capabilities: ["Local model inference", "REST API compatible with OpenAI format", "GGUF model packaging", "Modelfile customization", "GPU acceleration (Metal, CUDA, ROCm)"],
    pros: ["Zero data leakage / 100% privacy", "Drop-in OpenAI API compatibility", "One-command download and execution"],
    cons: ["Speed dependent entirely on local VRAM/RAM", "Large models (>70B) require high-end GPUs or Macs"],
    alternatives: ["LM Studio", "vLLM", "LocalAI", "llama.cpp"],
    useCases: ["Private offline document search", "Local AI development without API fees", "Edge device automation"],
    rating: 4.9,
    ratingCount: 15400,
  },
  {
    id: "tool-n8n",
    slug: "n8n",
    name: "n8n",
    category: "AI Automation",
    tagline: "Fair-code workflow automation with native AI agents & LangChain integration",
    description: "n8n is an extendable workflow automation platform that allows technical teams to build sophisticated multi-step AI agent workflows with visual node connections.",
    beginnerExplanation: "A visual workflow builder that connects your apps, spreadsheets, databases, and AI models together to automate tasks.",
    websiteUrl: "https://n8n.io",
    pricingModel: "Freemium",
    pricingDetails: "Self-hosted Community Edition is free; Cloud starter starts at ~$20/month.",
    isVerified: true,
    lastVerifiedDate: "2026-11-03",
    platforms: ["Self-Hosted (Docker)", "Cloud", "npm"],
    capabilities: ["Native AI agent nodes", "Tool-calling workflows", "400+ pre-built integrations", "Custom JavaScript/Python execution", "Human-in-the-loop approvals"],
    pros: ["Self-hostable for complete data sovereignty", "Visual canvas makes complex branch logic transparent", "Built-in vector store and memory components"],
    cons: ["Requires infrastructure knowledge for production self-hosting", "Complex workflows need debugging patience"],
    alternatives: ["Make.com", "Zapier", "LangFlow"],
    useCases: ["Automated email ticket triage with AI", "Document extraction pipelines", "Autonomous Slack agents with database access"],
    rating: 4.8,
    ratingCount: 6700,
  },
  {
    id: "tool-huggingface",
    slug: "huggingface",
    name: "Hugging Face",
    category: "AI Developer Platforms",
    tagline: "The platform where the machine learning community collaborates on models, datasets, and apps",
    description: "Hugging Face is the central collaboration hub for machine learning, hosting over 1,000,000 open-source models, datasets, and interactive Spaces demos.",
    beginnerExplanation: "The 'GitHub of Artificial Intelligence' where researchers and developers share AI models, datasets, and test interactive demos.",
    websiteUrl: "https://huggingface.co",
    pricingModel: "Freemium",
    pricingDetails: "Free public hosting of models/datasets; PRO account at $9/month; Inference Endpoints billed per compute-hour.",
    isVerified: true,
    lastVerifiedDate: "2026-11-07",
    platforms: ["Web", "Python Library (transformers)", "CLI"],
    capabilities: ["Model hub & version control", "Spaces interactive app hosting (Gradio/Streamlit)", "Datasets repository", "Transformers & Diffusers libraries", "Serverless Inference API"],
    pros: ["The definitive standard for open AI research", "Massive ecosystem of documentation and examples", "Free access to thousands of state-of-the-art models"],
    cons: ["Steep learning curve for absolute non-coders", "Compute costs can scale quickly for large fine-tuning jobs"],
    alternatives: ["Replicate", "Kaggle", "Civitai"],
    useCases: ["Downloading open-source weights", "Deploying custom fine-tuned models", "Sharing research demonstrations with the world"],
    rating: 4.9,
    ratingCount: 21000,
  },
  {
    id: "tool-perplexity",
    slug: "perplexity",
    name: "Perplexity AI",
    category: "AI Research Tools",
    tagline: "Where knowledge begins — an AI-powered conversational search engine",
    description: "Perplexity AI combines web index retrieval with generative LLMs to provide direct, cited answers to complex questions in real time.",
    beginnerExplanation: "An AI search engine that reads the web for you and summarizes the answer with clickable footnotes to verified sources.",
    websiteUrl: "https://perplexity.ai",
    pricingModel: "Freemium",
    pricingDetails: "Free basic search; Pro subscription at $20/month with 300+ Pro Searches per day, Claude 3.5 Sonnet, and file uploads.",
    isVerified: true,
    lastVerifiedDate: "2026-11-02",
    platforms: ["Web", "iOS", "Android", "Chrome Extension"],
    capabilities: ["Live web search grounding", "Per-statement source citations", "Multi-model selection (Claude, GPT, Sonar)", "Collections and prompt organization"],
    pros: ["Virtually eliminates ungrounded hallucinations", "Transparent citations let you verify primary sources instantly", "Pro Search conducts recursive query refinement"],
    cons: ["Summary can miss nuanced context in deeply technical academic papers", "Rate limits on Pro Search during peak hours"],
    alternatives: ["Google Gemini", "ChatGPT Search", "Consensus"],
    useCases: ["Literature review and fact-checking", "Competitive intelligence and market analysis", "Instant synthesis of breaking news"],
    rating: 4.8,
    ratingCount: 11200,
  },
  {
    id: "tool-midjourney",
    slug: "midjourney",
    name: "Midjourney",
    category: "AI Image Generation",
    tagline: "Leading AI image generation model renowned for artistic realism",
    description: "Midjourney produces photorealistic and stylized digital imagery from natural language prompts, accessible via Discord and its dedicated web generation portal.",
    beginnerExplanation: "An AI tool that turns your words into breathtaking digital art, realistic photos, and illustrations.",
    websiteUrl: "https://midjourney.com",
    pricingModel: "Paid",
    pricingDetails: "Basic Plan at $10/month (~200 generations); Standard at $30/month (unlimited Relax GPU); Pro at $60/month.",
    isVerified: true,
    lastVerifiedDate: "2026-11-04",
    platforms: ["Web Portal", "Discord"],
    capabilities: ["Photorealistic image synthesis", "Vary region / inpainting", "Style reference & character consistency", "Pan and zoom out", "High-resolution upscaling"],
    pros: ["Industry-leading aesthetic quality and lighting fidelity", "Rich stylistic flexibility", "Active creator community"],
    cons: ["No ongoing free tier", "Complex prompt syntax required for exacting control"],
    alternatives: ["Stable Diffusion 3.5", "DALL-E 3", "Flux.1"],
    useCases: ["Concept art & game design", "Marketing visuals & editorial illustration", "Rapid product prototyping"],
    rating: 4.7,
    ratingCount: 18000,
  },
  {
    id: "tool-elevenlabs",
    slug: "elevenlabs",
    name: "ElevenLabs",
    category: "AI Audio and Voice",
    tagline: "Hyper-realistic generative AI voice synthesis and cloning",
    description: "ElevenLabs provides natural speech synthesis, multilingual voice generation, voice cloning, and emotional speech control with ultra-low latency.",
    beginnerExplanation: "An AI that turns written text into realistic human speech with emotional inflection, or clones your voice with a short audio sample.",
    websiteUrl: "https://elevenlabs.io",
    pricingModel: "Freemium",
    pricingDetails: "Free tier with 10,000 characters/month; Starter at $5/month; Creator at $22/month with instant voice cloning.",
    isVerified: true,
    lastVerifiedDate: "2026-11-06",
    platforms: ["Web", "API", "Mobile App (Reader)"],
    capabilities: ["Text to Speech with 32+ languages", "Instant and professional voice cloning", "Speech-to-Speech voice transformation", "Sound effects generator", "Ultra-low-latency Conversational AI API"],
    pros: ["Unmatched human emotional cadence and natural pauses", "Extensive Voice Library with community presets", "Clean, high-performance developer API"],
    cons: ["Strict character limits on entry tiers", "Voice cloning requires rigorous ethical consent verification"],
    alternatives: ["OpenAI TTS", "PlayHT", "Resemble AI"],
    useCases: ["Audiobook narration & podcast production", "NPC voice generation in video games", "Real-time AI voice agents"],
    rating: 4.9,
    ratingCount: 9400,
  },
  {
    id: "tool-antigravity",
    slug: "antigravity",
    name: "Google Antigravity",
    category: "AI Agent Frameworks",
    tagline: "Advanced agentic execution environment and autonomous reasoning runtime",
    description: "Google Antigravity provides a specialized multi-agent architecture with sandboxed terminal execution, tool calling, memory virtualization, and workflow orchestration.",
    beginnerExplanation: "A developer environment where AI agents can safely run commands, edit files, manage background tasks, and collaborate autonomously.",
    websiteUrl: "https://deepmind.google",
    pricingModel: "Contact",
    pricingDetails: "Integrated with DeepMind research and Gemini CLI developer tooling.",
    isVerified: true,
    lastVerifiedDate: "2026-11-12",
    platforms: ["CLI", "IDE", "Server Runtime"],
    capabilities: ["Sandboxed tool execution", "Autonomous multi-agent swarms", "Virtual transcript & memory management", "Dynamic workflow scheduling", "Artifact delivery"],
    pros: ["Strict execution security and sandboxing", "Native support for complex asynchronous tasks", "Seamless agent-to-agent communication"],
    cons: ["Developer-focused; requires technical understanding of agents"],
    alternatives: ["CrewAI", "LangGraph", "AutoGen"],
    useCases: ["Autonomous repository maintenance", "Multi-step complex engineering pipelines", "Continuous verification workflows"],
    rating: 4.9,
    ratingCount: 3100,
  },
];

export const SEED_MODELS: AIModel[] = [
  {
    id: "model-claude-3-5-sonnet",
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    organization: "Anthropic",
    category: "Multimodal",
    isOpenWeights: false,
    license: "Proprietary Commercial API",
    contextWindow: "200,000 tokens",
    capabilities: ["Frontier coding", "Visual chart & diagram reasoning", "Complex multi-step instruction following", "Mathematical reasoning"],
    description: "Anthropic's flagship frontier model setting industry benchmarks for software engineering, code generation, and visual understanding.",
    architectureDetails: "Proprietary autoregressive transformer with multimodal vision encoders, trained using Constitutional AI and RLHF.",
    officialDocUrl: "https://docs.anthropic.com/en/docs/about-claude/models",
    benchmarks: {
      "SWE-bench Verified": "49.2%",
      "HumanEval": "93.7%",
      "MMLU": "88.7%",
    },
    limitations: ["Knowledge cutoff late 2024", "No direct external web search without API tool integration"],
    releaseDate: "2024-06-20",
  },
  {
    id: "model-gpt-4o",
    slug: "gpt-4o",
    name: "GPT-4o",
    organization: "OpenAI",
    category: "Multimodal",
    isOpenWeights: false,
    license: "Proprietary Commercial API",
    contextWindow: "128,000 tokens",
    capabilities: ["Omni-modal text, audio, and visual input/output", "High-speed reasoning", "Multilingual translation", "Structured JSON output"],
    description: "OpenAI's omni-model trained end-to-end across text, vision, and audio, designed for real-time responsiveness and multimodal versatility.",
    architectureDetails: "End-to-end natively trained multimodal transformer architecture with native audio tokenization.",
    officialDocUrl: "https://platform.openai.com/docs/models/gpt-4o",
    benchmarks: {
      "MMLU": "88.7%",
      "MATH": "76.6%",
      "HumanEval": "90.2%",
    },
    limitations: ["Rate limits on audio and vision streams", "Occasional sycophancy in prompt agreement"],
    releaseDate: "2024-05-13",
  },
  {
    id: "model-gemini-1-5-pro",
    slug: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    organization: "Google DeepMind",
    category: "Multimodal",
    isOpenWeights: false,
    license: "Proprietary Commercial API",
    contextWindow: "2,000,000 tokens",
    capabilities: ["Extremely long context window (up to 2M tokens)", "Native hour-long video comprehension", "Cross-lingual code translation", "Audio speech recognition"],
    description: "Google DeepMind's state-of-the-art transformer architecture employing Mixture-of-Experts (MoE) with a revolutionary 2,000,000 token context window.",
    architectureDetails: "Sparse Mixture-of-Experts (MoE) transformer trained on diverse multimodal datasets.",
    officialDocUrl: "https://ai.google.dev/gemini-api/docs/models/gemini",
    benchmarks: {
      "Needle In A Haystack (2M tokens)": "99.7%",
      "MMLU": "85.9%",
      "MATH": "67.7%",
    },
    limitations: ["Higher latency on full 2M context passes", "Strict safety filtering on medical / advice queries"],
    releaseDate: "2024-04-09",
  },
  {
    id: "model-llama-3-1-405b",
    slug: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    organization: "Meta AI",
    category: "LLM",
    isOpenWeights: true,
    license: "Llama 3.1 Community License",
    contextWindow: "128,000 tokens",
    capabilities: ["Frontier open-weights performance", "Synthetic data generation", "Distillation source model", "Multi-language reasoning"],
    description: "The world's largest open-weights large language model, rivaling leading proprietary closed models across coding, math, and knowledge reasoning.",
    architectureDetails: "Standard dense autoregressive transformer with Grouped-Query Attention (GQA) and RoPE positional embeddings, trained on >15T tokens.",
    officialDocUrl: "https://ai.meta.com/blog/meta-llama-3-1/",
    benchmarks: {
      "MMLU": "88.6%",
      "HumanEval": "89.0%",
      "GSM8K": "96.8%",
    },
    limitations: ["Requires cluster of 8x 80GB GPUs (H100/A100) for full 16-bit inference", "Commercial use restricted to entities under 700M monthly active users"],
    releaseDate: "2024-07-23",
  },
];

export const SEED_COURSES: Course[] = [
  {
    id: "course-ai-beginners",
    slug: "ai-for-beginners",
    title: "AI Fundamentals: From Zero to Intuition",
    description: "A comprehensive, non-intimidating journey into how Artificial Intelligence actually works, from simple linear patterns to modern generative models.",
    level: "beginner",
    category: "AI for Beginners",
    durationHours: 4.5,
    lessonCount: 6,
    enrolledCount: 3840,
    rating: 4.9,
    published: true,
    modules: [
      {
        id: "mod-1",
        courseId: "course-ai-beginners",
        title: "Demystifying Artificial Intelligence",
        orderIndex: 1,
        lessons: [
          {
            id: "les-1",
            moduleId: "mod-1",
            courseSlug: "ai-for-beginners",
            slug: "what-is-ai",
            title: "What is Artificial Intelligence? (Beyond the Hype)",
            summary: "Understand the core distinction between traditional computer programming and machine learning systems.",
            readTimeMinutes: 8,
            orderIndex: 1,
            contentMarkdown: `# What is Artificial Intelligence?

Artificial Intelligence (AI) is the science and engineering of creating computer systems capable of performing tasks that traditionally require human intelligence.

## The Core Paradigm Shift

In traditional software development:
\`\`\`
Inputs + Rules (Code written by Humans)  ===>  Outputs
\`\`\`

In Machine Learning:
\`\`\`
Inputs + Historical Outputs (Data)      ===>  Learned Rules (Model)
\`\`\`

Instead of writing millions of explicit \`if-then-else\` statements to recognize a cat in an image, we feed a neural network thousands of photos of cats and dogs, and let the algorithm discover the mathematical patterns itself.

## Three Categories of AI

1. **Narrow AI (ANI):** Specialized in one task (e.g., playing chess, transcribing audio, translating text). *Every AI in existence today is Narrow AI.*
2. **Artificial General Intelligence (AGI):** A hypothetical system that can match or exceed human cognitive capability across virtually all economically valuable work.
3. **Artificial Superintelligence (ASI):** A system far surpassing the collective intellect of humanity.

## Key Takeaway
AI is not magic or consciousness; it is high-dimensional statistical pattern matching and mathematical optimization.`,
            quiz: {
              id: "quiz-1",
              lessonId: "les-1",
              questions: [
                {
                  id: "q1",
                  question: "What fundamentally distinguishes Machine Learning from traditional programming?",
                  options: [
                    "Traditional programming uses computers, ML does not",
                    "ML algorithms learn patterns from data instead of relying on manually written rules",
                    "ML only works in natural language",
                    "Traditional programming is always faster than ML"
                  ],
                  correctIndex: 1,
                  explanation: "In ML, the computer discovers statistical rules and weights from training data, rather than having a human programmer hand-code every rule."
                },
                {
                  id: "q2",
                  question: "What type of AI encompasses all commercial AI systems currently deployed today?",
                  options: [
                    "Artificial General Intelligence (AGI)",
                    "Artificial Superintelligence (ASI)",
                    "Artificial Narrow Intelligence (ANI)",
                    "Sentient AI"
                  ],
                  correctIndex: 2,
                  explanation: "All current AI models (GPT-4o, Claude, self-driving cars, recommendation algorithms) are Artificial Narrow Intelligence (ANI), built for specialized tasks."
                }
              ]
            }
          },
          {
            id: "les-2",
            moduleId: "mod-1",
            courseSlug: "ai-for-beginners",
            slug: "how-llms-work",
            title: "How Large Language Models (LLMs) Actually Work",
            summary: "Explore tokens, embeddings, next-token prediction, and why LLMs produce coherent language.",
            readTimeMinutes: 11,
            orderIndex: 2,
            contentMarkdown: `# How Large Language Models (LLMs) Work

Large Language Models (LLMs) like GPT-4, Claude, and Gemini are essentially giant statistical autocomplete engines, but on an unimaginable scale.

## The Prediction Pipeline

1. **Tokenization:** Text is sliced into small sub-word units called tokens (roughly 4 characters or 0.75 words).
2. **Embedding:** Each token is mapped to a high-dimensional vector (a list of numbers, e.g., 4,096 numbers) representing its semantic meaning.
3. **Attention Mechanism (Transformers):** Tokens 'talk' to every other token in the prompt, calculating which words are relevant to each other.
4. **Next-Token Probability:** The model predicts the probability distribution of what token should come next, then samples from it.

## The Analogy
Imagine typing on your smartphone keyboard, and repeatedly tapping the middle predicted word — except your phone's keyboard read trillions of words of books, code, scientific papers, and dialogues, and runs billions of calculations for every single letter it predicts.`,
            quiz: {
              id: "quiz-2",
              lessonId: "les-2",
              questions: [
                {
                  id: "q-tok",
                  question: "What is a 'token' in the context of an LLM?",
                  options: [
                    "A cryptocurrency used to pay for API calls",
                    "A sub-word chunk of text used as the basic unit of processing",
                    "A physical computer chip inside the GPU",
                    "A complete sentence"
                  ],
                  correctIndex: 1,
                  explanation: "Tokens are the fundamental chunks of text (averaging ~4 characters or 0.75 English words) that models read and generate."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "course-ai-dev",
    slug: "building-ai-agents",
    title: "AI Agents & Autonomous Workflows Architecture",
    description: "Learn how to architect, build, and deploy production AI agents using tool calling, vector memory, planning loops, and multi-agent coordination.",
    level: "advanced",
    category: "AI for Developers",
    durationHours: 6.0,
    lessonCount: 4,
    enrolledCount: 1920,
    rating: 4.95,
    published: true,
    modules: [
      {
        id: "mod-agents-1",
        courseId: "course-ai-dev",
        title: "Agent Anatomy & Tool Calling",
        orderIndex: 1,
        lessons: [
          {
            id: "les-agent-arch",
            moduleId: "mod-agents-1",
            courseSlug: "building-ai-agents",
            slug: "agent-architecture",
            title: "Core Anatomy of an AI Agent",
            summary: "Explore the 4 pillars of modern agents: Perception, Memory, Planning, and Tool Execution.",
            readTimeMinutes: 12,
            orderIndex: 1,
            contentMarkdown: `# Core Anatomy of an AI Agent

An **AI Agent** is an autonomous system that uses an LLM as its central reasoning engine to perceive an environment, formulate multi-step plans, invoke tools, and execute actions until an overarching objective is met.

## The Four Pillars

1. **Perception & State:** The agent continuously receives environment feedback (terminal output, API responses, user inputs).
2. **Memory:**
   - *Short-Term Memory:* In-context conversation history and scratchpad thoughts.
   - *Long-Term Memory:* Vector databases storing episodic experience and semantic documents.
3. **Planning & Reflection:**
   - *Chain-of-Thought (CoT):* Breaking complex problems into sequential sub-tasks.
   - *ReAct (Reason + Act):* Interleaving verbal reasoning with concrete tool invocations.
4. **Tool Execution:** Structured JSON schemas that allow the LLM to trigger code, call external APIs, or query databases.`,
            quiz: {
              id: "quiz-agent-1",
              lessonId: "les-agent-arch",
              questions: [
                {
                  id: "qa1",
                  question: "What constitutes the 'ReAct' design pattern in agentic systems?",
                  options: [
                    "React.js frontend library integration",
                    "Interleaving verbal reasoning with concrete tool invocations and environment observations",
                    "Fast reactive caching",
                    "Real-time audio processing"
                  ],
                  correctIndex: 1,
                  explanation: "ReAct stands for Reason + Act, where the model outputs reasoning thoughts followed by action calls, then observes the result before continuing."
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

export const SEED_PROMPTS: PromptTemplate[] = [
  {
    id: "prompt-senior-architect",
    slug: "senior-software-architect",
    title: "Principal Software Architect Code Reviewer",
    category: "Coding & Architecture",
    objective: "Perform a rigorous production-grade code review evaluating scalability, race conditions, edge cases, and architectural cohesion.",
    context: "Reviewing pull requests or critical codebase modules before deployment to high-traffic environments.",
    instructions: "Critique the provided code across 5 dimensions: 1) System Security & Injections, 2) Concurrency & Memory Leaks, 3) Big-O Performance, 4) Error Handling & Graceful Degradation, 5) Clean Code & Typings. Propose concrete refactored snippets.",
    constraints: "Do not offer generic compliments. Highlight actual security vectors and failure modes. Keep tone direct, professional, and actionable.",
    outputFormat: "Markdown with severity tags ([CRITICAL], [WARNING], [OPTIMIZATION]), followed by a drop-in replacement code block.",
    fullTemplate: `You are a Principal Software Architect with 15+ years of experience in distributed systems.
Objective: Perform a comprehensive, zero-fluff code review on the code below.

Evaluate across these strict criteria:
1. Security vulnerabilities (injection, auth bypass, unvalidated inputs)
2. Performance bottlenecks & memory/connection leaks
3. Race conditions, concurrency issues, edge cases
4. Type safety and robust error handling

Code to review:
{{CODE_INPUT}}

Provide your findings in markdown format:
- Executive Summary (Pass / Request Changes)
- Critical Findings & Explanations
- Refactored Drop-in Implementation`,
    upvotes: 428,
    author: "AI Atlas Engineering",
    tags: ["typescript", "architecture", "security", "code-review"],
    createdAt: "2026-10-15",
  },
  {
    id: "prompt-socratic-tutor",
    slug: "socratic-learning-tutor",
    title: "Socratic AI Tutor & Concept Explainer",
    category: "Learning & Education",
    objective: "Help the student truly internalize difficult computer science concepts using guided Socratic questioning rather than just spoon-feeding answers.",
    context: "User is studying complex algorithms, neural network math, or systems programming.",
    instructions: "Adopt the persona of an empathetic yet rigorous professor. Explain the concept in 2 intuitive sentences, ask the user a guiding question to test their intuition, and provide an interactive thought experiment.",
    constraints: "Never give away the final solution immediately. Guide the learner step by step.",
    outputFormat: "Structured sections: Intuition Hook -> Guiding Question -> Your Turn.",
    fullTemplate: `You are an expert Socratic educator specializing in Artificial Intelligence and Computer Science.
Topic: {{TOPIC}}
Learner Level: {{LEARNER_LEVEL}}

1. Give a vivid real-world analogy to establish intuition.
2. Ask one targeted question that exposes the core underlying challenge this concept solves.
3. Pause and wait for the learner's response before diving into math or code.`,
    upvotes: 312,
    author: "Pedagogy Lab",
    tags: ["learning", "socratic", "tutor", "conceptual"],
    createdAt: "2026-10-20",
  },
  {
    id: "prompt-structured-extractor",
    slug: "json-data-extractor",
    title: "Deterministic Structured JSON Extractor",
    category: "Data Extraction",
    objective: "Extract untidy, unstructured text into a validated, strictly typed JSON object matching an exact schema.",
    context: "Ingesting invoices, resumes, medical summaries, or messy web scrapes into downstream databases.",
    instructions: "Extract all key entities, normalize dates to ISO-8601, clean phone numbers, and populate missing fields with null. Ensure output is valid JSON without conversational wrapper text.",
    constraints: "Output ONLY raw JSON. No markdown code blocks, no preamble, no postscript.",
    outputFormat: "Pure JSON object adhering to provided schema.",
    fullTemplate: `You are a deterministic data normalization engine.
Given the unstructured text below, extract all attributes strictly matching the JSON schema provided.

Rules:
- Never hallucinate unmentioned facts; use null.
- Format all timestamps to ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).
- Output valid JSON ONLY.

Target Schema:
{{SCHEMA}}

Source Text:
{{UNSTRUCTURED_TEXT}}`,
    upvotes: 289,
    author: "Data Systems Team",
    tags: ["json", "extraction", "automation", "rag"],
    createdAt: "2026-10-25",
  }
];

export const SEED_GLOSSARY: GlossaryTerm[] = [
  {
    id: "term-transformer",
    term: "Transformer",
    slug: "transformer",
    category: "Architecture",
    beginnerDefinition: "A revolutionary neural network architecture introduced in 2017 that processes all words in a sentence at once (using attention), enabling modern models like ChatGPT and Claude.",
    advancedDefinition: "A deep learning model relying entirely on self-attention mechanisms to compute representations of its input and output sequences without using recurrent networks (RNNs) or convolutions. Key components include multi-head scaled dot-product attention, positional encodings, layer normalization, and feed-forward sublayers.",
    practicalExample: "Translating 'The bank of the river' vs 'The bank granted a loan': the self-attention mechanism lets 'bank' look at 'river' or 'loan' to know its exact contextual meaning.",
    relatedTerms: ["Self-Attention", "Token", "Embedding", "Encoder-Decoder"]
  },
  {
    id: "term-rag",
    term: "Retrieval-Augmented Generation (RAG)",
    slug: "rag",
    category: "Architecture",
    beginnerDefinition: "A technique that lets an AI look up private documents or recent internet information before answering, preventing it from making things up.",
    advancedDefinition: "An architectural pattern that combines an information retrieval component (usually dense semantic search over vector embeddings) with a generative language model. At query time, top-k relevant document chunks are retrieved and injected into the model's prompt context, grounding the generation in verifiable domain knowledge.",
    practicalExample: "Uploading a 500-page corporate PDF manual into a company chatbot so it can quote exact page numbers when answering HR policy questions.",
    relatedTerms: ["Vector Database", "Embedding", "Chunking", "Cosine Similarity"]
  },
  {
    id: "term-quantization",
    term: "Quantization",
    slug: "quantization",
    category: "Optimization & Hardware",
    beginnerDefinition: "Compressing an AI model so it takes up less memory and runs faster on consumer laptops without losing much intelligence.",
    advancedDefinition: "The process of reducing the precision of the numerical weights in a neural network—for instance, converting 16-bit floating point numbers (FP16) down to 8-bit, 4-bit, or even 2-bit integers (INT8, INT4, GGUF/AWQ/GPTQ). This drastically reduces VRAM requirements and memory bandwidth pressure with minimal perplexity degradation.",
    practicalExample: "Running a 70-billion parameter model like Llama 3.1 (which requires 140GB of VRAM in FP16) on a single high-end Mac or PC with 40GB of unified RAM using 4-bit quantization.",
    relatedTerms: ["GGUF", "VRAM", "Ollama", "Fine-Tuning"]
  },
  {
    id: "term-agent",
    term: "AI Agent",
    slug: "ai-agent",
    category: "Autonomous Systems",
    beginnerDefinition: "An AI system that doesn't just reply with words, but takes autonomous actions—like running code, browsing websites, and using tools to complete a multi-step mission.",
    advancedDefinition: "An autonomous entity driven by a foundation model acting as a central controller. An agent maintains memory (episodic and semantic), formulates goal-directed plans (hierarchical task networks, reflection loops), selects and invokes external tools through structured schemas, and iterates until an end condition is satisfied.",
    practicalExample: "An agent asked to 'find the cheapest flight to Tokyo in May' logs into airline APIs, compares dates, creates a spreadsheet, and drafts an itinerary for your approval.",
    relatedTerms: ["Tool Calling", "ReAct", "Subagent", "Multi-Agent Systems"]
  }
];

export const SEED_GRAPH_NODES: KnowledgeNode[] = [
  { id: "node-ai", slug: "artificial-intelligence", label: "Artificial Intelligence", category: "Concept", description: "The overarching scientific discipline of creating intelligent machines.", level: "beginner", linkUrl: "/fundamentals/what-is-ai", x: 400, y: 100 },
  { id: "node-ml", slug: "machine-learning", label: "Machine Learning", category: "Concept", description: "Algorithms that learn patterns from empirical training data.", level: "beginner", linkUrl: "/fundamentals", x: 400, y: 220 },
  { id: "node-dl", slug: "deep-learning", label: "Deep Learning", category: "Concept", description: "Multi-layered artificial neural networks mimicking brain connectivity.", level: "intermediate", linkUrl: "/fundamentals", x: 400, y: 340 },
  { id: "node-transformer", slug: "transformer", label: "Transformer Architecture", category: "Architecture", description: "Attention-based foundation of all modern generative AI models.", level: "advanced", linkUrl: "/dictionary#transformer", x: 400, y: 460 },
  { id: "node-llm", slug: "large-language-models", label: "Large Language Models", category: "Model", description: "Billion-parameter foundation models trained on massive text corpora.", level: "intermediate", linkUrl: "/models", x: 250, y: 580 },
  { id: "node-agents", slug: "ai-agents", label: "Autonomous AI Agents", category: "Concept", description: "Goal-driven systems utilizing tools, memory, and reflection.", level: "advanced", linkUrl: "/agents", x: 100, y: 700 },
  { id: "node-rag", slug: "rag", label: "RAG Systems", category: "Architecture", description: "Retrieval-Augmented Generation connecting LLMs to external data.", level: "advanced", linkUrl: "/dev-lab", x: 250, y: 700 },
  { id: "node-ollama", slug: "ollama", label: "Ollama (Local AI)", category: "Tool", description: "Local model execution engine providing offline inference.", level: "intermediate", linkUrl: "/tools/ollama", x: 400, y: 700 },
  { id: "node-claude", slug: "claude", label: "Claude 3.5 Sonnet", category: "Model", description: "Frontier reasoning and coding intelligence model.", level: "advanced", linkUrl: "/models/claude-3-5-sonnet", x: 550, y: 580 },
  { id: "node-cursor", slug: "cursor", label: "Cursor AI IDE", category: "Tool", description: "AI-first code editor powered by codebase vector indexing.", level: "intermediate", linkUrl: "/tools/cursor", x: 700, y: 700 },
];

export const SEED_GRAPH_EDGES: KnowledgeEdge[] = [
  { id: "e1", source: "node-ai", target: "node-ml", relationship: "prerequisite_of", label: "Subfield" },
  { id: "e2", source: "node-ml", target: "node-dl", relationship: "prerequisite_of", label: "Specialization" },
  { id: "e3", source: "node-dl", target: "node-transformer", relationship: "implements", label: "Underlies" },
  { id: "e4", source: "node-transformer", target: "node-llm", relationship: "powers", label: "Architects" },
  { id: "e5", source: "node-llm", target: "node-agents", relationship: "powers", label: "Controls" },
  { id: "e6", source: "node-llm", target: "node-rag", relationship: "uses", label: "Augments" },
  { id: "e7", source: "node-llm", target: "node-claude", relationship: "belongs_to", label: "Instance" },
  { id: "e8", source: "node-llm", target: "node-ollama", relationship: "uses", label: "Executes" },
  { id: "e9", source: "node-claude", target: "node-cursor", relationship: "powers", label: "Backbone" },
];

export const SEED_PROJECTS: PracticalProject[] = [
  {
    id: "proj-rag-system",
    slug: "build-rag-knowledge-system",
    title: "Build a Production RAG System with Vector Search",
    description: "Step-by-step tutorial constructing a private document Q&A engine using sentence embeddings, cosine vector similarity, and LLM synthesis.",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    toolsNeeded: ["Node.js or Python", "OpenAI or Gemini API Key", "Vector Store"],
    prerequisites: ["Basic JavaScript/TypeScript or Python", "API Key setup"],
    steps: [
      {
        stepNumber: 1,
        title: "Document Ingestion & Chunking",
        instructionsMarkdown: "Split large markdown and PDF texts into semantic chunks with a 200-token overlap to preserve continuity.",
        codeLanguage: "typescript",
        codeSnippet: `function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}`
      },
      {
        stepNumber: 2,
        title: "Embedding Generation & Cosine Match",
        instructionsMarkdown: "Generate numerical embeddings for each chunk and store them in memory. Calculate dot-product similarity against incoming user queries.",
        codeLanguage: "typescript",
        codeSnippet: `function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}`
      }
    ],
    expectedOutcome: "A functional command-line or web application that answers user queries based strictly on uploaded custom documentation.",
    troubleshootingTips: ["If the model hallucinates, verify your chunk size isn't cutting sentences in half.", "Always inject a strict system instruction: 'Answer only based on the retrieved facts below.'"]
  }
];

export const SEED_INDUSTRIES: IndustryApplication[] = [
  {
    id: "ind-healthcare",
    slug: "healthcare-and-medicine",
    name: "Healthcare & Medicine",
    iconName: "Activity",
    overview: "Artificial Intelligence is transforming biomedical discovery, medical imaging diagnostic accuracy, protein folding prediction, and personalized treatment planning.",
    keyUseCases: [
      {
        title: "AlphaFold & Molecular Design",
        description: "Predicting 3D protein structures with atomic precision, reducing biological research cycles from years to minutes.",
        impact: "Accelerated drug discovery and synthetic biology breakthroughs."
      },
      {
        title: "Radiological Diagnostics",
        description: "Computer vision algorithms detecting early-stage pulmonary nodules and microfractures faster than human baselines.",
        impact: "Early cancer intervention and reduced diagnostic latency in overburdened hospitals."
      }
    ],
    leadingCompanies: ["Google DeepMind (AlphaFold)", "Tempus AI", "Insilico Medicine", "PathAI"],
    ethicalConsiderations: "Patient data confidentiality (HIPAA), algorithmic bias across diverse demographics, and medical liability."
  },
  {
    id: "ind-web3",
    slug: "web3-and-blockchain",
    name: "Cryptocurrency & Web3",
    iconName: "Cpu",
    overview: "AI provides autonomous smart contract vulnerability auditing, algorithmic on-chain forensic analytics, and decentralized machine learning computing networks.",
    keyUseCases: [
      {
        title: "Automated Smart Contract Auditing",
        description: "Static and dynamic analysis using specialized LLMs to detect reentrancy bugs, flash loan exploits, and logic flaws prior to mainnet deployment.",
        impact: "Preventing millions of dollars in DeFi hacks."
      },
      {
        title: "Decentralized Compute & Zero-Knowledge ML",
        description: "Cryptographic verification of AI inferences (zkML) and decentralized GPU coordination markets.",
        impact: "Permissionless access to machine learning compute."
      }
    ],
    leadingCompanies: ["Bittensor", "Ritual", "Chainalysis", "CertiK"],
    ethicalConsiderations: "Educational technology analysis only. Never to be construed as financial or investment advice."
  }
];

export const SEED_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    slug: "reasoning-models-advancement",
    title: "The Rise of Test-Time Compute: How Extended Thinking Transforms LLM Accuracy",
    summary: "Researchers discover that allocating inference-time compute for chain-of-thought exploration yields exponential gains in mathematical proofs and software synthesis.",
    source: "AI Atlas Research Dispatch",
    sourceUrl: "https://aiatlas.io/research",
    category: "Research Breakthroughs",
    publishedAt: "2026-11-12",
    isVerified: true,
    tags: ["reasoning", "test-time-compute", "frontier-ai", "deep-learning"]
  },
  {
    id: "news-2",
    slug: "local-slm-revolution",
    title: "Small Language Models (SLMs) Achieve Desktop Independence",
    summary: "New 3B to 8B parameter models running quantized on smartphones and laptops outperform 2023-era frontier cloud models while protecting user privacy.",
    source: "Open Source AI Consortium",
    sourceUrl: "https://ollama.com",
    category: "Local AI & Hardware",
    publishedAt: "2026-11-10",
    isVerified: true,
    tags: ["slm", "local-ai", "edge-computing", "privacy"]
  }
];

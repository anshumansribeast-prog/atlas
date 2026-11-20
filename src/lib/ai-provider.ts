export type AIProviderName = "gemini" | "openai" | "anthropic" | "ollama";

export interface AICompletionOptions {
  provider?: AIProviderName;
  model?: string;
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResult {
  text: string;
  provider: AIProviderName;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  durationMs: number;
  isFallback: boolean;
}

export class AIProviderGateway {
  private geminiKey?: string;
  private openAIKey?: string;
  private anthropicKey?: string;
  private ollamaUrl: string;

  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.openAIKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.ollamaUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  }

  public getAvailableProviders(): { name: AIProviderName; label: string; isConfigured: boolean; defaultModel: string }[] {
    return [
      {
        name: "gemini",
        label: "Google Gemini",
        isConfigured: !!this.geminiKey,
        defaultModel: "gemini-1.5-flash",
      },
      {
        name: "anthropic",
        label: "Anthropic Claude",
        isConfigured: !!this.anthropicKey,
        defaultModel: "claude-3-5-sonnet-20241022",
      },
      {
        name: "openai",
        label: "OpenAI",
        isConfigured: !!this.openAIKey,
        defaultModel: "gpt-4o-mini",
      },
      {
        name: "ollama",
        label: "Local Ollama Instance",
        isConfigured: true, // Local instance endpoint can always be probed
        defaultModel: "llama3.1",
      },
    ];
  }

  public async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    const startTime = Date.now();
    const targetProvider = options.provider || this.selectDefaultProvider();

    try {
      if (targetProvider === "gemini" && this.geminiKey) {
        return await this.callGemini(options, startTime);
      } else if (targetProvider === "openai" && this.openAIKey) {
        return await this.callOpenAI(options, startTime);
      } else if (targetProvider === "anthropic" && this.anthropicKey) {
        return await this.callAnthropic(options, startTime);
      } else if (targetProvider === "ollama") {
        return await this.callOllama(options, startTime);
      }
    } catch (err) {
      console.warn(`Primary provider [${targetProvider}] failed:`, err);
      // Attempt fallback if another provider key is available
      return await this.attemptFallback(options, targetProvider, startTime);
    }

    // If no provider key is configured, return a structured setup explanation
    return this.createNotConfiguredResponse(targetProvider, options, startTime);
  }

  private selectDefaultProvider(): AIProviderName {
    if (this.geminiKey) return "gemini";
    if (this.openAIKey) return "openai";
    if (this.anthropicKey) return "anthropic";
    return "ollama";
  }

  private async callGemini(options: AICompletionOptions, startTime: number): Promise<AICompletionResult> {
    const model = options.model || "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiKey}`;

    const contents: any[] = [];
    if (options.systemPrompt) {
      contents.push({ role: "user", parts: [{ text: `[SYSTEM INSTRUCTIONS]: ${options.systemPrompt}` }] });
      contents.push({ role: "model", parts: [{ text: "Understood. I will strictly follow these instructions." }] });
    }
    contents.push({ role: "user", parts: [{ text: options.prompt }] });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 1500,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "No response received.";
    const totalTokens = data.usageMetadata?.totalTokenCount || Math.ceil((options.prompt.length + text.length) / 4);

    return {
      text,
      provider: "gemini",
      model,
      tokensUsed: {
        prompt: data.usageMetadata?.promptTokenCount || Math.ceil(options.prompt.length / 4),
        completion: data.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4),
        total: totalTokens,
      },
      durationMs: Date.now() - startTime,
      isFallback: false,
    };
  }

  private async callOpenAI(options: AICompletionOptions, startTime: number): Promise<AICompletionResult> {
    const model = options.model || "gpt-4o-mini";
    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: options.prompt });

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAIKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1500,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error (${res.status}): ${await res.text()}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    return {
      text,
      provider: "openai",
      model,
      tokensUsed: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0,
      },
      durationMs: Date.now() - startTime,
      isFallback: false,
    };
  }

  private async callAnthropic(options: AICompletionOptions, startTime: number): Promise<AICompletionResult> {
    const model = options.model || "claude-3-5-sonnet-20241022";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.anthropicKey!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        system: options.systemPrompt,
        messages: [{ role: "user", content: options.prompt }],
        max_tokens: options.maxTokens ?? 1500,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error(`Anthropic API error (${res.status}): ${await res.text()}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "";

    return {
      text,
      provider: "anthropic",
      model,
      tokensUsed: {
        prompt: data.usage?.input_tokens || 0,
        completion: data.usage?.output_tokens || 0,
        total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      durationMs: Date.now() - startTime,
      isFallback: false,
    };
  }

  private async callOllama(options: AICompletionOptions, startTime: number): Promise<AICompletionResult> {
    const model = options.model || "llama3.1";
    const res = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        system: options.systemPrompt,
        prompt: options.prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama connection error (${res.status}). Is Ollama running on ${this.ollamaUrl}?`);
    }

    const data = await res.json();
    const text = data.response || "";

    return {
      text,
      provider: "ollama",
      model,
      tokensUsed: {
        prompt: data.prompt_eval_count || 0,
        completion: data.eval_count || 0,
        total: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      durationMs: Date.now() - startTime,
      isFallback: false,
    };
  }

  private async attemptFallback(
    options: AICompletionOptions,
    failedProvider: AIProviderName,
    startTime: number
  ): Promise<AICompletionResult> {
    const alternatives: AIProviderName[] = ["gemini", "anthropic", "openai", "ollama"];
    for (const alt of alternatives) {
      if (alt !== failedProvider) {
        try {
          if (alt === "gemini" && this.geminiKey) {
            const res = await this.callGemini(options, startTime);
            return { ...res, isFallback: true };
          }
          if (alt === "openai" && this.openAIKey) {
            const res = await this.callOpenAI(options, startTime);
            return { ...res, isFallback: true };
          }
          if (alt === "anthropic" && this.anthropicKey) {
            const res = await this.callAnthropic(options, startTime);
            return { ...res, isFallback: true };
          }
        } catch {
          continue;
        }
      }
    }
    return this.createNotConfiguredResponse(failedProvider, options, startTime);
  }

  private createNotConfiguredResponse(
    provider: AIProviderName,
    options: AICompletionOptions,
    startTime: number
  ): AICompletionResult {
    return {
      text: `### ⚙️ AI Provider Setup Required\n\nAI ATLAS connects to real AI models via provider APIs. Currently, no active API key was detected for **${provider.toUpperCase()}** in your environment.\n\n**To connect live model inference:**\n1. Add your API key to \`.env.local\` in the project root:\n   \`\`\`bash\n   GEMINI_API_KEY="your-gemini-key"\n   # or\n   OPENAI_API_KEY="sk-..."\n   # or run Ollama locally: ollama run llama3.1\n   \`\`\`\n2. Restart the development server.\n\n*In the meantime, you can explore the complete verified knowledge database, interactive prompts, and learning modules!*`,
      provider,
      model: "unconfigured",
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      durationMs: Date.now() - startTime,
      isFallback: false,
    };
  }
}

export const aiGateway = new AIProviderGateway();

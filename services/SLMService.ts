/**
 * SLMService (Small Language Model)
 * Handles intent classification using Ollama phi3:instruct model with keyword-based fallback.
 */

import { INTENT_SYSTEM_PROMPT_NEW } from '../lib/slmPrompt';

export interface IntentClassification {
  intent: string;
  confidence: number;
  reason: string;
}

interface SlmIntentResult {
  intent: string;
  confidence: number; // 0–1
  params: Record<string, any>;
}

type SlmIntentResponse = SlmIntentResult & { durationMs: number };

interface ClassifyIntentOptions {
  allowFallback?: boolean;
}

export class SLMService {
  private readonly validIntents = [
    'product_search',
    'price_query',
    'bulk_or_budget_search',
    'comparison_search',
    'problem_solving_search',
    'project_based_search',
    'navigation',
    'navigation_with_parameters',
    'unknown'
  ];

  // Concurrency control
  private readonly maxConcurrency: number;
  private activeRequests: number = 0;
  private requestQueue: Array<{
    resolve: (value: SlmIntentResult | null) => void;
    reject: (error: any) => void;
    message: string;
    context?: string;
    ollamaUrl: string;
    ollamaModel: string;
  }> = [];

  constructor() {
    // Default to 3 concurrent requests, configurable via env var
    this.maxConcurrency = parseInt(process.env.OLLAMA_MAX_CONCURRENCY || '3', 10) || 3;
  }

  async classifyIntent(
    message: string,
    context?: string,
    options?: ClassifyIntentOptions
  ): Promise<SlmIntentResponse> {
    const startedAt = Date.now();
    const withDuration = (result: SlmIntentResult): SlmIntentResponse => ({
      ...result,
      durationMs: Date.now() - startedAt
    });
    const { allowFallback = false } = options ?? {};
    // Always try Ollama first if enabled (each request attempts Ollama independently)
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    const ollamaModel = process.env.OLLAMA_SLM_MODEL || 'phi3:instruct';

    if (process.env.USE_OLLAMA !== 'false') {
      try {
        const result = await this.classifyWithOllamaWithRetries(message, context, ollamaUrl, ollamaModel, {
          maxAttempts: 3,
          baseDelayMs: 2000
        });
        if (result) {
          return withDuration(result);
        }
      } catch (error) {
        if (process.env.DEBUG_OLLAMA === 'true') {
          console.error('Ollama request failed, falling back to keywords:', error);
        }
        if (!allowFallback) {
          throw error;
        }
      }
    }

    if (!allowFallback) {
      throw new Error('Ollama unavailable; fallback disabled for testing');
    }

    // Fallback to keyword matching only when allowed
    return withDuration(this.classifyWithKeywords(message));
  }

  private async waitForOllamaReady(baseUrl: string, timeoutMs: number = 30000, pollMs: number = 1000): Promise<void> {
    const startedAt = Date.now();
    while (true) {
      try {
        const res = await fetch(`${baseUrl}/api/tags`, { method: 'GET' });
        if (res.ok) {
          return;
        }
      } catch (err) {
        // Ignore errors and keep polling until timeout
      }

      if (Date.now() - startedAt >= timeoutMs) {
        throw new Error(`Ollama not ready after ${timeoutMs}ms`);
      }

      await this.delay(pollMs);
    }
  }

  private async classifyWithOllamaWithRetries(
    message: string,
    context: string | undefined,
    baseUrl: string,
    model: string,
    options: { maxAttempts: number; baseDelayMs: number }
  ): Promise<SlmIntentResult | null> {
    const { maxAttempts, baseDelayMs } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.waitForOllamaReady(baseUrl);
        const result = await this.classifyWithOllamaLimited(message, context, baseUrl, model);
        if (result) {
          return result;
        }
      } catch (error) {
        if (!this.isRetryableOllamaError(error)) {
          throw error;
        }
        if (attempt === maxAttempts) {
          throw error;
        }
      }

      if (attempt < maxAttempts) {
        const delayMs = baseDelayMs * attempt;
        await this.delay(delayMs);
      }
    }

    return null;
  }

  private isRetryableOllamaError(error: any): boolean {
    if (!error) {
      return false;
    }

    const retryableCodes = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT'];
    const code = (error as any)?.code;
    if (code && retryableCodes.includes(code)) {
      return true;
    }

    const status = (error as any)?.status;
    if (typeof status === 'number' && status >= 500 && status < 600) {
      return true;
    }

    return false;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Queue-based concurrency limiter for Ollama requests.
   */
  private async classifyWithOllamaLimited(
    message: string,
    context: string | undefined,
    baseUrl: string,
    model: string
  ): Promise<SlmIntentResult | null> {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.requestQueue.push({
        resolve: (result) => resolve(result),
        reject,
        message,
        context,
        ollamaUrl: baseUrl,
        ollamaModel: model
      });

      // Process queue
      this.processQueue();
    });
  }

  /**
   * Process the request queue respecting concurrency limits.
   */
  private async processQueue(): Promise<void> {
    // Don't process if we're at max concurrency or queue is empty
    if (this.activeRequests >= this.maxConcurrency || this.requestQueue.length === 0) {
      return;
    }

    // Get next request from queue
    const request = this.requestQueue.shift();
    if (!request) {
      return;
    }

    this.activeRequests++;

    try {
      const result = await this.classifyWithOllama(
        request.message,
        request.context,
        request.ollamaUrl,
        request.ollamaModel
      );
      // Resolve with Ollama result if successful, otherwise null (will trigger fallback in classifyIntent)
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeRequests--;
      // Process next item in queue
      this.processQueue();
    }
  }

  /**
   * Use Ollama phi3:instruct to classify intent.
   */
  private async classifyWithOllama(
    message: string,
    context: string | undefined,
    baseUrl: string,
    model: string
  ): Promise<SlmIntentResult | null> {
    try {
      const contextStr = context ? `\n\nContext from vector search:\n${context}` : '';
      const userPrompt = `User query: "${message}"${contextStr}`;

      const fullPrompt = `${INTENT_SYSTEM_PROMPT_NEW}\n\n${userPrompt}`;

      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          prompt: fullPrompt,
          keep_alive: '30s',
          stream: false,
          options: {
            temperature: 0.1, // Low temperature for consistent classification
            top_p: 0.9
          }
        })
      });

      if (!res.ok) {
        if (res.status >= 500) {
          const err = new Error(`Ollama SLM error: ${res.status} ${res.statusText}`);
          (err as any).status = res.status;
          throw err;
        }
        console.error(`Ollama SLM error: ${res.status} ${res.statusText}`);
        return null;
      }

      const data = await res.json();
      const content = data?.response || '';

      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Validate intent
          const intent = this.validIntents.includes(parsed.intent) 
            ? parsed.intent 
            : 'unknown';
          
          // Ensure confidence is between 0 and 1
          const confidence = Math.min(1, Math.max(0, parsed.confidence ?? 0.5));
          
          // Extract params if present
          const params = parsed.params || {};

          return {
            intent,
            confidence,
            params
          };
        } catch (err) {
          // JSON parse failed, log and fall back
          if (process.env.DEBUG_OLLAMA === 'true') {
            console.error('Ollama JSON parse error:', err);
            console.error('Response content:', content);
          }
        }
      }

      return null;
    } catch (err) {
      // Silently fallback to keyword matching if Ollama is unavailable
      // Only log if explicitly debugging (set DEBUG_OLLAMA=true)
      if (process.env.DEBUG_OLLAMA === 'true') {
        console.error('Ollama SLM error:', err);
      }
      return null;
    }
  }

  /**
   * Keyword-based intent classification fallback.
   */
  private classifyWithKeywords(text: string): SlmIntentResult {
    const lower = text.toLowerCase();

    // Price query keywords
    if (/(precio|cuánto cuesta|cuánto vale|valor|cost|price)/.test(lower)) {
      return {
        intent: 'price_query',
        confidence: 0.75,
        params: { product_description: text }
      };
    }

    // Budget/bulk keywords
    if (/(barato|económico|al por mayor|por volumen|presupuesto|low cost|cheap|budget|wholesale|bulk)/.test(lower)) {
      return {
        intent: 'bulk_or_budget_search',
        confidence: 0.70,
        params: { product_description: text, budget_keywords: [] }
      };
    }

    // Comparison keywords
    if (/(vs|versus|o |qué es mejor|diferencia|comparar|compare|mejor|better)/.test(lower)) {
      return {
        intent: 'comparison_search',
        confidence: 0.75,
        params: { options: [] }
      };
    }

    // Problem solving keywords
    if (/(cómo|cómo|solución|qué usar|material para|qué producto|qué sirve|how to|solution)/.test(lower)) {
      return {
        intent: 'problem_solving_search',
        confidence: 0.70,
        params: { problem_description: text }
      };
    }

    // Project-based keywords
    if (/(materiales para|qué necesito para|lista de materiales|herramientas para|equipos para|materials for|tools for)/.test(lower)) {
      return {
        intent: 'project_based_search',
        confidence: 0.70,
        params: { project_description: text }
      };
    }

    // Navigation keywords
    if (/(ir a|mostrar|ver|abrir|página|panel|sección|dashboard|products|invoices|go to|show|open)/.test(lower)) {
      // Check if it has filters/parameters
      if (/(filtro|filter|del|de|entre|desde|hasta|pendiente|status|categoría|category)/.test(lower)) {
        return {
          intent: 'navigation_with_parameters',
          confidence: 0.65,
          params: { target_page: '', filters: {} }
        };
      }
      return {
        intent: 'navigation',
        confidence: 0.65,
        params: { target_page: '' }
      };
    }

    // Product search (specs/characteristics, brand names, or specific products)
    if (/(\d+x\d+|\d+\/\d+|\d+mm|\d+ pulgadas|calibre|serie|gauge|awg|spec|specification|holcim|schneider|dewalt|sherwin|marca|brand|modelo|model|cemento|tubería|pvc|pintura|cerámica|porcelanato|cable|malla|ventana|perfil|yeso|drywall|taladro|herramienta)/.test(lower)) {
      return {
        intent: 'product_search',
        confidence: 0.65,
        params: { product_query: text }
      };
    }

    // Default to unknown
    return {
      intent: 'unknown',
      confidence: 0.50,
      params: {}
    };
  }
}

// Export singleton instance
export const slmService = new SLMService();

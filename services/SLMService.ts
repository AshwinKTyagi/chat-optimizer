/**
 * SLMService (Small Language Model)
 * Handles intent classification using Ollama phi3:instruct model with keyword-based fallback.
 */

import { INTENT_SYSTEM_PROMPT } from '../lib/slmPrompt';

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

export class SLMService {
  private readonly validIntents = [
    'direct_product_search',
    'attribute_based_search',
    'price_query',
    'bulk_or_budget_search',
    'comparison_search',
    'problem_solving_search',
    'project_based_search',
    'navigation',
    'navigation_with_parameters',
    'unknown'
  ];

  async classifyIntent(message: string, context?: string): Promise<SlmIntentResult> {
    // Try Ollama first
    const ollamaUrl = process.env.OLLAMA_URL || 'localhost';
    const ollamaModel = process.env.OLLAMA_SLM_MODEL || 'phi3:instruct';

    if (process.env.USE_OLLAMA !== 'false') {
      const result = await this.classifyWithOllama(message, context, ollamaUrl, ollamaModel);
      if (result) {
        return result;
      }
    }

    // Fallback to keyword matching
    return this.classifyWithKeywords(message);
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

      const fullPrompt = `${INTENT_SYSTEM_PROMPT}\n\n${userPrompt}`;

      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.1, // Low temperature for consistent classification
            top_p: 0.9
          }
        })
      });

      if (!res.ok) {
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

    // Attribute-based (specs/characteristics without price/budget)
    if (/(\d+x\d+|\d+\/\d+|\d+mm|\d+ pulgadas|calibre|serie|gauge|awg|spec|specification)/.test(lower)) {
      return {
        intent: 'attribute_based_search',
        confidence: 0.60,
        params: { attributes: text }
      };
    }

    // Direct product (brand names or specific products)
    if (/(holcim|schneider|dewalt|sherwin|marca|brand|modelo|model)/.test(lower)) {
      return {
        intent: 'direct_product_search',
        confidence: 0.65,
        params: { product_description: text }
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

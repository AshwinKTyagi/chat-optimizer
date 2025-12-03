/**
 * SLMService (Small Language Model)
 * Handles intent classification using either OpenAI API or keyword-based fallback.
 */

export interface IntentClassification {
  intent: string;
  confidence: number;
  reason: string;
}

export class SLMService {
  private readonly validIntents = ['greeting', 'billing', 'support', 'other'];

  /**
   * Classify the intent of a message.
   * Uses OpenAI Chat Completions if OPENAI_API_KEY is set; otherwise uses keyword matching.
   */
  async classifyIntent(message: string, context?: string): Promise<IntentClassification> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      return await this.classifyWithOpenAI(message, context, apiKey);
    } else {
      return this.classifyWithKeywords(message);
    }
  }

  /**
   * Use OpenAI Chat Completions to classify intent.
   */
  private async classifyWithOpenAI(message: string, context: string | undefined, apiKey: string): Promise<IntentClassification> {
    try {
      const contextStr = context ? `\nContext:\n${context}` : '';
      const prompt = `You are an intent classifier. Classify the user's message into one of these intents: ${this.validIntents.join(', ')}.

User message: "${message}"${contextStr}

Respond with a JSON object in this exact format:
{
  "intent": "<one of the intents>",
  "confidence": <number between 0 and 1>,
  "reason": "<short explanation>"
}`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0
        })
      });

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || '';

      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            intent: this.validIntents.includes(parsed.intent) ? parsed.intent : 'other',
            confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.5)),
            reason: parsed.reason || content
          };
        } catch (err) {
          // JSON parse failed, fall back to keyword matching
        }
      }

      // If JSON extraction failed, fall back to keyword matching on the response
      return this.classifyWithKeywords(content || message);
    } catch (err) {
      console.error('OpenAI classification error:', err);
      return this.classifyWithKeywords(message);
    }
  }

  /**
   * Keyword-based intent classification fallback.
   */
  private classifyWithKeywords(text: string): IntentClassification {
    const lower = text.toLowerCase();

    if (/(hi|hello|hey|greetings|good morning|good afternoon|good evening|welcome)/.test(lower)) {
      return {
        intent: 'greeting',
        confidence: 0.85,
        reason: 'Matched greeting keywords'
      };
    }

    if (/(billing|invoice|charge|payment|subscription|cost|price|paid|payment method|refund)/.test(lower)) {
      return {
        intent: 'billing',
        confidence: 0.80,
        reason: 'Matched billing keywords'
      };
    }

    if (/(error|bug|issue|technical support|help|troubleshoot|not working|failed|crashed|broken|problem)/.test(lower)) {
      return {
        intent: 'support',
        confidence: 0.85,
        reason: 'Matched support keywords'
      };
    }

    return {
      intent: 'other',
      confidence: 0.50,
      reason: 'No keyword matches'
    };
  }
}

// Export singleton instance
export const slmService = new SLMService();

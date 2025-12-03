/**
 * VectorEmbeddingService
 * Handles text embeddings and vector similarity search.
 * Uses OpenAI if OPENAI_API_KEY is set, otherwise falls back to a deterministic hash-based embedding.
 */

type EmbeddingVector = number[];

interface IntentDocument {
  id: string;
  intent: string;
  text: string;
  vector?: EmbeddingVector;
}

export class VectorEmbeddingService {
  private documents: Map<string, IntentDocument> = new Map();
  private cachedVectors: Map<string, EmbeddingVector> = new Map();

  constructor() {
    this.initializeSampleDocuments();
  }

  private initializeSampleDocuments() {
    const sampleDocs: IntentDocument[] = [
      { id: 'greeting', intent: 'greeting', text: 'hi hello hey greetings good morning' },
      { id: 'billing', intent: 'billing', text: 'billing invoice charge payment subscription cost price' },
      { id: 'support', intent: 'support', text: 'error bug issue technical support help troubleshoot' }
    ];

    sampleDocs.forEach((doc) => {
      this.documents.set(doc.id, doc);
    });
  }

  /**
   * Get embedding for a given text.
   * Calls OpenAI API if OPENAI_API_KEY is set; otherwise uses deterministic fallback.
   */
  async getEmbedding(text: string): Promise<EmbeddingVector> {
    if (this.cachedVectors.has(text)) {
      return this.cachedVectors.get(text)!;
    }

    let vector: EmbeddingVector;

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      vector = await this.getOpenAIEmbedding(text, apiKey);
    } else {
      vector = this.getDeterministicEmbedding(text);
    }

    this.cachedVectors.set(text, vector);
    return vector;
  }

  /**
   * Call OpenAI embeddings API.
   */
  private async getOpenAIEmbedding(text: string, apiKey: string): Promise<EmbeddingVector> {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text
        })
      });

      const data = await res.json();
      if (data.data && data.data[0] && Array.isArray(data.data[0].embedding)) {
        return data.data[0].embedding as EmbeddingVector;
      }
    } catch (err) {
      console.error('OpenAI embedding error:', err);
    }

    // Fallback if OpenAI fails
    return this.getDeterministicEmbedding(text);
  }

  /**
   * Deterministic embedding fallback using character-based hashing.
   */
  private getDeterministicEmbedding(text: string): EmbeddingVector {
    const len = 128;
    const vec = new Array(len).fill(0);

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const idx = code % len;
      vec[idx] = (vec[idx] || 0) + (code % 7) + 1;
    }

    // Normalize
    const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map((v) => v / mag);
  }

  /**
   * Find the nearest intent document to a given text.
   */
  async findNearestIntent(text: string, topK: number = 1) {
    const vector = await this.getEmbedding(text);
    return this.findNearestVector(vector, topK);
  }

  /**
   * Find the nearest intent document(s) to a given vector.
   */
  private findNearestVector(vector: EmbeddingVector, topK: number = 1) {
    const results: Array<{ intent: string; score: number; text: string }> = [];

    for (const [_id, doc] of this.documents) {
      const docVector = this.getDeterministicEmbedding(doc.text);
      const score = this.cosineSimilarity(vector, docVector);
      results.push({
        intent: doc.intent,
        score,
        text: doc.text
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  /**
   * Compute cosine similarity between two vectors.
   */
  private cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector): number {
    const n = Math.min(a.length, b.length);
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < n; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
  }

  /**
   * Add or update a document in the vector store.
   */
  addDocument(id: string, intent: string, text: string) {
    this.documents.set(id, { id, intent, text });
    this.cachedVectors.clear(); // Clear cache when docs change
  }
}

// Export singleton instance
export const vectorEmbeddingService = new VectorEmbeddingService();

/**
 * VectorEmbeddingService
 * Handles text embeddings and vector similarity search.
 * Uses Ollama (nomic-embed-model) with deterministic hash-based embedding fallback.
 */

import { sampleIntentDocuments } from '../data/sampleDocuments';

type EmbeddingVector = number[];

interface IntentDocument {
  id: string;
  intent: string;
  text: string;
  vector?: EmbeddingVector;
}

export interface VectorMatch {
  intent: string;
  score: number;
  text: string;
}

export interface VectorIntentResponse {
  matches: VectorMatch[];
  durationMs: number;
}

export class VectorEmbeddingService {
  private documents: Map<string, IntentDocument> = new Map();
  private cachedVectors: Map<string, EmbeddingVector> = new Map();
  private readonly confidenceThreshold = 0.6;

  constructor() {
    this.initializeSampleDocuments();
  }

  private initializeSampleDocuments() {
    sampleIntentDocuments.forEach((doc) => {
      this.documents.set(doc.id, doc);
    });
  }

  /**
   * Get embedding for a given text.
   * Uses Ollama (nomic-embed-model) with deterministic fallback if Ollama is unavailable.
   */
  async getEmbedding(text: string): Promise<EmbeddingVector> {
    if (this.cachedVectors.has(text)) {
      return this.cachedVectors.get(text)!;
    }

    let vector: EmbeddingVector | null = null;

    // Try Ollama first
    // Use 127.0.0.1 explicitly to avoid IPv6 resolution issues
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    const ollamaModel = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
    
    if (process.env.USE_OLLAMA !== 'false') {
      vector = await this.getOllamaEmbedding(text, ollamaUrl, ollamaModel);
      if (vector) {
        this.cachedVectors.set(text, vector);
        return vector;
      }
    }

    // Fallback to deterministic embedding if Ollama fails or is disabled
    vector = this.getDeterministicEmbedding(text);
    this.cachedVectors.set(text, vector);
    return vector;
  }

  /**
   * Call Ollama embeddings API for nomic-embed-model.
   */
  private async getOllamaEmbedding(text: string, baseUrl: string, model: string): Promise<EmbeddingVector | null> {
    try {
      const res = await fetch(`${baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          prompt: text
        })
      });

      if (!res.ok) {
        console.error(`Ollama embedding error: ${res.status} ${res.statusText}`);
        return null;
      }

      const data = await res.json();
      if (data.embedding && Array.isArray(data.embedding)) {
        return data.embedding as EmbeddingVector;
      }
    } catch (err) {
      // Silently fallback to deterministic embedding if Ollama is unavailable
      // Only log if explicitly debugging (set DEBUG_OLLAMA=true)
      if (process.env.DEBUG_OLLAMA === 'true') {
        console.error('Ollama embedding error:', err);
      }
    }

    return null;
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
  async findNearestIntent(text: string, topK: number = 1): Promise<VectorIntentResponse> {
    const startedAt = Date.now();
    const vector = await this.getEmbedding(text);
    const matches = await this.findNearestVector(vector, topK);
    return {
      matches,
      durationMs: Date.now() - startedAt
    };
  }

  /**
   * Find the nearest intent document(s) to a given vector.
   */
  private async findNearestVector(vector: EmbeddingVector, topK: number = 1): Promise<VectorMatch[]> {
    const results: VectorMatch[] = [];

    for (const [_id, doc] of this.documents) {
      // Get embedding for document text using the same method as query
      const docVector = await this.getEmbedding(doc.text);
      const score = this.cosineSimilarity(vector, docVector);
      results.push({
        intent: doc.intent,
        score,
        text: doc.text
      });
    }

    results.sort((a, b) => b.score - a.score);

    const topMatch = results[0];
    if (!topMatch || topMatch.score < this.confidenceThreshold) {
      return [
        {
          intent: 'toFallback',
          score: topMatch?.score ?? 0,
          text: 'Confidence below threshold'
        }
      ];
    }

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

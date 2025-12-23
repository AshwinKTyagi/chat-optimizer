/**
 * VectorEmbeddingService
 * Handles text embeddings and vector similarity search.
 * Uses Ollama (nomic-embed-text) with deterministic hash-based embedding fallback.
 */

import { sampleIntentDocuments } from '../data/sampleDocuments';
import { ruleRouter, ScoreMap, createEmptyScoreMap } from './SoftGate';

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
}

export interface VectorIntentResponse {
  scores: VectorMatch[];
  durationMs: number;
  averageTopKScore: number;
}

export class VectorEmbeddingService {
  private documents: Map<string, IntentDocument> = new Map();
  private cachedVectors: Map<string, EmbeddingVector> = new Map();
  private readonly confidenceThreshold = 0.65;

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
   * Uses Ollama (nomic-embed-text) with deterministic fallback if Ollama is unavailable.
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
    const scores = await this.findNearestVector(text, vector, topK);
    const averageTopKScore = this.topKSimilarity(scores, topK);

    return {
      scores,
      durationMs: Date.now() - startedAt,
      averageTopKScore
    };
  }

  /**
   * Find the nearest intent document(s) to a given vector.
   */
  private async findNearestVector(queryText: string, vector: EmbeddingVector, topK: number = 1): Promise<VectorMatch[]> {
    const bestByIntent = new Map<string, VectorMatch>();

    for (const [_id, doc] of this.documents) {
      // Get embedding for document text using the same method as query
      const docVector = await this.getEmbedding(doc.text);
      const score = this.cosineSimilarity(vector, docVector);

      const existing = bestByIntent.get(doc.intent);
      if (!existing || score > existing.score) {
        bestByIntent.set(doc.intent, {
          intent: doc.intent,
          score
        });
      }
    }

    const baseScores: Partial<ScoreMap> = {};
    for (const [intent, match] of bestByIntent) {
      baseScores[intent as keyof ScoreMap] = match.score;
    }

    const { boosted } = ruleRouter(queryText, baseScores);

    for (const [intent, match] of bestByIntent) {
      const adjusted = boosted[intent as keyof ScoreMap];
      if (typeof adjusted === 'number' && !Number.isNaN(adjusted)) {
        match.score = adjusted;
      }
    }

    const sortedBoosted = Object.entries(boosted).sort((a, b) => b[1] - a[1]);
    
    const topKMatches = sortedBoosted.slice(0, topK).map(([intent, score]) => ({ intent, score }));

    return topKMatches;
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

  private topKSimilarity(scores: VectorMatch[], topK: number): number {
    const rankedValues = scores
      .filter((score) => typeof score === 'number' && !Number.isNaN(score) && score > 0)
      .sort((a, b) => b - a);

    if (!rankedValues.length || topK <= 0) {
      return 0;
    }
    const slice = rankedValues.slice(0, topK);
    const total = slice.reduce((sum, value) => sum + value, 0);
    return total / slice.length;
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

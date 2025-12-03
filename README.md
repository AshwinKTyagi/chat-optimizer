# Chat Optimizer — Next.js TypeScript Chatbot

A Next.js application with TypeScript that implements a chatbot with multiple intent classification pathways using vector embeddings and Small Language Models (SLM).

## Project Structure

```
Chat Optimizer/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main chat UI page
│   └── api/
│       └── intent/
│           ├── embedding/route.ts    # Vector embedding intent classification
│           ├── slm/route.ts          # SLM intent classification
│           └── hybrid/route.ts       # Hybrid (embedding + SLM) classification
├── services/
│   ├── VectorEmbeddingService.ts     # Vector embedding service (singleton)
│   └── SLMService.ts                  # SLM classification service (singleton)
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   cd "Chat Optimizer"
   npm install
   ```

2. (Optional) Set up OpenAI API key for better embeddings and SLM:
   ```bash
   echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to see the chat UI.

## API Endpoints

### POST `/api/intent/embedding`
Classifies intent using vector embedding similarity.

**Request:**
```json
{
  "message": "I have a billing question"
}
```

**Response:**
```json
{
  "message": "I have a billing question",
  "method": "embedding",
  "results": [
    {
      "intent": "billing",
      "score": 0.85,
      "text": "billing invoice charge payment subscription cost price"
    }
  ],
  "topIntent": { "intent": "billing", "score": 0.85, "text": "..." }
}
```

### POST `/api/intent/slm`
Classifies intent using Small Language Model (OpenAI or keyword fallback).

**Request:**
```json
{
  "message": "My app is crashing with errors"
}
```

**Response:**
```json
{
  "message": "My app is crashing with errors",
  "method": "slm",
  "classification": {
    "intent": "support",
    "confidence": 0.85,
    "reason": "Matched support keywords"
  }
}
```

### POST `/api/intent/hybrid`
Combines embedding lookup with SLM classification for improved accuracy.

**Request:**
```json
{
  "message": "I need help with billing"
}
```

**Response:**
```json
{
  "vectorMatches": [...],
  "slm": { "intent": "billing", "confidence": 0.9, "reason": "..." }
}
```

## Services

### VectorEmbeddingService
- **Location:** `services/VectorEmbeddingService.ts`
- **Singleton Instance:** `vectorEmbeddingService`
- **Methods:**
  - `getEmbedding(text: string)` — Get vector embedding for text
  - `findNearestIntent(text: string, topK?: number)` — Find nearest intent documents by similarity

**Features:**
- Uses OpenAI Text Embedding API if `OPENAI_API_KEY` is set
- Falls back to deterministic character-based hashing if no API key
- In-memory vector store with sample intent documents
- Caching for performance

### SLMService
- **Location:** `services/SLMService.ts`
- **Singleton Instance:** `slmService`
- **Methods:**
  - `classifyIntent(message: string, context?: string)` — Classify intent of a message

**Features:**
- Uses OpenAI Chat Completions if `OPENAI_API_KEY` is set
- Falls back to keyword-based classification if no API key
- Supports optional context for improved classification
- Returns intent, confidence score, and explanation

## Usage Examples

### Vector Embedding Route
```bash
curl -X POST http://localhost:3000/api/intent/embedding \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi there, how are you?"}'
```

### SLM Route
```bash
curl -X POST http://localhost:3000/api/intent/slm \
  -H "Content-Type: application/json" \
  -d '{"message":"I was charged twice"}'
```

### Hybrid Route
```bash
curl -X POST http://localhost:3000/api/intent/hybrid \
  -H "Content-Type: application/json" \
  -d '{"message":"Error: app crashed"}'
```

## Environment Variables

- `OPENAI_API_KEY` — OpenAI API key (optional, uses fallback if not set)

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server

## Key Design Principles

- **Singleton Services:** Both `VectorEmbeddingService` and `SLMService` are exported as singleton instances, ensuring routes have unchanging references.
- **TypeScript:** Full type safety throughout the application.
- **Fallbacks:** Both services gracefully fall back to keyword-based approaches if OpenAI API is unavailable.
- **App Router:** Uses Next.js 13+ App Router for better performance and developer experience.

## Next Steps

- Add a UI to compare results from both classification methods
- Persist vector embeddings to a database (e.g., Pinecone, Weaviate)
- Add fine-tuned SLM models
- Implement A/B testing for different classification strategies

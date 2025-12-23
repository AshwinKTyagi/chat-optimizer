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
│           └── slm/route.ts          # SLM intent classification
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

2. Run the development server:
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to see the chat UI.

## API Endpoints

## Ollama Setup

To run everything locally you need [Ollama](https://ollama.com/).

1. **Install Ollama**
   ```bash
   # macOS (Homebrew)
   brew install ollama
   # or follow https://ollama.com/download for other platforms
   ```
2. **Download required models**
   ```bash
   ollama pull nomic-embed-text
   ollama pull phi3:instruct
   ```
3. **Start the Ollama server**
   ```bash
   ollama serve
   ```

## API Endpoints

### POST `/api/intent/embedding`
Classifies intent using vector embedding similarity (nomic-embed-text via Ollama with deterministic fallback).

**Request:**
```json
{
  "message": "I have a billing question"
}
```

**Response (example):**
```json
{
  "intent": {
    "intent": "billing",
    "score": 0.85,
    "text": "billing invoice charge payment subscription cost price"
  },
  "candidates": [
    { "intent": "billing", "score": 0.85, "text": "..." },
    { "intent": "support", "score": 0.54, "text": "..." }
  ],
  "durationMs": 42
}
```

### POST `/api/intent/slm`
Classifies intent through SLMService (Ollama `phi3:instruct` by default with keyword fallback).

**Request:**
```json
{
  "message": "My app is crashing with errors"
}
```

**Response (example):**
```json
{
  "classification": {
    "intent": "problem_solving_search",
    "confidence": 0.81,
    "params": {
      "problem_description": "My app is crashing with errors"
    },
    "durationMs": 612
  }
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
- Uses Ollama (`phi3:instruct`) for intent classification
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

## Environment Variables

- `OLLAMA_URL` — URL for the Ollama server (default `http://127.0.0.1:11434`)
- `OLLAMA_SLM_MODEL` — Model used for SLM classification (default `phi3:instruct`)
- `OLLAMA_EMBED_MODEL` — Model used for embeddings (default `nomic-embed-text`)
- `OLLAMA_MAX_CONCURRENCY` — Max concurrent SLM requests (default `3`)
- `OPENAI_API_KEY` — Optional; enables OpenAI-based fallbacks if you reconfigure services

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

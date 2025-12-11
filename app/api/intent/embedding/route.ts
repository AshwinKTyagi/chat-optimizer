import { NextResponse } from 'next/server';
import { vectorEmbeddingService } from '../../../../services/VectorEmbeddingService';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { message } = body || {};
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload: { message: string } expected' }, { status: 400 });
    }

    const { matches, durationMs } = await vectorEmbeddingService.findNearestIntent(message, 3);

    return NextResponse.json({
      intent: matches[0] ?? null,
      candidates: matches,
      durationMs
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Embedding route error:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

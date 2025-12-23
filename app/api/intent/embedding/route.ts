import { NextResponse } from 'next/server';
import { vectorEmbeddingService } from '../../../../services/VectorEmbeddingService';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { message } = body || {};
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload: { message: string } expected' }, { status: 400 });
    }
    const { scores, durationMs, averageTopKScore } = await vectorEmbeddingService.findNearestIntent(message, 3);

    return NextResponse.json({
      intent: scores[0] ?? null,
      scores,
      durationMs,
      averageTopKScore
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Embedding route error:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

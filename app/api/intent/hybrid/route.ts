import { NextResponse } from 'next/server';
import { vectorEmbeddingService } from '../../../../services/VectorEmbeddingService';
import { slmService } from '../../../../services/SLMService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body || {};
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload: { message: string } expected' }, { status: 400 });
    }

    const matches = await vectorEmbeddingService.findNearestIntent(message, 3);
    
    // Build context from top embedding matches
    const context = matches.map((m) => `${m.intent}: ${m.text}`).join('\n');

    const slmResult = await slmService.classifyIntent(message, context);

    return NextResponse.json({ vectorMatches: matches, slm: slmResult });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 500 });
  }
}

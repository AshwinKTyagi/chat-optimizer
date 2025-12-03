import { NextResponse } from 'next/server';
import { slmService } from '../../../../services/SLMService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body || {};
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid payload: { message: string } expected' }, { status: 400 });
    }

    const result = await slmService.classifyIntent(message);
    return NextResponse.json({ classification: result });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 500 });
  }
}

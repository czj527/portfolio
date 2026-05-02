import { NextRequest, NextResponse } from 'next/server';
import { streamAI } from '@/lib/ai/client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { content, style = 'balanced' } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const styleMap: Record<string, string> = {
      concise: '简洁精炼',
      detailed: '详尽深入',
      academic: '学术严谨',
      casual: '轻松随性',
      balanced: '平衡适中'
    };

    const systemPrompt = `你是一个专业的文字编辑，擅长提升文章的可读性和感染力。

润色要求：
1. 优化句式，消除冗余表达
2. 改善段落过渡，增强连贯性
3. 适当添加过渡句
4. 保持作者的个人风格和观点
5. 确保技术术语使用准确
6. 不要添加新的实质性内容`;

    const userPrompt = `请对以下文章进行润色，风格：${styleMap[style] || '平衡'}

文章内容：
${content}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamAI(
            messages,
            (chunk) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`));
            },
            () => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`));
            },
            (error) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`));
            }
          );
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

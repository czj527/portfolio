import { NextRequest, NextResponse } from 'next/server';
import { streamAI } from '@/lib/ai/client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { idea, chatHistory = [] } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'idea is required' }, { status: 400 });
    }

    const systemPrompt = `你是一个专业的写作教练，擅长将模糊的想法转化为清晰的写作方向。

用户的想法可能比较模糊或零散。你的任务是：
1. 理解用户的核心意图
2. 将其拆解成3~5个核心论点
3. 帮助用户明确写作方向

请以友好、专业的方式与用户对话，引导他们明确写作方向。
最终请以JSON格式输出核心论点，格式如下：
{
  "core_points": ["论点1", "论点2", "论点3"],
  "summary": "对这个想法的理解"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: idea }
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
            (response) => {
              // 尝试解析JSON
              try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[0]);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: parsed })}\n\n`));
                }
              } catch (e) {
                // 如果无法解析JSON，返回原始文本
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: { core_points: [], summary: response } })}\n\n`));
              }
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

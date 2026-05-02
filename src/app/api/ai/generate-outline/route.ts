import { NextRequest, NextResponse } from 'next/server';
import { streamAI } from '@/lib/ai/client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { corePoints, title } = await request.json();

    if (!corePoints || !Array.isArray(corePoints) || corePoints.length === 0) {
      return NextResponse.json({ error: 'corePoints is required and must be an array' }, { status: 400 });
    }

    let systemPrompt = `你是一个专业的博客写作专家，擅长构建清晰、有逻辑的文章结构。

请根据核心论点，生成一篇完整的博客文章大纲。
要求：
1. 大纲应包含引言、3~5个主要章节、结论
2. 每个章节需要有清晰的标题和描述
3. 章节之间要有逻辑递进关系
4. 结构要适合博客文章格式`;

    if (title) {
      systemPrompt += `\n参考标题：${title}`;
    }

    const userPrompt = `核心论点：\n${corePoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

请生成文章大纲，输出JSON格式：
{
  "title": "文章标题",
  "outline": [
    {
      "id": "1",
      "title": "章节标题",
      "description": "本章核心内容",
      "children": []
    }
  ]
}`;

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
            (response) => {
              try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[0]);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: parsed })}\n\n`));
                }
              } catch (e) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: { title: '', outline: [] } })}\n\n`));
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

import { NextRequest, NextResponse } from 'next/server';
import { streamAI } from '@/lib/ai/client';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { sectionTitle, sectionDescription, previousContent, nextSection, markdown } = await request.json();

    if (!sectionTitle) {
      return NextResponse.json({ error: 'sectionTitle is required' }, { status: 400 });
    }

    let userContent = `请生成以下章节的详细内容：

章节标题：${sectionTitle}`;

    if (sectionDescription) {
      userContent += `\n章节要点：${sectionDescription}`;
    }

    if (previousContent) {
      userContent += `\n\n前文内容摘要：${previousContent.slice(0, 300)}...`;
    }

    if (nextSection) {
      userContent += `\n\n下一章节预告：${nextSection}`;
    }

    if (markdown) {
      userContent += `\n\n当前已有内容（请续写）：\n${markdown}`;
    }

    const systemPrompt = `你是一个专业的博客作者，擅长撰写深入浅出、有价值的博客文章。

要求：
1. 内容要充实、具体，避免空话套话
2. 可以使用具体案例、数据、故事来支撑观点
3. 段落之间要有自然的过渡
4. 使用Markdown格式
5. 保持与前文和后文的衔接`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
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

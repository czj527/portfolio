import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type AssistType = 
  | 'polish' | 'expand' | 'shrink' | 'rewrite' | 'translate' | 'correct'
  | 'continue' | 'outline' | 'titles' | 'tags' | 'references'
  | 'analyze-structure' | 'logic-optimize' | 'core-idea';

type ArticleType = 'tech-tutorial' | 'tech-blog' | 'essay' | 'review' | 'industry';

const ARTICLE_STYLES: Record<ArticleType, string> = {
  'tech-tutorial': '技术教程，注重步骤清晰、代码规范、实操性强',
  'tech-blog': '技术博客，注重观点论证、行业背景、深度分析',
  'essay': '个人随笔，注重情感表达、故事性、个人思考',
  'review': '产品测评，注重客观对比、优缺点分析、使用体验',
  'industry': '行业观察，注重趋势分析、数据支撑、前瞻性思考',
};

function getPrompt(type: AssistType, content: string, context: string, articleType: ArticleType): string {
  const style = ARTICLE_STYLES[articleType] || ARTICLE_STYLES['tech-blog'];
  
  const prompts: Record<AssistType, string> = {
    'polish': `你是一个专业的中文写作编辑。请对以下文本进行润色优化，使其更加流畅自然、表达精准。保持原意不变，风格为${style}。只输出润色后的文本，不要解释。\n\n文本：${content}`,
    
    'expand': `你是一个专业的中文写作助手。请在保持原意的基础上扩写以下文本，增加细节、例子或论证，使内容更丰富。风格为${style}。只输出扩写后的文本。\n\n文本：${content}`,
    
    'shrink': `你是一个专业的中文写作助手。请精简以下文本，删除冗余内容，保留核心观点，使表达更简洁有力。只输出精简后的文本。\n\n文本：${content}`,
    
    'rewrite': `你是一个专业的中文写作助手。请用不同的表达方式重写以下文本，改变叙述角度或风格，但保持核心含义不变。风格为${style}。只输出重写后的文本。\n\n文本：${content}`,
    
    'translate': `你是一个专业的翻译助手。如果文本是中文，翻译成英文；如果是英文，翻译成中文。保持专业术语的准确性。只输出翻译结果。\n\n文本：${content}`,
    
    'correct': `你是一个专业的中文校对编辑。请检查以下文本中的语法错误、错别字、标点符号问题，并给出修正后的完整文本。只输出修正后的文本。\n\n文本：${content}`,
    
    'continue': `你是一个专业的中文写作助手。根据以下已有内容，续写下一段。保持风格和语气一致，自然衔接。风格为${style}。只输出续写的内容。\n\n已有内容：${context}\n\n续写：`,
    
    'outline': `你是一个专业的中文写作助手。根据以下内容，生成一个清晰的文章大纲。风格为${style}。用Markdown格式输出，使用 ## 和 ### 表示层级。\n\n内容概要：${content || context}`,
    
    'titles': `你是一个专业的标题策划。请为以下文章内容生成5个有吸引力的标题选项，风格为${style}。每个标题一行，编号列出。\n\n文章内容：${context.slice(0, 500)}`,
    
    'tags': `你是一个专业的内容标签生成器。请根据以下文章内容，生成5-8个相关标签。每个标签一行。标签应简洁、常见、有搜索价值。\n\n文章内容：${context.slice(0, 500)}`,
    
    'references': `你是一个专业的研究助手。根据以下文章主题，推荐相关的参考资料方向。包括：1)应该查找哪些类型的资料 2)可能相关的知名文章/书籍方向 3)可以参考的权威网站或数据源。用列表格式输出。\n\n文章主题：${content || context.slice(0, 300)}`,
    
    'analyze-structure': `你是一个专业的文章结构分析师。请分析以下文章的结构，指出：1)整体结构是否合理 2)段落之间的逻辑关系 3)哪些部分需要加强或调整 4)具体的优化建议。用清晰的列表格式输出。\n\n文章内容：${context}`,
    
    'logic-optimize': `你是一个专业的逻辑优化师。请分析以下文章的逻辑链条，找出逻辑漏洞、论证薄弱的地方，并给出具体的优化建议。用列表格式输出。\n\n文章内容：${context}`,
    
    'core-idea': `你是一个专业的内容分析师。请从以下文章中提炼出核心思想和主旨，用1-3句话概括。然后再列出3-5个支撑性论点。\n\n文章内容：${context}`,
  };

  return prompts[type] || prompts['polish'];
}

export async function POST(request: NextRequest) {
  try {
    const { type, content, context, articleType } = await request.json() as {
      type: AssistType;
      content?: string;
      context?: string;
      articleType?: ArticleType;
    };

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    const textContent = content || '';
    const fullContext = context || '';
    const artType = articleType || 'tech-blog';

    const API_KEY = process.env.SILICONFLOW_API_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';

    if (!API_KEY) {
      return NextResponse.json({ error: 'SILICONFLOW_API_KEY not configured' }, { status: 500 });
    }

    const prompt = getPrompt(type, textContent, fullContext, artType);

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V4-Flash',
        messages: [
          { role: 'system', content: '你是一个专业的中文写作辅助AI。请直接输出结果，不要添加多余的解释或前缀。' },
          { role: 'user', content: prompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `AI API failed: ${response.status}` }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`));
                  }
                } catch (e) {
                  // ignore parse errors
                }
              }
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: (error as Error).message })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

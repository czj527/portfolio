import { AIStreamResponse } from './types';

const API_KEY = process.env.SILICONFLOW_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';

interface StreamCallback {
  (chunk: string): void;
}

interface CompleteCallback {
  (response: string): void;
}

interface ErrorCallback {
  (error: Error): void;
}

// 调用AI并支持流式输出
export async function streamAI(
  messages: Array<{ role: string; content: string }>,
  onChunk?: StreamCallback,
  onComplete?: CompleteCallback,
  onError?: ErrorCallback,
  model: string = 'deepseek-ai/DeepSeek-V4-Flash'
) {
  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

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
              fullContent += content;
              onChunk?.(content);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    onComplete?.(fullContent);
    return fullContent;
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
}

// 非流式调用
export async function callAI(
  messages: Array<{ role: string; content: string }>,
  model: string = 'deepseek-ai/DeepSeek-V4-Flash'
): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('AI call failed:', error);
    throw error;
  }
}

// 生成标题的辅助函数
export async function generateTitle(content: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: '你是一个专业的博客作者。请根据文章内容生成一个简洁、有吸引力的标题（不超过30个字）。只返回标题，不要其他内容。'
    },
    {
      role: 'user',
      content: `请为以下文章生成标题：\n\n${content.slice(0, 500)}`
    }
  ];

  return callAI(messages);
}

// 生成slug的辅助函数
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

// 估算阅读时间
export function estimateReadTime(content: string): string {
  const wordsPerMinute = 300;
  const words = content.replace(/[#*`\[\]]/g, '').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} 分钟`;
}

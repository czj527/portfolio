import { NextRequest, NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const { originalIdea, question, context } = await request.json();

    if (!originalIdea || !question) {
      return NextResponse.json({ error: 'originalIdea and question are required' }, { status: 400 });
    }

    const systemPrompt = `你是一个写作教练，正在与用户讨论他们的写作想法。

请根据用户的问题，结合原始想法，给出有针对性的回答或建议。`;

    let userContent = `原始想法：${originalIdea}\n\n`;
    
    if (context) {
      userContent += `上下文：${context}\n\n`;
    }
    
    userContent += `用户的问题：${question}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ];

    const response = await callAI(messages);

    return NextResponse.json({ response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

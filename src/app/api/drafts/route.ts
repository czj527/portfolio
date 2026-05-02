import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 获取所有草稿列表
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('drafts')
      .select('*')
      .eq('owner_id', 'czj527')
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ drafts: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 创建新草稿
export async function POST(request: NextRequest) {
  try {
    const { title, content, outline, current_phase, chat_history } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('drafts')
      .insert({
        owner_id: 'czj527',
        title: title || null,
        content: content || '',
        outline: outline || [],
        current_phase: current_phase || 'capture',
        chat_history: chat_history || []
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ draft: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

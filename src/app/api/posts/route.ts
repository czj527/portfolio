import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateTitle, generateSlug } from '@/lib/ai/client';

// 获取所有已发布文章
export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    const { title, markdown, content, excerpt, tags, draft_id } = await request.json();
    const supabaseAdmin = getSupabaseAdmin();

    if (!markdown && !content) {
      return NextResponse.json({ error: 'markdown or content is required' }, { status: 400 });
    }

    // 生成标题和slug
    let finalTitle = title;
    if (!finalTitle && markdown) {
      try {
        finalTitle = await generateTitle(markdown);
      } catch (e) {
        finalTitle = 'Untitled';
      }
    }

    const slug = generateSlug(finalTitle || 'untitled');

    // 检查slug是否已存在
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug')
      .eq('slug', slug)
      .single();

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        slug: finalSlug,
        title: finalTitle,
        markdown: markdown || null,
        content: content || null,
        excerpt: excerpt || markdown?.slice(0, 200) || null,
        tags: tags || [],
        is_published: true
      })
      .select()
      .single();

    if (error) throw error;

    // 如果有draft_id，标记草稿已发布
    if (draft_id) {
      await supabaseAdmin
        .from('drafts')
        .update({ published_at: new Date().toISOString() })
        .eq('id', draft_id);
    }

    return NextResponse.json({ post: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

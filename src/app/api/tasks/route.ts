import { getSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// PATCH /api/tasks — 更新任务状态
export async function PATCH(request: Request) {
  const supabase = getSupabaseAdmin()
  const body = await request.json()
  const { id, status, title, description, priority, due_date } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 })
  }

  const updateFields: Record<string, any> = { updated_at: new Date().toISOString() }
  if (status) updateFields.status = status
  if (title) updateFields.title = title
  if (description !== undefined) updateFields.description = description
  if (priority) updateFields.priority = priority
  if (due_date) updateFields.due_date = due_date

  const { data, error } = await supabase
    .from('tasks')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ task: data })
}

// POST /api/tasks — 创建新任务
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin()
  const body = await request.json()
  const { title, description, priority, due_date, project_id } = body

  if (!title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description: description || null,
      priority: priority || 3,
      status: 'todo',
      due_date: due_date || null,
      project_id: project_id || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ task: data }, { status: 201 })
}

// DELETE /api/tasks — 删除任务
export async function DELETE(request: Request) {
  const supabase = getSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 })
  }

  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

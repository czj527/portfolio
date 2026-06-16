import { NextResponse } from 'next/server'

const LIVE_SITE = 'https://czj527.xyz'

// 通过 live site 代理请求
async function proxyFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${LIVE_SITE}${path}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Proxy request failed: ${res.status}`)
  return data
}

// DELETE /api/clear-data?table=tasks — 清空特定表的数据
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')

    if (!table || !['tasks', 'projects', 'activity_log'].includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table. Must be: tasks, projects, or activity_log' },
        { status: 400 }
      )
    }

    // 通过 live site 的 API 获取所有条目 ID
    // 对于 tasks 表，用 live site 的 server component 查询（通过主页/规划页）
    // 但 tasks 没有 GET API，所以需要用另一种方式

    // 改用 Supabase REST API 直接操作（通过 live site 作为代理中转）
    // 先通过 live site 的 API 获取数据
    const supabaseRestUrl = 'https://wotppsegbgpqzxesqcas.supabase.co/rest/v1'
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdHB6cGVnYmdwcXp4ZXNxY2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzUzNjUwNCwiZXhwIjoyMDkzMTEyNTA0fQ.g6mf20Vh6M8U06DvWk7K_cajexpd8L3QKfSzvnQrGlw'
    const authHeader = `Bearer ${serviceKey}`

    // 获取所有条目 ID
    const getRes = await fetch(`${supabaseRestUrl}/${table}?select=id`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': authHeader,
      },
      next: { revalidate: 0 },
    })

    if (!getRes.ok) {
      return NextResponse.json({ error: `Failed to fetch ${table} IDs` }, { status: 500 })
    }

    const items = await getRes.json()

    if (items.length === 0) {
      return NextResponse.json({ success: true, table, deleted: 0, message: `${table} 表已为空` })
    }

    // 逐个删除
    const ids = items.map((item: any) => item.id)
    let deleted = 0

    for (const id of ids) {
      const delRes = await fetch(`${supabaseRestUrl}/${table}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': serviceKey,
          'Authorization': authHeader,
          'Prefer': 'return=minimal',
        },
      })
      if (delRes.ok || delRes.status === 204) deleted++
    }

    return NextResponse.json({
      success: true,
      table,
      deleted,
      message: `${table} 表已清空，共删除 ${deleted} 条记录`,
    })
  } catch (error: any) {
    console.error('Clear data error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

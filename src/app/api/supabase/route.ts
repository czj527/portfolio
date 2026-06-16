import { NextRequest, NextResponse } from 'next/server'

// 通用 Supabase 数据操作接口（通过线上站点代理）
// 支持：select / insert / update / delete / upsert
// 需要部署到 czj527.xyz 后生效

const isDev = process.env.NODE_ENV === 'development'
const LIVE_SITE = 'https://czj527.xyz'

/**
 * 在开发环境下，通过线上站点代理请求
 * 在生产环境下，直接调用 Supabase
 */
async function execute(table: string, action: string, data?: any, filters?: any) {
  if (isDev) {
    // 开发环境：代理到线上站点
    const res = await fetch(`${LIVE_SITE}/api/supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, action, data, filters }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || 'Proxy request failed')
    return result
  }

  // 生产环境：直连 Supabase
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let query: any

  switch (action) {
    case 'select':
      query = supabase.from(table).select(data?.select || '*')
      if (filters?.eq) for (const [k, v] of Object.entries(filters.eq)) query = query.eq(k, v)
      if (filters?.order) query = query.order(filters.order.field, { ascending: filters.order.ascending ?? true })
      if (filters?.limit) query = query.limit(filters.limit)
      break
    case 'insert':
      query = supabase.from(table).insert(data).select()
      break
    case 'update':
      query = supabase.from(table).update(data)
      if (filters?.eq) for (const [k, v] of Object.entries(filters.eq)) query = query.eq(k, v)
      query = query.select()
      break
    case 'delete':
      query = supabase.from(table).delete()
      if (filters?.eq) for (const [k, v] of Object.entries(filters.eq)) query = query.eq(k, v)
      break
    case 'upsert':
      query = supabase.from(table).upsert(data, { onConflict: filters?.onConflict }).select()
      break
    default:
      throw new Error(`Unknown action: ${action}`)
  }

  const { data: result, error } = await query
  if (error) throw new Error(error.message)
  return { data: result }
}

export async function POST(request: NextRequest) {
  try {
    const { table, action, data, filters } = await request.json()

    if (!table || !action) {
      return NextResponse.json({ error: 'Missing table or action' }, { status: 400 })
    }

    const validActions = ['select', 'insert', 'update', 'delete', 'upsert']
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `Invalid action. Must be one of: ${validActions.join(', ')}` }, { status: 400 })
    }

    const result = await execute(table, action, data, filters)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Supabase API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// 扩展 ScheduleItem 类型，包含提醒字段
interface ScheduleItem {
  id?: string;
  owner_id?: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  duration?: number;
  color?: string;
  type?: 'class' | 'work' | 'personal' | 'meeting';
  remind_enabled?: boolean;
  remind_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

// 辅助函数：将数据库字段映射为前端格式
function formatScheduleForClient(schedule: any): ScheduleItem {
  return {
    id: schedule.id,
    title: schedule.title,
    description: schedule.description,
    date: schedule.date,
    startTime: schedule.start_time,
    duration: schedule.duration,
    color: schedule.color,
    type: schedule.type,
    remind_enabled: schedule.remind_enabled,
    remind_minutes: schedule.remind_minutes,
  };
}

// 辅助函数：将前端格式转换为数据库字段
function formatScheduleForDb(schedule: Partial<ScheduleItem>): any {
  const db: any = {
    title: schedule.title,
    date: schedule.date,
    start_time: schedule.startTime || schedule.start_time,
  };
  
  if (schedule.description !== undefined) db.description = schedule.description;
  if (schedule.duration !== undefined) db.duration = schedule.duration;
  if (schedule.color !== undefined) db.color = schedule.color;
  if (schedule.type !== undefined) db.type = schedule.type;
  if (schedule.remind_enabled !== undefined) db.remind_enabled = schedule.remind_enabled;
  if (schedule.remind_minutes !== undefined) db.remind_minutes = schedule.remind_minutes;
  
  return db;
}

// GET /api/schedules - 获取所有日程
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id') || 'czj527';
    const date = searchParams.get('date');

    let query = supabase
      .from('schedules')
      .select('*')
      .eq('owner_id', ownerId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    // 可选：按日期筛选
    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 转换为前端格式
    const formattedData = (data || []).map(formatScheduleForClient);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/schedules - 创建新日程
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const scheduleData = formatScheduleForDb(body);
    scheduleData.owner_id = body.owner_id || 'czj527';

    const { data, error } = await supabase
      .from('schedules')
      .insert(scheduleData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(formatScheduleForClient(data), { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT /api/schedules - 更新日程（支持单个ID或批量更新）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // 支持单个更新和批量更新
    if (body.id) {
      // 单个更新
      const updateData = formatScheduleForDb(body);
      const { data, error } = await supabase
        .from('schedules')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(formatScheduleForClient(data));
    } else if (Array.isArray(body)) {
      // 批量更新 - 返回更新后的结果
      const results = [];
      for (const item of body) {
        if (item.id) {
          const updateData = formatScheduleForDb(item);
          const { data, error } = await supabase
            .from('schedules')
            .update(updateData)
            .eq('id', item.id)
            .select()
            .single();
          
          if (!error && data) {
            results.push(formatScheduleForClient(data));
          }
        }
      }
      return NextResponse.json(results);
    } else {
      return NextResponse.json({ error: 'Missing id for update' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/schedules - 删除日程
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

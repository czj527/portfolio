// 通过线上站点清理 Supabase 数据
// 用法: node scripts/clear-supabase-data.mjs

const LIVE = 'https://czj527.xyz';

// 从页面 RSC 响应中提取数据
async function extractFromRSC(url, key) {
  const res = await fetch(url);
  const html = await res.text();
  
  // 提取所有 self.__next_f.push 内容
  const matches = html.match(/self\.__next_f\.push\(\[1,"([^"]+)"\]/g);
  let combined = '';
  if (matches) {
    for (const m of matches) {
      const content = m.replace(/^self\.__next_f\.push\(\[1,"/, '').replace(/"\]$/, '');
      combined += content.replace(/\\(.)/g, '$1');
    }
  }
  return combined;
}

// 简单提取 JSON 对象中的值
function extractIds(text, fieldName) {
  const regex = new RegExp(`"${fieldName}":"([^"]+)"`, 'g');
  const ids = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }
  return ids;
}

async function deleteById(table, id) {
  const url = `${LIVE}/api/${table}?id=${id}`;
  try {
    const res = await fetch(url, { method: 'DELETE' });
    if (res.ok) {
      console.log(`  ✓ 已删除 ${table} ${id}`);
      return true;
    }
    console.log(`  ✗ 删除失败 ${table} ${id}: ${res.status}`);
    return false;
  } catch (e) {
    console.log(`  ✗ 删除出错 ${table} ${id}: ${e.message}`);
    return false;
  }
}

async function main() {
  const type = process.argv[2] || 'all';
  
  if (type === 'tasks' || type === 'all') {
    console.log('\n📋 清理 tasks...');
    const rsc = await extractFromRSC(`${LIVE}/tasks`, 'tasks');
    const ids = extractIds(rsc, 'id');
    console.log(`  找到 ${ids.length} 个任务`);
    for (const id of ids) {
      await deleteById('tasks', id);
    }
  }
  
  if (type === 'roadmap' || type === 'all') {
    console.log('\n🗺️ 清理 roadmap 数据...');
    const rsc = await extractFromRSC(`${LIVE}/roadmap`, 'roadmap');
    
    // 从 RSC 中提取 project/task ids
    const projectIds = extractIds(rsc, 'id');
    // 注意: RSC 包含 project 和 task 的 id
    // 但我们无法通过 API 删除项目和活动日志
    // 需要先确认 API 是否支持
    console.log(`  找到 ${projectIds.length} 个项目 (仅查看，需数据库直连删除)`);
  }
  
  console.log('\n✅ 完成');
  // 注意: projects 和 activity_log 表没有公开的删除 API
  // 需要通过 Supabase Dashboard 手动清理
  console.log('⚠️  projects 和 activity_log 需要通过 Supabase Dashboard 手动清理');
}

main().catch(console.error);

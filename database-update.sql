-- ============================================
-- 更新留言板数据库表 - 添加表情和点赞功能
-- ============================================

-- 1. 添加表情字段（emoji）
ALTER TABLE guestbook_messages 
ADD COLUMN IF NOT EXISTS emoji VARCHAR(8) DEFAULT '😀';

-- 2. 添加点赞数字段（likes）
ALTER TABLE guestbook_messages 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- 3. 修改 name 和 email 字段为可选（移除 NOT NULL 约束）
ALTER TABLE guestbook_messages 
ALTER COLUMN name DROP NOT NULL;

ALTER TABLE guestbook_messages 
ALTER COLUMN email DROP NOT NULL;

-- 4. 为现有留言设置默认表情（如果有）
UPDATE guestbook_messages 
SET emoji = '😀' 
WHERE emoji IS NULL OR emoji = '';

-- 5. 为现有留言设置默认点赞数（如果有）
UPDATE guestbook_messages 
SET likes = 0 
WHERE likes IS NULL;

-- ============================================
-- 更新安全策略
-- ============================================

-- 6. 删除旧的安全策略
DROP POLICY IF EXISTS "Allow public read access" ON guestbook_messages;
DROP POLICY IF EXISTS "Allow public insert" ON guestbook_messages;
DROP POLICY IF EXISTS "Allow public delete" ON guestbook_messages;

-- 7. 创建新的安全策略（支持新字段）
-- 策略 1：允许所有人读取留言
CREATE POLICY "Allow public read access"
  ON guestbook_messages
  FOR SELECT
  TO public
  USING (true);

-- 策略 2：允许所有人插入新留言
CREATE POLICY "Allow public insert"
  ON guestbook_messages
  FOR INSERT
  WITH CHECK (true);

-- 策略 3：允许所有人更新点赞数
CREATE POLICY "Allow public update likes"
  ON guestbook_messages
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 策略 4：允许所有人删除留言
CREATE POLICY "Allow public delete"
  ON guestbook_messages
  FOR DELETE
  TO public
  USING (true);

-- ============================================
-- 完成提示
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ 数据库表更新成功！';
  RAISE NOTICE '✅ 添加了 emoji 字段（表情）';
  RAISE NOTICE '✅ 添加了 likes 字段（点赞数）';
  RAISE NOTICE '✅ 姓名和邮箱现在是可选的';
  RAISE NOTICE '✅ 安全策略已更新';
  RAISE NOTICE '✅ 留言功能已就绪！';
END $$;

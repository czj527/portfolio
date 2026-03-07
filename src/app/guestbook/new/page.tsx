'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageSquare, User, Mail, Send, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EMOJI_LIST = ['😀', '😎', '🎉', '💪', '🚀', '❤️', '🔥', '✨', '🌟', '💡', '🙌', '😍', '🤔', '👍', '🎵'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function NewMessage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    emoji: EMOJI_LIST[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // 邮箱格式验证
  const isValidEmail = (email: string) => {
    if (!email) return true; // 邮箱可选
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setError('留言内容不能为空');
      return;
    }

    // 验证邮箱格式（如果填写了邮箱）
    if (formData.email && !isValidEmail(formData.email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    // 验证字段长度
    if (formData.name && formData.name.length > 128) {
      setError('姓名太长（最多128个字符）');
      return;
    }

    if (formData.email && formData.email.length > 255) {
      setError('邮箱太长（最多255个字符）');
      return;
    }

    if (formData.content.length > 500) {
      setError('内容太长（最多500个字符）');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('guestbook_messages')
        .insert({
          name: formData.name.trim() || null,
          email: formData.email.trim() || null,
          content: formData.content.trim(),
          emoji: formData.emoji,
        })
        .select()
        .single();

      if (error) throw error;

      // 显示成功提示
      setShowSuccess(true);

      // 延迟后返回留言列表页
      setTimeout(() => {
        router.push('/guestbook');
      }, 2000);
    } catch (err) {
      console.error('Error creating message:', err);
      setError('提交留言失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/guestbook">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              返回留言列表
            </motion.button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">给我留言</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            欢迎在这里留下你的想法和建议！
          </p>
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
          >
            留言提交成功！正在返回留言列表...
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.div variants={itemVariants}>
          <div className="bg-card rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Emoji Selector */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  选择表情
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_LIST.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`w-12 h-12 text-2xl rounded-lg transition-all ${
                        formData.emoji === emoji
                          ? 'bg-primary text-primary-foreground scale-110'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    姓名（可选）
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="请输入你的姓名"
                  maxLength={128}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    邮箱（可选）
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="请输入你的邮箱"
                  maxLength={255}
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="mt-1 text-sm text-red-500">请输入有效的邮箱地址</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    留言内容 <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="请输入你的留言内容..."
                  required
                  maxLength={500}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  {formData.content.length}/500
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    提交留言
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                📝 填写提示：
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 姓名和邮箱都是可选的，可以匿名留言</li>
                <li>• 选择一个表情来表达你的心情</li>
                <li>• 留言内容不能为空，最多 500 字符</li>
                <li>• 留言内容将公开显示，请文明发言</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

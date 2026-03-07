'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, ThumbsUp, Edit, Plus, Calendar, Loader2, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

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

interface Message {
  id: string;
  name: string | null;
  email: string | null;
  content: string;
  emoji: string;
  likes: number;
  created_at: string;
}

export default function Guestbook() {
  // 创建 Supabase 客户端（在组件内部，确保环境变量已加载）
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // 加载留言
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guestbook_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('加载留言失败，请刷新重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 页面加载时获取留言
  useEffect(() => {
    loadMessages();
  }, []);

  // 点赞功能
  const handleLike = async (id: string, currentLikes: number) => {
    setLikingId(id);
    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .update({ likes: currentLikes + 1 })
        .eq('id', id);

      if (error) throw error;

      // 更新本地状态
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, likes: currentLikes + 1 } : msg
      ));
    } catch (err) {
      console.error('Error liking message:', err);
      setError('点赞失败，请稍后重试');
    } finally {
      setLikingId(null);
    }
  };

  // 删除留言（需要编辑模式）
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条留言吗？')) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('guestbook_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 重新加载留言列表
      await loadMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('删除留言失败，请稍后重试');
    } finally {
      setDeletingId(null);
    }
  };

  // 打开管理模态框
  const handleOpenManage = () => {
    setShowManageModal(true);
    setPassword('');
    setPasswordError('');
  };

  // 验证密码
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的密码验证（实际项目中应该使用更安全的方式）
    if (password === 'admin123') {
      setIsEditMode(true);
      setShowManageModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('密码错误，请重试');
    }
  };

  // 退出编辑模式
  const handleExitEditMode = () => {
    setIsEditMode(false);
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 格式化显示名称
  const formatDisplayName = (message: Message) => {
    if (message.name) {
      return message.name;
    }
    return '匿名用户';
  };

  // 检查 Supabase 配置
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">留言板</h1>
          <p className="text-xl text-muted-foreground mb-8">
            留言功能需要配置 Supabase
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
            <p className="mb-4">请在项目根目录创建 <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> 文件并添加以下配置：</p>
            <pre className="bg-yellow-100 p-4 rounded-lg text-sm overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
              NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">留言板</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            欢迎在这里留下你的想法和建议！
          </p>
          
          {/* Action Button */}
          <div className="flex items-center justify-center mt-8">
            <Link href="/guestbook/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                给我留言
              </motion.button>
            </Link>
          </div>

          {/* Edit Mode Indicator */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm"
            >
              <Edit className="w-4 h-4" />
              管理模式已激活
            </motion.div>
          )}
        </motion.div>

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

        {/* Messages List */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">留言列表</h2>
            <span className="text-sm text-muted-foreground">
              {messages.length} 条留言
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">还没有留言，快来抢沙发吧！</p>
              <Link href="/guestbook/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                  发表第一条留言
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">
                        {message.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{formatDisplayName(message)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Like Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(message.id, message.likes)}
                        disabled={likingId === message.id}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                          likingId === message.id
                            ? 'bg-primary/20 text-muted-foreground cursor-wait'
                            : 'bg-primary/10 hover:bg-primary/20'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">{message.likes}</span>
                      </motion.button>

                      {/* Delete Button (Edit Mode Only) */}
                      {isEditMode && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(message.id)}
                          disabled={deletingId === message.id}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                          title="删除留言"
                        >
                          {deletingId === message.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>💡 提示：点击 💜 可以给留言点赞，使用"留言管理"可以删除不当内容</p>
        </motion.div>
      </motion.div>

      {/* Password Modal */}
      {showManageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowManageModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-xl p-8 shadow-sm max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">管理密码验证</h3>
            
            <form onSubmit={handleVerifyPassword} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  请输入管理密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="请输入密码"
                  autoFocus
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowManageModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-all"
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
                >
                  确认
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Fixed Manage Button - Bottom Right */}
      {!isEditMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenManage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/80 backdrop-blur-sm text-muted-foreground hover:bg-muted transition-all text-sm shadow-sm"
            title="留言管理"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">管理</span>
          </motion.button>
        </motion.div>
      )}

      {/* Fixed Exit Edit Mode Button - Bottom Right */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExitEditMode}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/80 backdrop-blur-sm text-destructive-foreground hover:bg-destructive transition-all text-sm shadow-sm"
            title="退出管理"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">退出管理</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

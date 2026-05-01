'use client';

import { motion } from 'framer-motion';
import { Github, Mail, Laptop, BookOpen, Calendar, ListTodo } from 'lucide-react';
import { PortalHeroSection } from '@/components/effects/PortalHeroSection';

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero 区域 - 个人介绍 */}
      <PortalHeroSection />

      {/* 中间主体 - 博客/个人内容区（占位） */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              最新动态
            </h2>
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-muted-foreground mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span>博客智能体接入中...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                稍后将展示最新文章、项目动态等内容
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 底部项目导航 - 紧凑版快速入口 */}
      <section className="py-8 px-4 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">
              快速入口
            </p>
          </motion.div>

          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* 蓝的工作台 */}
            <motion.a
              href="https://work.czj527.xyz"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium hover:border-blue-500/50 transition-all"
            >
              <Laptop className="w-4 h-4 text-blue-400" />
              <span>工作台</span>
            </motion.a>

            {/* 博客 - 暂不可用 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>博客</span>
              <span className="text-xs text-muted-foreground">(开发中)</span>
            </motion.div>

            {/* 日程表 */}
            <motion.a
              href="https://work.czj527.xyz/calendar"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium hover:border-emerald-500/50 transition-all"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>日程</span>
            </motion.a>

            {/* 四季清单 - 暂不可用 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <ListTodo className="w-4 h-4 text-purple-400" />
              <span>四季清单</span>
              <span className="text-xs text-muted-foreground">(开发中)</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 底部社交链接 */}
      <section className="py-8 px-4 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="flex justify-center gap-4">
            <motion.a
              href="https://github.com/czj527"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-accent/30 hover:bg-primary/20 backdrop-blur-sm border border-border/30 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="mailto:2719398856@qq.com"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-accent/30 hover:bg-primary/20 backdrop-blur-sm border border-border/30 transition-all"
              aria-label="邮箱"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          </div>
          <p className="text-xs text-muted-foreground mt-4 opacity-60">
            Made with ❤️ by 陈子杰
          </p>
        </motion.div>
      </section>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Github, Mail, Laptop, BookOpen, Calendar, ListTodo, ArrowRight } from 'lucide-react';
import { PortalHeroSection } from '@/components/effects/PortalHeroSection';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { QnASection } from '@/components/effects';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="pt-14 sm:pt-16">
      {/* Hero 区域 - 个人介绍 */}
      <PortalHeroSection />

      {/* 中间主体 - 博客/个人内容区 */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 日程预览卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                本周日程
              </h2>
              <Link 
                href="/schedule"
                className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                查看完整日程
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-border/50">
              <ScheduleView />
            </div>
          </motion.div>

          {/* 问答模块 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <QnASection />
          </motion.div>

          {/* 最新动态 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              最新动态
            </h2>
            <div className="glass-card p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-muted-foreground mb-3 sm:mb-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs sm:text-sm">博客智能体接入中...</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                稍后将展示最新文章、项目动态等内容
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 底部项目导航 - 紧凑版快速入口 */}
      <section className="py-6 sm:py-8 px-4 border-t border-border/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-3 sm:mb-4"
          >
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">
              快速入口
            </p>
          </motion.div>

          <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
            {/* 工作台 */}
            <motion.a
              href="https://work.czj527.xyz"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card text-xs sm:text-sm font-medium hover:border-blue-500/50 transition-all"
            >
              <Laptop className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span>工作台</span>
            </motion.a>

            {/* 博客 - 暂不可用 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card text-xs sm:text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
              <span>博客</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">(开发中)</span>
            </motion.div>

            {/* 日程表 */}
            <motion.a
              href="https://work.czj527.xyz/calendar"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card text-xs sm:text-sm font-medium hover:border-emerald-500/50 transition-all"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
              <span>日程</span>
            </motion.a>

            {/* 四季清单 - 暂不可用 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card text-xs sm:text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <ListTodo className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span>四季清单</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">(开发中)</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 底部社交链接 */}
      <section className="py-6 sm:py-8 px-4 border-t border-border/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="flex justify-center gap-3 sm:gap-4">
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
          <p className="text-xs text-muted-foreground mt-3 sm:mt-4 opacity-60">
            Made with ❤️ by 陈子杰
          </p>
        </motion.div>
      </section>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';
import { PortalHeroSection } from '@/components/effects/PortalHeroSection';
import { ProjectCards } from '@/components/effects/ProjectCards';

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero 区域 - 个人介绍 */}
      <PortalHeroSection />

      {/* 项目导航区 - 核心中转功能 */}
      <ProjectCards />

      {/* 底部社交链接 */}
      <section className="py-12 px-4 border-t border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="text-muted-foreground mb-4">
            找到我
          </p>
          <div className="flex justify-center gap-4">
            <motion.a
              href="https://github.com/czj527"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-accent/50 hover:bg-primary/20 backdrop-blur-sm border border-border/50 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="mailto:2719398856@qq.com"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-accent/50 hover:bg-primary/20 backdrop-blur-sm border border-border/50 transition-all"
              aria-label="邮箱"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
          <p className="text-xs text-muted-foreground mt-6 opacity-60">
            Made with ❤️ by 陈子杰
          </p>
        </motion.div>
      </section>
    </div>
  );
}

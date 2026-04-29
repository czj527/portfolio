'use client';

import { motion } from 'framer-motion';
import { AboutSection } from '@/components/effects/AboutSection';

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

export default function About() {
  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-block mb-6"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <img
              src="/avatar.jpg"
              alt="个人头像"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-background shadow-2xl"
            />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">关于我</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            全栈开发者 | AI爱好者 | 终身学习者
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">个人简介</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              你好！我是陈子杰，网名「长岛冰茶」，来自武汉工程大学计算机专业的大三学生。
              目前是一名AI辅助前端开发实习生，正在探索技术与创意的无限可能。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              我热爱编程，享受用代码创造产品的过程。除了技术，我也喜欢篮球、音乐和阅读。
              这个博客是我记录学习、分享心得的小天地，希望能与志同道合的朋友一起成长。
            </p>
          </div>
        </motion.div>

        {/* Enhanced About Section with Skills and Timeline */}
        <AboutSection />
      </motion.div>
    </div>
  );
}

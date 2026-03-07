'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Code, PenTool, Briefcase, MessageSquare } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

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

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              欢迎来到我的个人空间
            </span>
          </motion.div>

          {/* 头像 */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50"
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
                src={SITE_CONFIG.getImagePath('/avatar.jpg')}
                alt="个人头像"
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-background shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.6 0.2 200) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'var(--primary)',
            }}
          >
            你好  我是长岛冰茶 

          </motion.h1>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.6 0.2 200) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'var(--primary)',
            }}
          >
            欢迎访问我的个人网站
          </motion.h1>

          {/* <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            热爱技术，专注创造优雅的用户体验
          </motion.p> */}

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            我是一名全栈开发者，热衷于构建现代化的 Web 应用。
            在这里，你可以了解我的项目、阅读我的技术博客，以及更多关于我的信息。以及，我是李忠瑞的爹。
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                查看项目
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent transition-colors"
              >
                了解更多
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 flex justify-center gap-6">
            <motion.a
              href="https://github.com/czj527"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-accent hover:bg-primary/10 transition-colors"
            >
              <Github className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="mailto:2719398856@qq.com"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-accent hover:bg-primary/10 transition-colors"
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-accent/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            我能做什么
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: '全栈开发',
                description: '精通前端与后端技术栈，构建完整的 Web 应用解决方案',
              },
              {
                icon: <PenTool className="w-8 h-8" />,
                title: '技术写作',
                description: '分享技术心得与最佳实践，帮助开发者共同成长',
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: '项目管理',
                description: '具备丰富的项目管理经验，确保项目按时高质量交付',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow card-hover"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            本网站能做什么？
          </h2>
          <div className="text-lg text-muted-foreground mb-8 ml-[25%]">
            <p className="mb-8">
              1、查看我的项目集，了解更多关于我的技术能力和实践经验
            </p>
            <p className="mb-8">
              2、查看我的博客集，了解我过去和最新的思考内容
            </p>
            <p className="mb-8">
              3、联系我，或者在本网站进行留言
            </p>
          </div>
          <div className="text-center">
            {/* <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                浏览所有项目
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </motion.button>
            </Link> */}
          </div>
        </motion.div>
      </section>

      {/* Navigation Section */}
      <section className="py-20 px-4 bg-accent/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            探索更多
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 博客按钮 */}
            <Link href="/blog">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-8 bg-background rounded-xl shadow-sm hover:shadow-md transition-all card-hover cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                >
                  <PenTool className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">浏览我的所有博客</h3>
                <p className="text-muted-foreground text-sm">
                  阅读我的技术文章和思考分享
                </p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  查看博客
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>

            {/* 留言按钮 */}
            <Link href="/guestbook">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-8 bg-background rounded-xl shadow-sm hover:shadow-md transition-all card-hover cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                >
                  <MessageSquare className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">给我留言</h3>
                <p className="text-muted-foreground text-sm">
                  在留言板留下你的想法和建议
                </p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  前往留言板
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>

            {/* 联系按钮 */}
            <Link href="/about">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-8 bg-background rounded-xl shadow-sm hover:shadow-md transition-all card-hover cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                >
                  <Mail className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">联系我</h3>
                <p className="text-muted-foreground text-sm">
                  通过邮件或社交媒体与我联系
                </p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  查看联系方式
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

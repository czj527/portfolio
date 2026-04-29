'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Github, Mail, Sparkles, Code, PenTool, Briefcase, MessageSquare, Folder } from 'lucide-react';
import { HeroSection } from '@/components/effects/HeroSection';
import { BlogCard } from '@/components/effects/BlogCard';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { QnASection } from '@/components/effects/QnASection';

interface HomeProject {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubUrl: string | null;
}

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
  const [HomeProjects, setHomeProjects] = useState<HomeProject[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setHomeProjects(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section with new effects */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/10 to-background">
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
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-border/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary"
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

      {/* GitHub Projects Preview */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">精选项目</h2>
              <p className="text-muted-foreground">这些项目展示了我的技术能力和实践经验</p>
            </div>
            <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HomeProjects.length > 0 ? (
              HomeProjects.slice(0, 3).map((project: HomeProject, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Folder className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.split(',').slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs rounded-md bg-accent/50 text-muted-foreground font-mono backdrop-blur-sm">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <a href={project.githubUrl || undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无项目展示</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/10 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              日程预览
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">我的日程</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              记录学习和生活的点滴，让每一天都充实而有意义
            </p>
          </div>
          
          <ScheduleView />
        </motion.div>
      </section>

      {/* Navigation Section */}
      <section className="py-20 px-4">
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
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-500"
                >
                  <PenTool className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">浏览我的所有博客</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  阅读我的技术文章和思考分享
                </p>
                <div className="flex items-center text-blue-500 font-medium">
                  查看博客
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>

            {/* 留言按钮 */}
            <Link href="/guestbook">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-500"
                >
                  <MessageSquare className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">给我留言</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  在留言板留下你的想法和建议
                </p>
                <div className="flex items-center text-purple-500 font-medium">
                  前往留言板
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>

            {/* 联系按钮 */}
            <Link href="/about">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-orange-500"
                >
                  <Mail className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">联系我</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  通过邮件或社交媒体与我联系
                </p>
                <div className="flex items-center text-orange-500 font-medium">
                  查看联系方式
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Q&A Section */}
      <QnASection />
    </div>
  );
}

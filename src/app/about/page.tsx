'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Heart } from 'lucide-react';
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

// const skills = [
//   { name: 'React', level: 95 },
//   { name: 'TypeScript', level: 90 },
//   { name: 'Node.js', level: 85 },
//   { name: 'Next.js', level: 88 },
//   { name: 'Python', level: 80 },
//   { name: 'PostgreSQL', level: 75 },
// ];

// const experiences = [
//   {
//     year: '2022 - 至今',
//     title: '高级全栈工程师',
//     company: '某科技公司',
//     description: '负责公司核心产品的开发和技术架构设计，带领团队完成多个重要项目。',
//   },
//   {
//     year: '2020 - 2022',
//     title: '前端工程师',
//     company: '某互联网公司',
//     description: '参与多个 Web 应用项目的前端开发，优化用户体验和页面性能。',
//   },
//   {
//     year: '2018 - 2020',
//     title: '初级工程师',
//     company: '某初创公司',
//     description: '负责产品功能的开发和维护，快速学习新技术并应用到项目中。',
//   },
// ];

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
              src="/avatar.jpg"
              alt="个人头像"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-background shadow-2xl"
            />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">关于我</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            全栈开发者 | 技术爱好者 | 终身学习者
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="bg-card rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">个人简介</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">拥抱未来
            </p>

          </div>
        </motion.div>
{/* 
        {/* Skills Section */}
        {/* <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold mb-6">技术栈</h2>
          <div className="bg-card rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div> */} 

        {/* Experience Section */}
        {/* <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold mb-6">工作经历</h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-xl p-6 shadow-sm card-hover"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 md:mt-0">
                    <Briefcase className="w-4 h-4" />
                    <span>{exp.year}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Education Section */}
        {/* <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold mb-6">教育背景</h2>
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold">计算机科学与技术</h3>
                <p className="text-muted-foreground">某知名大学</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 md:mt-0">
                <GraduationCap className="w-4 h-4" />
                <span>2014 - 2018</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              本科毕业，主修计算机科学，系统学习了数据结构、算法、计算机网络、操作系统等核心课程。
            </p>
          </div>
        </motion.div> */}

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold mb-6">联系方式</h2>
          <div className="bg-card rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-1 gap-6">
              <a
                href="mailto:2719398856@qq.com"
                className="flex items-center gap-4 hover:bg-accent/50 p-3 rounded-lg transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">QQ邮箱</p>
                  <p className="font-medium">2719398856@qq.com</p>
                </div>
              </a>

              <a
                href="tencent://message/?uin=2719398856&Site=Portfolio&Menu=yes"
                className="flex items-center gap-4 hover:bg-accent/50 p-3 rounded-lg transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-lg">
                  <img src="/qq-icon.png" alt="QQ" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">QQ</p>
                  <p className="font-medium">2719398856</p>
                </div>
              </a>

              <a
                href="https://github.com/czj527"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:bg-accent/50 p-3 rounded-lg transition-colors"
              >
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GitHub</p>
                  <p className="font-medium">https://github.com/czj527</p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>用</span>
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span>构建代码</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
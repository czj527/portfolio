'use client';

import { useState, useEffect, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Github, Heart, Briefcase, GraduationCap, Code, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== Floating Skill Bubble ====================
interface SkillBubbleProps {
  name: string;
  level: number; // 1-5
  delay: number;
}

const SkillBubble = memo(function SkillBubble({ name, level, delay }: SkillBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const levelColors = {
    1: 'from-gray-400 to-gray-500',
    2: 'from-blue-400 to-blue-500',
    3: 'from-green-400 to-green-500',
    4: 'from-purple-400 to-purple-500',
    5: 'from-amber-400 to-amber-500',
  };

  const size = 60 + level * 10;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: isHovered ? 0 : Math.sin(delay * 2) * 5,
        }}
        transition={{
          y: { duration: 3 + delay, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 0.5 },
        }}
        className={cn(
          'relative flex items-center justify-center rounded-full cursor-pointer',
          'bg-gradient-to-br shadow-lg backdrop-blur-sm border border-white/20',
          levelColors[level as keyof typeof levelColors]
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-white text-xs font-medium text-center px-1">{name}</span>
        
        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            className="absolute inset-0 rounded-full bg-current"
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card rounded text-xs whitespace-nowrap shadow-lg border border-border"
      >
        {name} - {level === 5 ? '精通' : level >= 3 ? '熟练' : '了解'}
      </motion.div>
    </motion.div>
  );
});

// ==================== Timeline Item ====================
interface TimelineItemProps {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  isLast?: boolean;
}

function TimelineItem({ year, title, company, description, icon, delay, isLast }: TimelineItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <div ref={ref} className="relative pl-8 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="absolute left-[18px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent"
        />
      )}
      
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay }}
        className="absolute left-0 top-0 w-9 h-9 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg"
      >
        <span className="text-lg">{icon}</span>
      </motion.div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        className="bg-card/80 backdrop-blur-sm rounded-xl p-5 border border-border hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">{year}</span>
        </div>
        <h4 className="text-lg font-bold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{company}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
}

// ==================== Stats Counter ====================
interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

function StatCounter({ value, suffix = '', label, delay }: StatCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

// ==================== Main About Section ====================
export function AboutSection() {
  const skills = [
    { name: 'React', level: 5 },
    { name: 'Next.js', level: 5 },
    { name: 'TypeScript', level: 4 },
    { name: 'Node.js', level: 4 },
    { name: 'Python', level: 3 },
    { name: 'PostgreSQL', level: 3 },
    { name: 'Docker', level: 3 },
    { name: 'AWS', level: 2 },
    { name: 'GraphQL', level: 3 },
    { name: 'Figma', level: 3 },
  ];
  
  const experiences = [
    {
      year: '2024 - 至今',
      title: 'AI辅助前端开发实习生',
      company: '某科技公司',
      description: '负责使用AI工具辅助前端开发，优化开发流程，提升团队效率。',
      icon: '💼',
    },
    {
      year: '2022 - 2024',
      title: '全栈开发学习',
      company: '武汉工程大学',
      description: '深入学习全栈开发技术，完成多个实战项目，积累项目经验。',
      icon: '🎓',
    },
    {
      year: '2020 - 2022',
      title: '前端开发入门',
      company: '个人学习',
      description: '从HTML、CSS、JavaScript开始，逐步学习React等现代前端框架。',
      icon: '🚀',
    },
  ];
  
  return (
    <div className="space-y-20">
      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatCounter value={20} suffix="+" label="项目经验" delay={0} />
        <StatCounter value={100} suffix="+" label="代码提交" delay={0.1} />
        <StatCounter value={3} label="年学习" delay={0.2} />
        <StatCounter value={50} suffix="+" label="技术文章" delay={0.3} />
      </section>

      {/* Skills Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            技术栈
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">我的技能</h2>
        </motion.div>
        
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-3xl" />
          
          <div className="relative flex flex-wrap justify-center gap-8 p-8">
            {skills.map((skill, index) => (
              <SkillBubble
                key={skill.name}
                name={skill.name}
                level={skill.level}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            经历
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">我的历程</h2>
        </motion.div>
        
        <div className="max-w-2xl mx-auto">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={index}
              {...exp}
              delay={index * 0.2}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            教育
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">教育背景</h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">武汉工程大学</h3>
              <p className="text-muted-foreground">计算机科学与技术专业</p>
            </div>
            <span className="text-sm text-primary font-medium mt-2 md:mt-0">
              2022 - 2026（在读）
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            系统学习数据结构、算法、计算机网络、操作系统等核心课程。
            同时积极参与各类技术社团和项目实践，提升实际开发能力。
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            联系方式
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">联系我</h2>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: <Mail className="w-6 h-6" />, label: '2719398856@qq.com', href: 'mailto:2719398856@qq.com' },
            { icon: <Github className="w-6 h-6" />, label: 'GitHub', href: 'https://github.com/czj527' },
          ].map((contact) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border hover:border-primary/30 transition-all"
            >
              <span className="text-primary">{contact.icon}</span>
              <span className="font-medium">{contact.label}</span>
            </motion.a>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span>用</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </motion.span>
            <span>构建代码</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default AboutSection;

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Github, Briefcase } from 'lucide-react';

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
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="absolute left-[18px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent"
        />
      )}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay }}
        className="absolute left-0 top-0 w-9 h-9 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg"
      >
        <span className="text-lg">{icon}</span>
      </motion.div>
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

// ==================== Main About Section ====================
export function AboutSection() {
  const experiences = [
    {
      year: '2024 - 至今',
      title: 'AI辅助前端开发实习',
      company: '某科技公司',
      description: 'AI工具辅助前端开发，优化开发流程。',
      icon: '💼',
    },
    {
      year: '2023 - 2024',
      title: '全栈开发实践',
      company: '武汉工程大学',
      description: '深入学习全栈技术，完成多个实战项目。',
      icon: '🎓',
    },
    {
      year: '2022 - 2023',
      title: '编程入门',
      company: '个人学习',
      description: '从HTML、CSS、JavaScript开始学习编程。',
      icon: '🚀',
    },
  ];
  
  return (
    <div className="space-y-20">
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

      {/* Contact Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
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
      </section>
    </div>
  );
}

export default AboutSection;

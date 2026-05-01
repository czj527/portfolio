'use client';

import { useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

// 项目数据
const projects = [
  {
    id: 'work',
    emoji: '💙',
    emojiAlt: '工作台',
    title: '蓝的工作台',
    description: '看看蓝在忙什么',
    url: 'https://work.czj527.xyz',
    available: true,
    color: 'from-blue-400/20 to-cyan-400/20',
    hoverColor: 'group-hover:from-blue-400/30 group-hover:to-cyan-400/30',
    borderColor: 'hover:border-blue-400/50',
    accentColor: 'text-blue-500',
    // 卡片倾斜角度（贴纸效果）
    tilt: -2,
    // 浮动延迟（秒）
    floatDelay: 0,
    // 图标动画
    iconAnimation: 'typing',
  },
  {
    id: 'blog',
    emoji: '✍️',
    emojiAlt: '博客',
    title: '博客',
    description: '想法都在这里',
    url: null,
    available: false,
    color: 'from-amber-400/20 to-orange-400/20',
    hoverColor: 'group-hover:from-amber-400/30 group-hover:to-orange-400/30',
    borderColor: 'hover:border-amber-400/50',
    accentColor: 'text-amber-500',
    tilt: 1.5,
    floatDelay: 0.5,
    iconAnimation: 'writing',
  },
  {
    id: 'calendar',
    emoji: '📅',
    emojiAlt: '日程表',
    title: '日程表',
    description: '今天的安排',
    url: 'https://work.czj527.xyz/calendar',
    available: true,
    color: 'from-emerald-400/20 to-teal-400/20',
    hoverColor: 'group-hover:from-emerald-400/30 group-hover:to-teal-400/30',
    borderColor: 'hover:border-emerald-400/50',
    accentColor: 'text-emerald-500',
    tilt: -1,
    floatDelay: 1,
    iconAnimation: 'flipping',
  },
  {
    id: 'app',
    emoji: '🎮',
    emojiAlt: '应用',
    title: '四季清单',
    description: '本地专注工具',
    url: null,
    available: false,
    color: 'from-purple-400/20 to-pink-400/20',
    hoverColor: 'group-hover:from-purple-400/30 group-hover:to-pink-400/30',
    borderColor: 'hover:border-purple-400/50',
    accentColor: 'text-purple-500',
    tilt: 2,
    floatDelay: 1.5,
    iconAnimation: 'bouncing',
  },
];

// 单个卡片的图标动画组件
function AnimatedIcon({ animation }: { animation: string }) {
  if (animation === 'typing') {
    return (
      <motion.div
        className="relative"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.6 }}
      >
        💙
      </motion.div>
    );
  }
  if (animation === 'writing') {
    return (
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        ✍️
      </motion.div>
    );
  }
  if (animation === 'flipping') {
    return (
      <motion.div
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
        style={{ perspective: 100 }}
      >
        📅
      </motion.div>
    );
  }
  if (animation === 'bouncing') {
    return (
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
      >
        🎮
      </motion.div>
    );
  }
  return null;
}

// 单个项目卡片
const ProjectCard = memo(function ProjectCard({ 
  project, 
  index 
}: { 
  project: typeof projects[0]; 
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: 'preserve-3d',
        rotate: project.tilt,
      }}
      initial={{ opacity: 0, y: 40, rotate: project.tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: project.tilt }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        scale: 1.03, 
        rotate: 0,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.97 }}
      className={`
        group relative p-6 rounded-2xl
        bg-gradient-to-br ${project.color} ${project.hoverColor}
        border border-border/50 ${project.borderColor}
        backdrop-blur-sm
        transition-all duration-300
        cursor-pointer
        ${!project.available ? 'opacity-50 cursor-not-allowed' : ''}
        shadow-sm hover:shadow-xl
      `}
    >
      {/* 卡片内容 */}
      <div className="relative z-10">
        {/* 图标 */}
        <motion.div
          className="text-4xl mb-4"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <AnimatedIcon animation={project.iconAnimation} />
        </motion.div>

        {/* 标题 */}
        <h3 className={`text-xl font-bold mb-2 ${project.available ? 'group-hover:text-foreground' : 'text-muted-foreground'}`}>
          {project.title}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-muted-foreground">
          {project.description}
        </p>

        {/* 不可用提示 */}
        {!project.available && (
          <span className="inline-block mt-3 px-2 py-1 text-xs bg-muted rounded-md">
            暂不可用
          </span>
        )}
      </div>

      {/* 装饰元素 - 贴纸效果 */}
      <div 
        className="absolute top-2 right-2 w-3 h-3 rounded-full opacity-50"
        style={{ background: project.accentColor.includes('blue') ? '#60a5fa' : 
                         project.accentColor.includes('amber') ? '#fbbf24' :
                         project.accentColor.includes('emerald') ? '#34d399' : '#c084fc' }}
      />
    </motion.div>
  );

  if (!project.available || !project.url) {
    return cardContent;
  }

  return (
    <Link href={project.url} target="_blank" rel="noopener noreferrer" className="block">
      {cardContent}
    </Link>
  );
});

// 浮动动画的包装器
function FloatingWrapper({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// 主组件
export function ProjectCards() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            🚪 这里是入口
          </h2>
          <p className="text-muted-foreground">
            想去哪儿？点一点就能到
          </p>
        </motion.div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <FloatingWrapper key={project.id} delay={project.floatDelay}>
              <ProjectCard project={project} index={index} />
            </FloatingWrapper>
          ))}
        </div>

        {/* 底部提示 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          💡 小提示：鼠标移到卡片上会有惊喜哦
        </motion.p>
      </div>
    </section>
  );
}

export default ProjectCards;

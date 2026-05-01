'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Github, Mail, Globe, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';

// ==================== 3D Tilt Card (复用并简化) ====================
const TiltCard = memo(function TiltCard() {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const isDark = currentTheme === 'dark' || currentTheme === 'winter';
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative"
    >
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ transform: 'translateZ(50px)' }}
      >
        {isDark && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        <img
          src="/avatar.jpg"
          alt="个人头像"
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-background shadow-2xl"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        />
      </motion.div>
    </motion.div>
  );
});

// ==================== Star Background ====================
function StarBackground() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-aurora" />
    </div>
  );
}

// ==================== Portal Hero Section ====================
export function PortalHeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 relative overflow-hidden pt-24">
      <StarBackground />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        {/* 头像 */}
        <motion.div variants={itemVariants} className="mb-6">
          <TiltCard />
        </motion.div>

        {/* 名字 */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          <span className="text-foreground">你好，我是</span>
          <motion.span
            className="inline-block ml-2 gradient-text"
            animate={{
              rotate: [0, -2, 2, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            陈子杰
          </motion.span>
        </motion.h1>

        {/* 一句话介绍 */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-6"
        >
          全栈开发者 · 喜欢折腾有趣的东西
        </motion.p>

        {/* 社交链接 */}
        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          {[
            { icon: Github, href: 'https://github.com/czj527', label: 'GitHub' },
            { icon: Mail, href: 'mailto:2719398856@qq.com', label: '邮箱' },
            { icon: Globe, href: '/about', label: '关于' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-accent/50 hover:bg-primary/20 backdrop-blur-sm border border-border/50 transition-all"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default PortalHeroSection;

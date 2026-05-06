'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Github, Mail, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { useAppStore } from '@/store';

// ==================== Typewriter Effect ====================
const phrases = [
  '热爱技术，专注创造优雅的用户体验',
  '全栈开发者 | AI爱好者 | 终身学习',
  '用代码改变世界，用创意点亮生活',
];

function TypewriterText() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < phrase.length) {
            setCurrentText(phrase.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(phrase.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex]);

  return (
    <span className="text-lg md:text-2xl text-muted-foreground min-h-[2rem]">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ==================== 3D Tilt Avatar ====================
const TiltCard = memo(function TiltCard() {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const isDark = currentTheme === 'dark';
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
          className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-background shadow-2xl"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        />
      </motion.div>
    </motion.div>
  );
});

// ==================== Live Status Component ====================
interface ScheduleData {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  duration: number;
  color: string;
  type: 'class' | 'work' | 'personal';
}

// 随机心情文案池
const moodTexts: Record<string, string[]> = {
  working: [
    '搬砖中，但代码写得还算开心 💻',
    '打工人的日常，键盘敲到飞起 🔥',
    '在工位上认真摸鱼…啊不，认真工作',
    '需求又改了，但我已经习惯了 🙂',
  ],
  eating: [
    '干饭时间到！今天的饭还行 🍚',
    '吃饭不积极，思想有问题 🥢',
    '短暂逃离工位，觅食中',
  ],
  exercising: [
    '健身房报到，今天也要变强 💪',
    '举铁使我快乐（其实很累）',
    '和哑铃约会中 🏋️',
  ],
  studying: [
    'Python 学习中，万物皆可 import 🐍',
    '学到头秃，但很充实',
    '深夜修仙，代码为伴 🧙',
  ],
  free: [
    '摸鱼时间，快乐加倍 🐟',
    '自由人，在线冲浪',
    '没有日程的快乐你不懂 😎',
  ],
  sleeping: [
    '已关机，明天再战 😴',
    '梦里在写代码…',
    '充电中，请勿打扰 🔋',
  ],
  morning: [
    '早起的人有代码写 🌅',
    '新的一天，bug 退散',
    '早安打工人 ☀️',
  ],
};

function getRandomMood(key: string): string {
  const pool = moodTexts[key] || moodTexts.free;
  return pool[Math.floor(Math.random() * pool.length)];
}

function LiveStatus() {
  const [status, setStatus] = useState<{
    main: string;
    emoji: string;
    mood: string;
    subtext?: string;
  } | null>(null);

  useEffect(() => {
    let moodKey = 'free';

    async function fetchStatus() {
      try {
        const res = await fetch('/api/schedules?owner_id=czj527');
        if (!res.ok) return;
        const schedules: ScheduleData[] = await res.json();

        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const todaySchedules = schedules
          .filter(s => s.date === todayStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        for (const s of todaySchedules) {
          const [h, m] = s.startTime.split(':').map(Number);
          const startMin = h * 60 + m;
          const endMin = startMin + s.duration;
          if (currentMinutes >= startMin && currentMinutes < endMin) {
            const emojiMap: Record<string, string> = { class: '📚', work: '💼', personal: '🎯' };
            const endTime = `${String(Math.floor(endMin / 60) % 24).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
            // Determine mood key from schedule title/type
            if (s.title.includes('实习') || s.type === 'work') moodKey = 'working';
            else if (s.title.includes('饭') || s.title.includes('晚餐')) moodKey = 'eating';
            else if (s.title.includes('健身')) moodKey = 'exercising';
            else if (s.title.includes('学习') || s.title.includes('Python')) moodKey = 'studying';
            else moodKey = 'working';

            setStatus({
              main: s.title,
              emoji: emojiMap[s.type] || '✨',
              mood: getRandomMood(moodKey),
              subtext: `${s.startTime} - ${endTime}`,
            });
            return;
          }
        }

        // Next schedule within 30 min
        for (const s of todaySchedules) {
          const [h, m] = s.startTime.split(':').map(Number);
          const startMin = h * 60 + m;
          if (startMin > currentMinutes && startMin - currentMinutes <= 30) {
            const emojiMap: Record<string, string> = { class: '📚', work: '💼', personal: '🎯' };
            const minsLeft = startMin - currentMinutes;
            setStatus({
              main: `即将：${s.title}`,
              emoji: emojiMap[s.type] || '⏰',
              mood: `${minsLeft}分钟后开始，准备一下`,
              subtext: `${s.startTime} 开始`,
            });
            return;
          }
        }

        // Default
        const hour = now.getHours();
        if (hour >= 23 || hour < 6) {
          moodKey = 'sleeping';
          setStatus({ main: '休息中', emoji: '😴', mood: getRandomMood(moodKey) });
        } else if (hour < 9) {
          moodKey = 'morning';
          setStatus({ main: '早安', emoji: '🌅', mood: getRandomMood(moodKey) });
        } else {
          moodKey = 'free';
          setStatus({ main: '自由时间', emoji: '🎉', mood: getRandomMood(moodKey) });
        }
      } catch {
        setStatus({ main: '自由时间', emoji: '🎉', mood: getRandomMood('free') });
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-start gap-3 px-5 py-3.5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-lg max-w-sm"
    >
      <span className="text-3xl mt-0.5">{status.emoji}</span>
      <div className="text-left min-w-0">
        <div className="text-sm font-medium">{status.main}</div>
        <div className="text-xs text-muted-foreground/80 mt-0.5">{status.mood}</div>
        {status.subtext && (
          <div className="text-[10px] text-muted-foreground/60 mt-1 font-mono">{status.subtext}</div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== Star Background ====================
function StarBackground() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
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

// ==================== Floating Arrow ====================
function FloatingArrow() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
    >
      <ChevronDown className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
    </motion.div>
  );
}

// ==================== Profile Card (Avatar + Info) ====================
function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center gap-5 px-6 py-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-md max-w-lg"
    >
      <TiltCard />
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold gradient-text inline-block">长岛冰茶</h2>
        <p className="text-sm text-muted-foreground mt-0.5">全栈开发者 · AI 辅助开发</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground/70">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />武汉</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />大三在读</span>
          <span className="flex items-center gap-1"><Github className="w-3 h-3" />czj527</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <LiveStatus />
        </div>
      </div>
    </motion.div>
  );
}

// ==================== Main Hero Section ====================
export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8 relative overflow-hidden">
      <StarBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* 顶部个人资料卡 - 独占一行 */}
        <div className="flex justify-center mb-10">
          <ProfileCard />
        </div>

        {/* 中间主体内容 */}
        <div className="text-center">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="mr-2 inline-block"
              >
                ✨
              </motion.span>
              欢迎来到我的个人空间
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            <motion.span
              className="inline-block gradient-text"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.6 0.2 200) 25%, var(--primary) 50%, oklch(0.6 0.2 280) 75%, var(--primary) 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              你好，我是长岛冰茶
            </motion.span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            <motion.span
              className="inline-block gradient-text"
              animate={{
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                background: 'linear-gradient(135deg, oklch(0.6 0.2 200) 0%, var(--primary) 25%, oklch(0.6 0.2 280) 50%, var(--primary) 75%, oklch(0.6 0.2 200) 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              欢迎访问我的个人网站
            </motion.span>
          </motion.h2>

          <motion.div variants={itemVariants} className="mb-8">
            <TypewriterText />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
              >
                查看项目
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-accent transition-colors"
              >
                了解更多
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center gap-6">
            {[
              { icon: <Github className="w-6 h-6" />, href: 'https://github.com/czj527', label: 'GitHub' },
              { icon: <Mail className="w-6 h-6" />, href: 'mailto:2719398856@qq.com', label: '邮箱' },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-full bg-accent/50 hover:bg-primary/20 backdrop-blur-sm border border-border/50 transition-all"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <FloatingArrow />
    </section>
  );
}

export default HeroSection;

'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Github, Mail, ChevronDown, MapPin, GraduationCap } from 'lucide-react';
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
      className="relative flex-shrink-0"
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
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <img
          src="/avatar.jpg"
          alt="个人头像"
          className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-3 border-background shadow-xl"
          style={{ boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.3)' }}
        />
      </motion.div>
    </motion.div>
  );
});

// ==================== Profile Card (Top-Left) ====================
function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="absolute top-20 left-6 md:left-12 z-20 flex items-center gap-4"
    >
      <TiltCard />
      <div className="min-w-0">
        <h2 className="text-lg md:text-xl font-bold text-primary">长岛冰茶</h2>
        <p className="text-xs md:text-sm text-muted-foreground">全栈开发者 · AI 辅助开发</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] md:text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />武汉</span>
          <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />大三在读</span>
          <a href="https://github.com/czj527" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors"><Github className="w-3 h-3" />czj527</a>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== Live Status (Standalone Component) ====================
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

const statusDetails: Record<string, { moods: string[]; tags: string[] }> = {
  working: {
    moods: [
      '搬砖中，但代码写得还算开心',
      '打工人的日常，键盘敲到飞起',
      '在工位上认真摸鱼…啊不，认真工作',
      '需求又改了，但我已经习惯了',
      '今天的 bug 比昨天少（大概）',
    ],
    tags: ['💻 写代码', '🏢 实习中', '🔥 高效输出'],
  },
  eating: {
    moods: [
      '干饭时间到！今天的饭还行',
      '吃饭不积极，思想有问题',
      '短暂逃离工位，觅食中',
      '食堂阿姨手没抖，感恩',
    ],
    tags: ['🍚 干饭', '🥢 好好吃饭', '😋 好吃'],
  },
  exercising: {
    moods: [
      '健身房报到，今天也要变强',
      '举铁使我快乐（其实很累）',
      '和哑铃约会中',
      '多巴胺正在分泌中',
    ],
    tags: ['💪 健身', '🏋️ 举铁', '🔥 燃烧卡路里'],
  },
  studying: {
    moods: [
      'Python 学习中，万物皆可 import',
      '学到头秃，但很充实',
      '深夜修仙，代码为伴',
      'import this → 人生苦短，我用 Python',
      '从 print("hello") 到 print("为什么")',
    ],
    tags: ['🐍 Python', '📖 学习中', '🧠 充电'],
  },
  free: {
    moods: [
      '摸鱼时间，快乐加倍',
      '自由人，在线冲浪',
      '没有日程的快乐你不懂',
      '此刻的我是最自由的',
    ],
    tags: ['🐟 摸鱼', '🎮 冲浪', '😎 自由'],
  },
  sleeping: {
    moods: [
      '已关机，明天再战',
      '梦里在写代码…',
      '充电中，请勿打扰',
      'zzZ...',
    ],
    tags: ['😴 休息', '🔋 充电', '🌙 晚安'],
  },
  morning: {
    moods: [
      '早起的人有代码写',
      '新的一天，bug 退散',
      '早安打工人',
      '咖啡续命中 ☕',
    ],
    tags: ['🌅 早安', '☀️ 新的一天', '☕ 续命'],
  },
};

function getNow(): { hour: number; minute: number; totalMin: number } {
  const now = new Date();
  return { hour: now.getHours(), minute: now.getMinutes(), totalMin: now.getHours() * 60 + now.getMinutes() };
}

function LiveStatus() {
  const [status, setStatus] = useState<{
    main: string;
    emoji: string;
    mood: string;
    tags: string[];
    subtext?: string;
    progress?: { label: string; percent: number };
  } | null>(null);

  useEffect(() => {
    function pickRandom<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    async function fetchStatus() {
      try {
        const res = await fetch('/api/schedules?owner_id=czj527');
        if (!res.ok) return;
        const schedules: ScheduleData[] = await res.json();
        const { totalMin } = getNow();
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const todaySchedules = schedules
          .filter(s => s.date === todayStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        for (const s of todaySchedules) {
          const [h, m] = s.startTime.split(':').map(Number);
          const startMin = h * 60 + m;
          const endMin = startMin + s.duration;
          if (totalMin >= startMin && totalMin < endMin) {
            const emojiMap: Record<string, string> = { class: '📚', work: '💼', personal: '🎯' };
            const endTime = `${String(Math.floor(endMin / 60) % 24).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
            let key = 'working';
            if (s.title.includes('饭') || s.title.includes('晚餐') || s.title.includes('午饭')) key = 'eating';
            else if (s.title.includes('健身')) key = 'exercising';
            else if (s.title.includes('学习') || s.title.includes('Python')) key = 'studying';
            else if (s.type === 'work') key = 'working';

            const detail = statusDetails[key];
            const percent = Math.round(((totalMin - startMin) / s.duration) * 100);

            setStatus({
              main: s.title,
              emoji: emojiMap[s.type] || '✨',
              mood: pickRandom(detail.moods),
              tags: detail.tags.slice(0, 2),
              subtext: `${s.startTime} - ${endTime}`,
              progress: { label: '进度', percent: Math.min(percent, 100) },
            });
            return;
          }
        }

        // Next schedule
        for (const s of todaySchedules) {
          const [h, m] = s.startTime.split(':').map(Number);
          const startMin = h * 60 + m;
          if (startMin > totalMin && startMin - totalMin <= 60) {
            const emojiMap: Record<string, string> = { class: '📚', work: '💼', personal: '🎯' };
            const minsLeft = startMin - totalMin;
            setStatus({
              main: `即将：${s.title}`,
              emoji: emojiMap[s.type] || '⏰',
              mood: `${minsLeft}分钟后开始，准备一下`,
              tags: ['⏳ 倒计时', '🔜 即将开始'],
              subtext: `${s.startTime} 开始`,
            });
            return;
          }
        }

        // Default
        const { hour } = getNow();
        let key = 'free';
        if (hour >= 23 || hour < 6) key = 'sleeping';
        else if (hour < 9) key = 'morning';
        const detail = statusDetails[key];
        setStatus({
          main: key === 'sleeping' ? '休息中' : key === 'morning' ? '早安' : '自由时间',
          emoji: key === 'sleeping' ? '😴' : key === 'morning' ? '🌅' : '🎉',
          mood: pickRandom(detail.moods),
          tags: detail.tags.slice(0, 2),
        });
      } catch {
        const detail = statusDetails.free;
        setStatus({ main: '自由时间', emoji: '🎉', mood: detail.moods[0], tags: detail.tags.slice(0, 2) });
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-sm w-full"
    >
      <div className="px-5 py-4 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/40 shadow-md">
        {/* 顶部：emoji + 标题 */}
        <div className="flex items-start gap-3">
          <span className="text-3xl">{status.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{status.main}</div>
            <div className="text-xs text-muted-foreground/80 mt-0.5 leading-relaxed">{status.mood}</div>
          </div>
        </div>

        {/* 进度条 */}
        {status.progress && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 mb-1">
              <span>{status.progress.label}</span>
              <span>{status.progress.percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary/70"
                initial={{ width: 0 }}
                animate={{ width: `${status.progress.percent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* 时间 */}
        {status.subtext && (
          <div className="text-[10px] text-muted-foreground/50 mt-2.5 font-mono">{status.subtext}</div>
        )}

        {/* 标签 */}
        {status.tags && status.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {status.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 border border-primary/10">
                {tag}
              </span>
            ))}
          </div>
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
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
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

// ==================== Main Hero Section ====================
export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8 relative overflow-hidden">
      <StarBackground />

      {/* 个人资料 - 左上角 */}
      <ProfileCard />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center relative z-10"
      >
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

        {/* 实时状态 - 独立组件 */}
        <motion.div variants={itemVariants} className="mb-8">
          <LiveStatus />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          <motion.span
            className="inline-block gradient-text"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
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
            animate={{ backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
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
      </motion.div>

      <FloatingArrow />
    </section>
  );
}

export default HeroSection;

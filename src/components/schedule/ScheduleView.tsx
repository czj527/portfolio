'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDate } from '@/store';

// ==================== 常量定义 ====================
const DAY_START_MINUTES = 480;   // 08:00 = 480分钟
const DAY_END_MINUTES = 1380;    // 23:00 = 1380分钟
const DAY_TOTAL_MINUTES = 900;   // 15小时 = 900分钟
const TIMELINE_HEIGHT = 640;     // 像素高度

// 基于精确时间的辅助函数
function getTimeToY(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return ((totalMinutes - DAY_START_MINUTES) / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT;
}

function getDurationHeight(duration: number): number {
  return (duration / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT;
}

// 计算结束时间
function calculateEndTime(startTime: string, duration: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + duration;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
}

// 时间网格线数据
const TIME_GRID = [
  { time: '08:00', y: 0 },
  { time: '09:00', y: (60 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '10:00', y: (120 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '11:00', y: (180 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '12:00', y: (240 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '13:00', y: (300 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '14:00', y: (360 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '15:00', y: (420 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '16:00', y: (480 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '17:00', y: (540 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '18:00', y: (600 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '19:00', y: (660 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '20:00', y: (720 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '21:00', y: (780 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '22:00', y: (840 / DAY_TOTAL_MINUTES) * TIMELINE_HEIGHT },
  { time: '23:00', y: TIMELINE_HEIGHT },
];

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  duration: number;
  color: string;
  type: 'class' | 'work' | 'personal';
}

function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function CurrentTimeIndicator() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const position = getTimeToY(timeString);
  
  if (position < 0 || position > TIMELINE_HEIGHT) return null;
  
  return (
    <div className="absolute left-0 right-0 h-0.5 bg-red-500 z-40 pointer-events-none" style={{ top: `${position}px` }}>
      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
        {timeString}
      </div>
    </div>
  );
}

interface ScheduleCardProps {
  schedule: ScheduleItem;
  isPast: boolean;
}

function ScheduleCard({ schedule, isPast }: ScheduleCardProps) {
  const yPosition = getTimeToY(schedule.startTime);
  const height = getDurationHeight(schedule.duration);
  const endTime = calculateEndTime(schedule.startTime, schedule.duration);
  
  const typeColors = {
    class: 'from-blue-500/90 to-indigo-500/90',
    work: 'from-emerald-500/90 to-teal-500/90',
    personal: 'from-amber-500/90 to-orange-500/90',
  };
  const typeIcons = { class: '📚', work: '💼', personal: '🎯' };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 30 }}
      className={cn(
        'absolute inset-x-1 top-0 rounded-lg px-3 py-2 overflow-hidden cursor-pointer transition-all',
        'backdrop-blur-md border border-white/20',
        isPast && 'opacity-50 grayscale-[20%]'
      )}
      style={{
        top: `${yPosition}px`,
        height: `${height - 4}px`,
        minHeight: '40px',
        background: `linear-gradient(135deg, ${schedule.color}40, ${schedule.color}20)`,
        boxShadow: `0 4px 15px ${schedule.color}30`,
      }}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-80', typeColors[schedule.type])} />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between">
          <span className="text-lg" suppressHydrationWarning>{typeIcons[schedule.type]}</span>
          {!isPast && <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />}
        </div>
        <div className="flex-1 mt-1 overflow-hidden">
          <h4 className="text-sm font-medium text-white truncate">{schedule.title}</h4>
          {schedule.description && <p className="text-xs text-white/70 truncate mt-0.5">{schedule.description}</p>}
          <p className="text-xs text-white/60 mt-1">
            {schedule.startTime} - {endTime}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface DayColumnProps {
  date: Date;
  schedules: ScheduleItem[];
  isToday: boolean;
  isPast: boolean;
}

function DayColumn({ date, schedules, isToday, isPast }: DayColumnProps) {
  const dateString = formatDate(date);
  const daySchedules = schedules.filter(s => s.date === dateString);
  
  return (
    <div className={cn('relative flex-1 min-w-0 border-r border-border/50 last:border-r-0', isToday && 'bg-primary/5')}>
      <div className={cn('sticky top-0 z-20 px-2 py-3 text-center border-b border-border/50 backdrop-blur-sm', isToday && 'bg-primary/10')}>
        <div className={cn('text-sm font-medium', isToday && 'text-primary')}>
          {WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]}
        </div>
        <div className={cn('text-lg font-bold mt-1 w-8 h-8 mx-auto rounded-full flex items-center justify-center', isToday && 'bg-primary text-primary-foreground')}>
          {date.getDate()}
        </div>
      </div>
      <div className="relative h-[640px]">
        {/* 时间网格线 */}
        {TIME_GRID.map((grid, index) => (
          <div key={grid.time} className="absolute left-0 right-0 border-t border-border/30" style={{ top: `${grid.y}px` }}>
            <span className="absolute -top-3 left-1 text-[10px] text-muted-foreground/60">{grid.time}</span>
          </div>
        ))}
        {/* 日程卡片 */}
        {daySchedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} isPast={isPast} />
        ))}
        {isToday && <CurrentTimeIndicator />}
      </div>
    </div>
  );
}

// Mobile Today View
interface MobileTodayViewProps {
  schedules: ScheduleItem[];
  today: Date;
  isPast: boolean;
}

function MobileTodayView({ schedules, today, isPast }: MobileTodayViewProps) {
  const todayString = formatDate(today);
  const todaySchedules = schedules.filter(s => s.date === todayString);
  const sortedSchedules = [...todaySchedules].sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const typeColors = {
    class: 'bg-blue-500/20 border-blue-500/30',
    work: 'bg-emerald-500/20 border-emerald-500/30',
    personal: 'bg-amber-500/20 border-amber-500/30',
  };
  const typeIcons = { class: '📚', work: '💼', personal: '🎯' };
  const weekday = WEEKDAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
  
  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
            {today.getDate()}
          </div>
          <div>
            <div className="text-sm font-medium text-primary">今天 · {weekday}</div>
            <div className="text-xs text-muted-foreground">{today.getMonth() + 1}月{today.getDate()}日</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span>课程</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /><span>工作</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-500" /><span>个人</span></div>
      </div>
      
      {/* Schedule List */}
      <div className="space-y-2">
        {sortedSchedules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">今日暂无日程</div>
        ) : (
          sortedSchedules.map((schedule) => {
            const endTime = calculateEndTime(schedule.startTime, schedule.duration);
            
            return (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm', typeColors[schedule.type], isPast && 'opacity-50')}
              >
                <div className="text-2xl flex-shrink-0">{typeIcons[schedule.type]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{schedule.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="font-mono">{schedule.startTime} - {endTime}</span>
                  </div>
                  {schedule.description && <p className="text-xs text-muted-foreground/70 mt-1">{schedule.description}</p>}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Desktop Week View
function DesktopWeekView({
  weekDates,
  schedules,
  todayString,
  isLoading,
  currentWeekStart,
  setCurrentWeekStart
}: {
  weekDates: Date[];
  schedules: ScheduleItem[];
  todayString: string;
  isLoading: boolean;
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
}) {
  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };
  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };
  const goToToday = () => setCurrentWeekStart(getWeekStart(new Date()));
  const weekLabel = `${currentWeekStart.getMonth() + 1}月${currentWeekStart.getDate()}日 - ${weekDates[6].getMonth() + 1}月${weekDates[6].getDate()}日`;
  
  return (
    <div className="hidden md:block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goToPreviousWeek} className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors">←</motion.button>
          <h3 className="text-lg font-medium min-w-[140px] text-center">{weekLabel}</h3>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={goToNextWeek} className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors">→</motion.button>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goToToday} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">今天</motion.button>
      </div>
      
      <div className="hidden md:flex flex-wrap gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500" /><span>课程</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500" /><span>工作</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500" /><span>个人</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span>当前时间</span></div>
      </div>
      
      <div className="flex border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="w-12 flex-shrink-0 border-r border-border/50">
          <div className="h-[88px] border-b border-border/50" />
          <div className="relative h-[640px]">
            {TIME_GRID.map((grid) => (
              <div key={grid.time} className="absolute left-0 right-0 text-right pr-2" style={{ top: `${grid.y}px` }}>
                <span className="text-[10px] text-muted-foreground/60">{grid.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 overflow-x-auto">
          {isLoading && <div className="flex-1 flex items-center justify-center h-[640px] text-muted-foreground text-sm">加载日程中...</div>}
          {!isLoading && schedules.length === 0 && <div className="flex-1 flex items-center justify-center h-[640px] text-muted-foreground text-sm">暂无日程安排</div>}
          {!isLoading && schedules.length > 0 && weekDates.map((date) => (
            <DayColumn key={date.toISOString()} date={date} schedules={schedules} isToday={formatDate(date) === todayString} isPast={date < new Date(new Date().setHours(0, 0, 0, 0))} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScheduleView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);
  const today = new Date();
  const todayString = formatDate(today);
  const isTodayPast = today < new Date(new Date().setHours(0, 0, 0, 0));
  
  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/schedules?owner_id=czj527');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);
  
  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-lg w-48" />
          <div className="h-6 bg-muted rounded w-32" />
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded-xl" />
            <div className="h-20 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Mobile: Show only today's schedule */}
      <MobileTodayView schedules={schedules} today={today} isPast={isTodayPast} />
      
      {/* Desktop: Show full week view */}
      <DesktopWeekView
        weekDates={weekDates}
        schedules={schedules}
        todayString={todayString}
        isLoading={isLoading}
        currentWeekStart={currentWeekStart}
        setCurrentWeekStart={setCurrentWeekStart}
      />
    </div>
  );
}

export default ScheduleView;

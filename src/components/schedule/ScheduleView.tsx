'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDate, getTimePeriod } from '@/store';

// Time slots (90 minutes each)
const TIME_SLOTS = [
  { id: 1, start: '08:00', end: '09:30' },
  { id: 2, start: '09:30', end: '11:00' },
  { id: 3, start: '11:00', end: '12:30' },
  { id: 4, start: '12:30', end: '14:00' },
  { id: 5, start: '14:00', end: '15:30' },
  { id: 6, start: '15:30', end: '17:00' },
  { id: 7, start: '17:00', end: '18:30' },
  { id: 8, start: '18:30', end: '20:00' },
  { id: 9, start: '20:00', end: '21:30' },
  { id: 10, start: '21:30', end: '23:00' },
];

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// Mock schedule data
interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  duration: number; // minutes
  color: string;
  type: 'class' | 'work' | 'personal';
}

const MOCK_SCHEDULES: ScheduleItem[] = [
  { id: '1', title: '高等数学', description: '线性代数', date: '', startTime: '08:00', duration: 90, color: '#3b82f6', type: 'class' },
  { id: '2', title: '计算机网络', description: '期末复习', date: '', startTime: '14:00', duration: 90, color: '#8b5cf6', type: 'class' },
  { id: '3', title: '团队会议', description: '项目进度汇报', date: '', startTime: '09:30', duration: 90, color: '#10b981', type: 'work' },
  { id: '4', title: '健身', description: '有氧训练', date: '', startTime: '18:30', duration: 90, color: '#f59e0b', type: 'personal' },
  { id: '5', title: '算法训练', description: 'LeetCode刷题', date: '', startTime: '20:00', duration: 90, color: '#ef4444', type: 'work' },
];

function getTimeSlotIndex(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 8 * 60;
  return Math.max(0, Math.min(9, Math.floor((totalMinutes - startMinutes) / 90)));
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

// Current time indicator component
function CurrentTimeIndicator() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  const today = formatDate(currentTime);
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = 8 * 60;
  
  // Calculate position as percentage
  const position = ((totalMinutes - startMinutes) / (15 * 60)) * 100;
  
  if (position < 0 || position > 100) return null;
  
  return (
    <div 
      className="absolute left-0 right-0 h-0.5 bg-red-500 z-40 pointer-events-none"
      style={{ top: `${position}%` }}
    >
      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
      </div>
    </div>
  );
}

interface ScheduleCardProps {
  schedule: ScheduleItem;
  slotIndex: number;
  slotSpan: number;
  isPast: boolean;
}

function ScheduleCard({ schedule, slotIndex, slotSpan, isPast }: ScheduleCardProps) {
  const height = slotSpan * 64 - 8;
  
  const typeColors = {
    class: 'from-blue-500/90 to-indigo-500/90',
    work: 'from-emerald-500/90 to-teal-500/90',
    personal: 'from-amber-500/90 to-orange-500/90',
  };
  
  const typeIcons = {
    class: '📚',
    work: '💼',
    personal: '🎯',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 30 }}
      className={cn(
        'absolute inset-x-1 top-1 rounded-lg px-3 py-2 overflow-hidden cursor-pointer transition-all',
        'backdrop-blur-md border border-white/20',
        isPast && 'opacity-50 grayscale-[20%]'
      )}
      style={{
        height: `${height}px`,
        background: `linear-gradient(135deg, ${schedule.color}40, ${schedule.color}20)`,
        boxShadow: `0 4px 15px ${schedule.color}30`,
      }}
    >
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-80',
        typeColors[schedule.type]
      )} />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between">
          <span className="text-lg">{typeIcons[schedule.type]}</span>
          {!isPast && (
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
          )}
        </div>
        <div className="flex-1 mt-1">
          <h4 className="text-sm font-medium text-white truncate">{schedule.title}</h4>
          {schedule.description && (
            <p className="text-xs text-white/70 truncate mt-0.5">{schedule.description}</p>
          )}
          <p className="text-xs text-white/60 mt-1">
            {TIME_SLOTS[slotIndex]?.start} - {TIME_SLOTS[Math.min(slotIndex + slotSpan - 1, 9)]?.end}
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
    <div className={cn(
      'relative flex-1 min-w-0 border-r border-border/50 last:border-r-0',
      isToday && 'bg-primary/5'
    )}>
      {/* Day header */}
      <div className={cn(
        'sticky top-0 z-20 px-2 py-3 text-center border-b border-border/50 backdrop-blur-sm',
        isToday && 'bg-primary/10'
      )}>
        <div className={cn(
          'text-sm font-medium',
          isToday && 'text-primary'
        )}>
          {WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]}
        </div>
        <div className={cn(
          'text-lg font-bold mt-1 w-8 h-8 mx-auto rounded-full flex items-center justify-center',
          isToday && 'bg-primary text-primary-foreground'
        )}>
          {date.getDate()}
        </div>
      </div>
      
      {/* Time grid */}
      <div className="relative h-[640px]">
        {TIME_SLOTS.map((slot, index) => (
          <div
            key={slot.id}
            className="absolute left-0 right-0 border-t border-border/30"
            style={{ top: `${index * 64}px` }}
          >
            <span className="absolute -top-3 left-1 text-[10px] text-muted-foreground/60">
              {slot.start}
            </span>
          </div>
        ))}
        
        {/* Schedule items */}
        {daySchedules.map((schedule) => {
          const slotIndex = getTimeSlotIndex(schedule.startTime);
          const slotSpan = Math.ceil(schedule.duration / 90);
          
          return (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              slotIndex={slotIndex}
              slotSpan={slotSpan}
              isPast={isPast}
            />
          );
        })}
        
        {/* Current time indicator for today */}
        {isToday && <CurrentTimeIndicator />}
      </div>
    </div>
  );
}

export function ScheduleView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);
  const todayString = useMemo(() => formatDate(new Date()), []);
  
  // Generate schedules with dates
  const schedules = useMemo(() => {
    return MOCK_SCHEDULES.map(schedule => {
      // Assign a random weekday
      const randomDayIndex = Math.floor(Math.random() * 5); // Weekdays only
      const date = new Date(weekDates[randomDayIndex]);
      return {
        ...schedule,
        date: formatDate(date),
      };
    });
  }, [weekDates]);
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
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
  
  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };
  
  const weekLabel = `${currentWeekStart.getMonth() + 1}月${currentWeekStart.getDate()}日 - ${weekDates[6].getMonth() + 1}月${weekDates[6].getDate()}日`;
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
          >
            ←
          </motion.button>
          <h3 className="text-lg font-medium min-w-[140px] text-center">{weekLabel}</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextWeek}
            className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
          >
            →
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToToday}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          今天
        </motion.button>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>课程</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>工作</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>个人</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>当前时间</span>
        </div>
      </div>
      
      {/* Schedule Grid */}
      <div className="flex border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        {/* Time labels column */}
        <div className="w-12 flex-shrink-0 border-r border-border/50">
          <div className="h-[88px] border-b border-border/50" /> {/* Header space */}
          <div className="relative h-[640px]">
            {TIME_SLOTS.map((slot, index) => (
              <div
                key={slot.id}
                className="absolute left-0 right-0 text-right pr-2"
                style={{ top: `${index * 64}px` }}
              >
                <span className="text-[10px] text-muted-foreground/60">{slot.start}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Day columns */}
        <div className="flex flex-1 overflow-x-auto">
          {weekDates.map((date) => (
            <DayColumn
              key={date.toISOString()}
              date={date}
              schedules={schedules}
              isToday={formatDate(date) === todayString}
              isPast={date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScheduleView;

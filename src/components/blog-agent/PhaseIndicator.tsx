'use client';

import { WritingPhase } from '@/lib/ai/types';
import { cn } from '@/lib/utils';
import { Lightbulb, List, PenTool, Sparkles, Check } from 'lucide-react';

const phases: { id: WritingPhase; label: string; icon: any }[] = [
  { id: 'capture', label: '想法捕捉', icon: Lightbulb },
  { id: 'outline', label: '生成大纲', icon: List },
  { id: 'writing', label: '分段写作', icon: PenTool },
  { id: 'polishing', label: '润色', icon: Sparkles },
  { id: 'done', label: '完成', icon: Check },
];

interface PhaseIndicatorProps {
  currentPhase: WritingPhase;
  onPhaseClick?: (phase: WritingPhase) => void;
}

export function PhaseIndicator({ currentPhase, onPhaseClick }: PhaseIndicatorProps) {
  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-xl border">
      {phases.map((phase, index) => {
        const Icon = phase.icon;
        const isActive = phase.id === currentPhase;
        const isCompleted = index < currentIndex;
        const isClickable = onPhaseClick && (isCompleted || isActive);

        return (
          <div key={phase.id} className="flex items-center">
            <button
              onClick={() => isClickable && onPhaseClick(phase.id)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all',
                'text-sm font-medium',
                isActive && 'bg-primary text-primary-foreground',
                isCompleted && 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30',
                !isActive && !isCompleted && 'text-muted-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{phase.label}</span>
            </button>
            {index < phases.length - 1 && (
              <div className={cn(
                'w-8 h-px mx-1',
                isCompleted ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

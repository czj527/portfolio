'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { Sun, Moon, Sparkles, Leaf, Snowflake, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const themeOptions = [
  { value: 'light', label: '明亮', icon: Sun, color: 'text-yellow-500' },
  { value: 'dark', label: '夜间', icon: Moon, color: 'text-blue-400' },
  { value: 'realtime', label: '实时', icon: Sparkles, color: 'text-purple-500' },
  { value: 'spring', label: '春季', icon: Leaf, color: 'text-pink-500' },
  { value: 'summer', label: '夏季', icon: Sun, color: 'text-orange-500' },
  { value: 'autumn', label: '秋季', icon: Flame, color: 'text-amber-600' },
  { value: 'winter', label: '冬季', icon: Snowflake, color: 'text-cyan-400' },
];

export function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-10 h-10" />;
  }
  
  const currentTheme = themeOptions.find(t => t.value === settings.themeMode) || themeOptions[0];
  const CurrentIcon = currentTheme.icon;
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2.5 rounded-xl backdrop-blur-sm border border-border/50 transition-colors',
          'bg-card/50 hover:bg-card/80'
        )}
        aria-label="切换主题"
      >
        <CurrentIcon className={cn('w-5 h-5', currentTheme.color)} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 p-2 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl min-w-[160px]"
            >
              <div className="space-y-1">
                {themeOptions.map((theme) => {
                  const Icon = theme.icon;
                  const isActive = settings.themeMode === theme.value;
                  
                  return (
                    <motion.button
                      key={theme.value}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        updateSettings({ themeMode: theme.value as any });
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', theme.color)} />
                      <span className="flex-1 text-left">{theme.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-2 pt-2 border-t border-border">
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    updateSettings({ particleEffects: !settings.particleEffects });
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    settings.particleEffects
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="flex-1 text-left">粒子效果</span>
                  <div className={cn(
                    'w-8 h-4 rounded-full relative transition-colors',
                    settings.particleEffects ? 'bg-primary' : 'bg-muted'
                  )}>
                    <motion.div
                      animate={{ x: settings.particleEffects ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow"
                    />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;

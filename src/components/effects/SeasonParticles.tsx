'use client';

import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useAppStore, Season, ThemeMode } from '@/store';

// ==================== Particle Types ====================
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  rotation: number;
  color?: string;
  speed?: number;
  sway?: number;
}

// ==================== Theme-based Particle Configurations ====================
interface ParticleConfig {
  count: number;
  minSize: number;
  maxSize: number;
  minDuration: number;
  maxDuration: number;
  colors: string[];
  shapes: ('circle' | 'flake' | 'leaf' | 'petal')[];
  gravity?: number;
  wind?: number;
}

const PARTICLE_CONFIGS: Record<Season, ParticleConfig> = {
  spring: {
    count: 20,
    minSize: 8,
    maxSize: 20,
    minDuration: 8,
    maxDuration: 15,
    colors: ['#FFB7C5', '#FFC0CB', '#FFE4E1', '#FF69B4', '#FFFFFF'],
    shapes: ['petal', 'circle'],
    gravity: 0.3,
    wind: 0.2,
  },
  summer: {
    count: 25,
    minSize: 4,
    maxSize: 12,
    minDuration: 6,
    maxDuration: 12,
    colors: ['#87CEEB', '#ADD8E6', '#B0E0E6', '#FFFFFF', '#E0FFFF'],
    shapes: ['circle'],
    gravity: 0.5,
    wind: 0.4,
  },
  autumn: {
    count: 18,
    minSize: 10,
    maxSize: 25,
    minDuration: 6,
    maxDuration: 14,
    colors: ['#FF6B35', '#FF8C42', '#D4A373', '#8B4513', '#CD853F'],
    shapes: ['leaf'],
    gravity: 0.4,
    wind: 0.3,
  },
  winter: {
    count: 30,
    minSize: 4,
    maxSize: 12,
    minDuration: 8,
    maxDuration: 18,
    colors: ['#FFFFFF', '#E8F4F8', '#B0E0E6', '#ADD8E6', '#87CEEB'],
    shapes: ['flake', 'circle'],
    gravity: 0.2,
    wind: 0.1,
  },
};

function generateParticle(id: number, season: Season): Particle {
  const config = PARTICLE_CONFIGS[season];
  return {
    id,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    size: config.minSize + Math.random() * (config.maxSize - config.minSize),
    delay: Math.random() * 5,
    duration: config.minDuration + Math.random() * (config.maxDuration - config.minDuration),
    opacity: 0.4 + Math.random() * 0.6,
    rotation: Math.random() * 360,
    color: config.colors[Math.floor(Math.random() * config.colors.length)],
    speed: 0.5 + Math.random() * 0.5,
    sway: (Math.random() - 0.5) * 2,
  };
}

const ParticleItem = memo(function ParticleItem({
  particle,
  onComplete,
}: {
  particle: Particle;
  onComplete: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(particle.id);
    }, (particle.delay + particle.duration) * 1000);
    return () => clearTimeout(timer);
  }, [particle.id, particle.delay, particle.duration, onComplete]);
  
  return (
    <div
      className="absolute pointer-events-none season-particle"
      style={{
        left: `${particle.x}%`,
        top: 0,
        width: particle.size,
        height: particle.size,
        background: particle.color,
        borderRadius: '50%',
        opacity: particle.opacity,
        transform: `rotate(${particle.rotation}deg)`,
        animation: `seasonFall ${particle.duration}s ease-in ${particle.delay}s infinite`,
        '--sway': particle.sway,
      } as React.CSSProperties}
    />
  );
});

export function SeasonParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [season, setSeason] = useState<Season>('spring');
  const [isVisible, setIsVisible] = useState(true);
  const particleIdRef = useRef(0);
  
  const settings = useAppStore((state) => state.settings);
  const currentTheme = useAppStore((state) => state.currentTheme);
  
  useEffect(() => {
    let resolvedSeason: Season;
    
    if (currentTheme === 'spring' || currentTheme === 'summer' || 
        currentTheme === 'autumn' || currentTheme === 'winter') {
      resolvedSeason = currentTheme;
    } else {
      const month = new Date().getMonth() + 1;
      if (month >= 3 && month <= 5) resolvedSeason = 'spring';
      else if (month >= 6 && month <= 8) resolvedSeason = 'summer';
      else if (month >= 9 && month <= 11) resolvedSeason = 'autumn';
      else resolvedSeason = 'winter';
    }
    
    setSeason(resolvedSeason);
  }, [currentTheme]);
  
  useEffect(() => {
    const hour = new Date().getHours();
    const showParticles = (hour >= 6 && hour < 12) || hour >= 18 || hour < 6;
    setIsVisible(showParticles && settings.particleEffects);
  }, [settings.particleEffects]);
  
  useEffect(() => {
    if (!settings.particleEffects || !isVisible) {
      setParticles([]);
      return;
    }
    
    const config = PARTICLE_CONFIGS[season];
    const initialParticles: Particle[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const p = generateParticle(particleIdRef.current++, season);
      p.y = -10 + Math.random() * 110;
      initialParticles.push(p);
    }
    
    setParticles(initialParticles);
  }, [season, settings.particleEffects, isVisible]);
  
  const handleParticleComplete = useCallback((id: number) => {
    setParticles((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index !== -1) {
        const newParticle = generateParticle(particleIdRef.current++, season);
        return [...prev.slice(0, index), newParticle, ...prev.slice(index + 1)];
      }
      return prev;
    });
  }, [season]);
  
  if (!isVisible || currentTheme === 'light') {
    return null;
  }
  
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden season-particles-container"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <ParticleItem
          key={particle.id}
          particle={particle}
          onComplete={handleParticleComplete}
        />
      ))}
    </div>
  );
}

export default SeasonParticles;

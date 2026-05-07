"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export type BlogVersion = "beginner" | "intermediate";

interface VersionOption {
  key: BlogVersion;
  label: string;
  emoji: string;
  desc: string;
}

const VERSIONS: VersionOption[] = [
  {
    key: "beginner",
    label: "零基础版",
    emoji: "🌱",
    desc: "面向完全没有编程经验的访客，每一步都详细解释",
  },
  {
    key: "intermediate",
    label: "基础版",
    emoji: "⚡",
    desc: "面向有 Python 基础的开发者，保持教学节奏",
  },
];

interface BlogVersionSelectorProps {
  currentVersion: BlogVersion;
  onVersionChange: (version: BlogVersion) => void;
}

export function BlogVersionSelector({
  currentVersion,
  onVersionChange,
}: BlogVersionSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full mb-8">
      {/* 版本切换说明 */}
      <div className="text-sm text-muted-foreground mb-4 text-center">
        这篇教程提供两个难度版本，点击切换阅读：
      </div>

      {/* 切换器主体 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {VERSIONS.map((version) => {
          const isActive = currentVersion === version.key;
          return (
            <button
              key={version.key}
              onClick={() => onVersionChange(version.key)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl border transition-all duration-300 cursor-pointer text-center w-full sm:w-auto",
                isActive
                  ? "bg-primary/10 border-primary/40 shadow-sm"
                  : "bg-card border-border/60 hover:bg-accent/50 hover:border-border hover:-translate-y-0.5 hover:shadow-sm"
              )}
            >
              {/* 版本图标 */}
              <span className="text-2xl">{version.emoji}</span>
              {/* 版本名称 */}
              <span
                className={cn(
                  "font-semibold text-sm transition-colors",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {version.label}
              </span>
              {/* 描述文字 */}
              <span
                className={cn(
                  "hidden sm:block text-[10px] leading-tight max-w-[140px] transition-colors",
                  isActive ? "text-primary/70" : "text-muted-foreground"
                )}
              >
                {version.desc}
              </span>

              {/* 激活指示器 */}
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* 当前版本标签 */}
      <div className="mt-4 flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/70 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          当前阅读：
          {VERSIONS.find((v) => v.key === currentVersion)?.label}
        </span>
      </div>
    </div>
  );
}

export { VERSIONS };

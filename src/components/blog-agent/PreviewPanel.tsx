'use client';

import { useMemo } from 'react';
import { OutlineItem, WritingPhase } from '@/lib/ai/types';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { FileText, List, Eye } from 'lucide-react';
import remarkGfm from 'remark-gfm';

interface PreviewPanelProps {
  markdown: string;
  title: string;
  outline: OutlineItem[];
  phase: WritingPhase;
  onTitleChange: (title: string) => void;
  isAdmin: boolean;
}

export function PreviewPanel({
  markdown,
  title,
  outline,
  phase,
  onTitleChange,
  isAdmin
}: PreviewPanelProps) {
  const isEmpty = !markdown && outline.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card/50">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">实时预览</span>
        </div>
        {isAdmin && phase !== 'capture' && (
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="输入文章标题..."
            className="text-sm font-medium bg-transparent border-0 outline-none w-48 placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* 预览内容 */}
      <div className="flex-1 overflow-y-auto p-6">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-center">
              开始对话后，AI会在这里生成预览内容
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* 大纲预览 */}
            {outline.length > 0 && !markdown && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <List className="w-4 h-4" />
                  <span className="text-sm font-medium">文章大纲</span>
                </div>
                <div className="space-y-3">
                  {outline.map((item, index) => (
                    <div key={item.id} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Markdown预览 */}
            {markdown && (
              <article className="prose prose-sm max-w-none dark:prose-invert">
                {title && phase === 'done' && (
                  <h1 className="text-3xl font-bold mb-6">{title}</h1>
                )}
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="leading-relaxed mb-4">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="px-1.5 py-0.5 rounded bg-secondary text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block p-4 rounded-lg bg-secondary font-mono text-sm overflow-x-auto">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="rounded-lg overflow-hidden my-4">{children}</pre>
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </article>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

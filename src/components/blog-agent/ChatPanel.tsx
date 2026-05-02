'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, WritingPhase, OutlineItem } from '@/lib/ai/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  phase: WritingPhase;
  chatHistory: ChatMessage[];
  corePoints: string[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onGenerateOutline: () => void;
  onGenerateSection: (sectionId: string) => void;
  onPolishText: () => void;
  outline: OutlineItem[];
  isAdmin: boolean;
}

export function ChatPanel({
  phase,
  chatHistory,
  corePoints,
  isLoading,
  onSendMessage,
  onGenerateOutline,
  onGenerateSection,
  onPolishText,
  outline,
  isAdmin
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const getPlaceholder = () => {
    switch (phase) {
      case 'capture':
        return '输入你的写作想法...';
      case 'outline':
        return '补充说明或调整内容...';
      case 'writing':
        return '继续补充或调整...';
      case 'polishing':
        return '告诉AI你的润色需求...';
      default:
        return '输入...';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && phase === 'capture' && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>输入你的写作想法，AI会帮你分析和整理</p>
            <p className="text-sm mt-2">可以是任何话题，比如：</p>
            <div className="mt-4 space-y-2 text-sm">
              <button
                onClick={() => setInput('我想写一篇关于AI对未来工作影响的文章')}
                className="block w-full max-w-xs mx-auto px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
              >
                "我想写一篇关于AI对未来工作影响的文章"
              </button>
              <button
                onClick={() => setInput('分享我最近学到的产品设计心得')}
                className="block w-full max-w-xs mx-auto px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left"
              >
                "分享我最近学到的产品设计心得"
              </button>
            </div>
          </div>
        )}

        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary rounded-bl-md'
              )}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">思考中...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 核心论点展示 */}
      {phase === 'outline' && corePoints.length > 0 && (
        <div className="px-4 py-3 border-t bg-secondary/30">
          <p className="text-xs text-muted-foreground mb-2">核心论点：</p>
          <div className="flex flex-wrap gap-2">
            {corePoints.map((point, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {point}
              </span>
            ))}
          </div>
          <Button
            onClick={onGenerateOutline}
            disabled={isLoading}
            className="w-full mt-3"
            size="sm"
          >
            生成大纲
          </Button>
        </div>
      )}

      {/* 大纲操作 */}
      {phase === 'writing' && outline.length > 0 && (
        <div className="px-4 py-3 border-t bg-secondary/30">
          <p className="text-xs text-muted-foreground mb-2">生成各章节内容：</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {outline.map((item) => (
              <Button
                key={item.id}
                onClick={() => onGenerateSection(item.id)}
                disabled={isLoading || !!item.content}
                variant={item.content ? 'secondary' : 'outline'}
                size="sm"
              >
                {item.content ? '✓ ' : ''}{item.title}
              </Button>
            ))}
          </div>
          {outline.every(item => item.content) && (
            <Button
              onClick={onPolishText}
              disabled={isLoading}
              className="w-full mt-3"
              size="sm"
            >
              润色全文
            </Button>
          )}
        </div>
      )}

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="self-end"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </form>
    </div>
  );
}

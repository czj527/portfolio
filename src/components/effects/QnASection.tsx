'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Types
interface QnAItem {
  id: number;
  question: string;
  answer: string;
  author: string;
  isHighlighted: boolean;
  createdAt: string;
  randomAngle: number;
}

// Mock data
const MOCK_QNA: QnAItem[] = [
  {
    id: 1,
    question: '你是如何学习前端的？',
    answer: '我是通过实践项目驱动的学习方式。先掌握了HTML/CSS/JavaScript基础，然后通过模仿优秀的网站来学习布局和交互，最后深入学习React和Next.js等现代框架。',
    author: '前端小白',
    isHighlighted: true,
    createdAt: '2024-03-15',
    randomAngle: -5,
  },
  {
    id: 2,
    question: '最喜欢的技术栈是什么？',
    answer: '我最喜欢的是 Next.js + React + TypeScript + Tailwind CSS 的组合。这个技术栈让我能够快速构建现代化的全栈应用开发。',
    author: '技术达人',
    isHighlighted: false,
    createdAt: '2024-03-10',
    randomAngle: 3,
  },
  {
    id: 3,
    question: '平时有什么爱好？',
    answer: '除了编程，我还喜欢打篮球、听音乐和阅读技术博客。运动让我保持健康，阅读让我不断进步。',
    author: '好奇游客',
    isHighlighted: false,
    createdAt: '2024-03-08',
    randomAngle: -2,
  },
  {
    id: 4,
    question: '为什么叫长岛冰茶？',
    answer: '长岛冰茶是一种鸡尾酒，颜色看起来像茶但酒精浓度很高，就像我的外表看起来普通但内心很有深度（自夸一下 😄）。',
    author: '深夜诗人',
    isHighlighted: true,
    createdAt: '2024-03-05',
    randomAngle: 7,
  },
];

interface QnACardProps {
  item: QnAItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function QnACard({ item, isExpanded, onToggle }: QnACardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: item.randomAngle }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, rotate: 0 }}
      className={cn(
        'relative p-4 rounded-xl cursor-pointer transition-all duration-300',
        'border backdrop-blur-sm',
        item.isHighlighted
          ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg shadow-primary/10'
          : 'bg-card/80 border-border hover:border-primary/30'
      )}
      onClick={onToggle}
    >
      {/* Glow effect for highlighted items */}
      {item.isHighlighted && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 blur-sm -z-10" />
      )}
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {item.isHighlighted && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="text-sm"
              >
                ✨
              </motion.span>
            )}
            <span className="text-sm text-muted-foreground">@{item.author}</span>
            <span className="text-xs text-muted-foreground/60">{item.createdAt}</span>
          </div>
          
          <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            {item.question}
          </h3>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'p-4 rounded-lg',
              item.isHighlighted
                ? 'bg-primary/5 border border-primary/20'
                : 'bg-accent/30'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">☕</span>
                <span className="font-medium text-primary">长岛冰茶</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QnASection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simulated QnA list (in real app, this would come from API)
  const [qnaList, setQnAList] = useState<QnAItem[]>(MOCK_QNA);
  
  // Get highlighted items for banner display
  const highlightedItems = useMemo(
    () => qnaList.filter(item => item.isHighlighted).slice(0, 3),
    [qnaList]
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: QnAItem = {
      id: Date.now(),
      question: newQuestion,
      answer: '感谢你的提问！我会尽快回复的 😊',
      author: '匿名访客',
      isHighlighted: false,
      createdAt: new Date().toISOString().split('T')[0],
      randomAngle: (Math.random() - 0.5) * 10,
    };
    
    setQnAList(prev => [newItem, ...prev]);
    setNewQuestion('');
    setIsSubmitting(false);
    setExpandedId(newItem.id);
  };
  
  const handleToggle = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-card/50 to-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            访客问答
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">有什么想问的？</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            欢迎在下方留言，我会认真回复每一个问题。可以是技术相关，也可以是关于我的任何问题。
          </p>
        </motion.div>
        
        {/* Highlighted Q&A Banner */}
        {highlightedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {highlightedItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm max-w-xs cursor-pointer"
                  onClick={() => handleToggle(item.id)}
                >
                  <div className="text-sm text-muted-foreground mb-2">@{item.author}</div>
                  <h4 className="font-medium text-sm line-clamp-2">{item.question}</h4>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Q&A List */}
        <div className="space-y-4 mb-8">
          {qnaList.map(item => (
            <QnACard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
        
        {/* Submit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-card/80 border border-border backdrop-blur-sm"
        >
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            提问
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="输入你的问题..."
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !newQuestion.trim()}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    发送
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              提示：你可以问我关于技术、学习、生活等任何问题！
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default QnASection;

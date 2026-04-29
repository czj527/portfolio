'use client';

import { useState, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Tag, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';

interface Post {
  id: number;
  title: string;
  excerpt: string | null;
  slug: string;
  pinned: boolean;
  views: number;
  createdAt: string;
  category: { name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
  _count: { comments: number; likes: number };
}

interface BlogCardProps {
  post: Post;
  index: number;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Determine if it's a tech or life blog based on category or tags
function getBlogType(category: { name: string; slug: string } | null): 'tech' | 'life' {
  if (!category) return 'tech';
  const name = category.name.toLowerCase();
  const lifeKeywords = ['生活', '随笔', '日记', '分享', 'life', 'personal'];
  return lifeKeywords.some(k => name.includes(k)) ? 'life' : 'tech';
}

const TiltCard = memo(function TiltCard({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

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
      className={className}
    >
      {children}
    </motion.div>
  );
});

export function BlogCard({ post, index, onDelete, deletingId }: BlogCardProps) {
  const { isAdmin } = useAdmin();
  const blogType = getBlogType(post.category);
  
  const borderColors = {
    tech: 'rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0.2)', // Cool blue
    life: 'rgba(251, 146, 60, 0.5), rgba(251, 146, 60, 0.2)', // Warm orange
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm(`确定要删除「${post.title}」吗？`)) return;
    onDelete(post.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, z: 50 }}
      className="group relative"
    >
      <TiltCard className="relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
        {/* Glow border effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${borderColors[blogType]})`,
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
        />
        
        <Link href={`/blog/${post.slug}`} className="block relative">
          <div className="relative h-48 overflow-hidden">
            {/* Gradient background with category-specific colors */}
            <div 
              className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 ${
                blogType === 'tech' 
                  ? 'bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-indigo-500/20' 
                  : 'bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-red-500/20'
              }`}
            />
            
            {post.pinned && (
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs rounded-full bg-primary text-primary-foreground backdrop-blur-sm">
                置顶
              </span>
            )}
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-lg font-medium">阅读更多</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
              {blogType === 'tech' ? '💻' : '🌸'}
            </div>
          </div>
        </Link>
        
        <div className="p-6 relative z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.category && (
              <span 
                className={`px-2.5 py-1 text-xs rounded-full backdrop-blur-sm ${
                  blogType === 'tech'
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    : 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                }`}
              >
                {post.category.name}
              </span>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag.id} 
                className="px-2.5 py-1 text-xs rounded-full bg-accent/50 text-muted-foreground backdrop-blur-sm border border-border/50"
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {tag.name}
              </span>
            ))}
          </div>
          
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.createdAt)}</span>
            <span className="opacity-50">·</span>
            <span>{post._count.comments} 评论</span>
            <span className="opacity-50">·</span>
            <span>{post._count.likes} 赞</span>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <Link href={`/blog/${post.slug}?edit=1`}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deletingId === post.id}
                className="text-muted-foreground hover:text-destructive"
              >
                {deletingId === post.id ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-1" />
                )}
                删除
              </Button>
            </div>
          )}
        </div>
      </TiltCard>
    </motion.article>
  );
}

export default BlogCard;

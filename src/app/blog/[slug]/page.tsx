'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Calendar, Eye, Tag, Loader2, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  markdown: string | null;
  excerpt: string | null;
  tags: string[];
  published_at: string;
  updated_at: string;
  views: number;
}

function BlogDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) {
        setError(res.status === 404 ? '文章不存在' : '加载失败');
        return;
      }
      const data = await res.json();
      setPost(data.post);
    } catch (e) {
      setError('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const content = post?.markdown || post?.content || '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-4">{error || '文章不存在'}</h1>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回博客
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回博客
            </Button>
          </Link>
          <Link href="/ai-write">
            <Button size="sm">
              <PenTool className="w-4 h-4 mr-2" />
              AI 写作
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 文章头部 */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), 'yyyy年MM月dd日')}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.views} 阅读</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 文章内容 */}
          {content ? (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>,
                  p: ({ children }) => <p className="leading-relaxed mb-6">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/30 pl-6 my-6 italic text-muted-foreground">
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
                      <code className="block p-4 rounded-lg bg-secondary font-mono text-sm overflow-x-auto my-6">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="rounded-lg overflow-hidden my-6">{children}</pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary underline hover:no-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <figure className="my-8">
                      <img src={src} alt={alt || ''} className="rounded-lg max-w-full" />
                      {alt && <figcaption className="text-center text-sm text-muted-foreground mt-2">{alt}</figcaption>}
                    </figure>
                  ),
                  hr: () => <hr className="my-12 border-border" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 bg-secondary font-medium">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2">{children}</td>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground">暂无内容</p>
          )}

          {/* 底部导航 */}
          <footer className="mt-16 pt-8 border-t">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回博客列表
              </Button>
            </Link>
          </footer>
        </motion.article>
      </main>
    </div>
  );
}

function BlogDetailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function BlogDetailPage() {
  return (
    <Suspense fallback={<BlogDetailFallback />}>
      <BlogDetailContent />
    </Suspense>
  );
}

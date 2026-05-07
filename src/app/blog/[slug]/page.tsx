"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Tag,
  Loader2,
  PenTool,
  Sparkles,
} from 'lucide-react';
import {
  BlogVersionSelector,
  BlogVersion,
} from '@/components/blog/BlogVersionSelector';
import { BLOG_CONTENT } from '@/content/blog/streamlit-ai-companion/content';

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

// 支持版本切换的文章 slug 列表
const MULTI_VERSION_SLUGS = ['streamlit-ai-companion'];

// 本地文章（不依赖 Supabase）
const LOCAL_POSTS_MAP: Record<string, { title: string; excerpt: string; tags: string[] }> = {
  'streamlit-ai-companion': {
    title: '用 Streamlit 快速搭建一个 AI 智能伴侣项目',
    excerpt: '基于 Streamlit + DeepSeek v4-flash，从零构建一个完整的 AI 对话应用，支持多轮对话、流式输出，提供三个难度版本。',
    tags: ['Streamlit', 'DeepSeek', 'Python', 'AI'],
  },
};

function BlogDetailContent() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentVersion, setCurrentVersion] = useState<BlogVersion>('intermediate');
  const [displayContent, setDisplayContent] = useState('');
  const [isLocalContent, setIsLocalContent] = useState(false);

  const isMultiVersion = MULTI_VERSION_SLUGS.includes(slug);

  useEffect(() => {
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (isMultiVersion && isLocalContent) {
      setDisplayContent(BLOG_CONTENT[currentVersion] || '');
    }
  }, [currentVersion, isMultiVersion, isLocalContent]);

  const loadPost = async () => {
    setIsLoading(true);
    setError('');
    
    // 本地文章优先：直接加载，不走 API
    const localInfo = LOCAL_POSTS_MAP[slug];
    if (localInfo) {
      setIsLocalContent(true);
      setPost({
        id: 'local-' + slug,
        slug,
        title: localInfo.title,
        content: null,
        markdown: BLOG_CONTENT[currentVersion],
        excerpt: localInfo.excerpt,
        tags: localInfo.tags,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
      });
      setIsLoading(false);
      return;
    }

    // 远程文章走 API
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) {
        setError(res.status === 404 ? '文章不存在' : '加载失败');
        return;
      }
      const data = await res.json();
      setPost(data.post);
      setIsLocalContent(false);
    } catch (e) {
      setError('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="text-6xl mb-4">🤔</div>
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

  const renderedContent =
    isMultiVersion && isLocalContent
      ? displayContent
      : post?.markdown || post?.content || '';

  const handleVersionChange = (version: BlogVersion) => {
    setCurrentVersion(version);
    setDisplayContent(BLOG_CONTENT[version] || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            {/* 多版本切换器 */}
            {isMultiVersion && isLocalContent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <BlogVersionSelector
                  currentVersion={currentVersion}
                  onVersionChange={handleVersionChange}
                />
              </motion.div>
            )}

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), 'yyyy年MM月dd日')}
                </time>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0} 阅读</span>
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

          {/* 版本提示 Banner */}
          {isMultiVersion && isLocalContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 p-4 rounded-2xl bg-accent/30 border border-accent/40 flex items-start gap-3"
            >
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">📖 这篇教程提供三个难度版本</p>
                <p className="text-muted-foreground">
                  选择适合你的版本阅读：零基础版（每行代码都解释）、基础版（保持教学节奏）、进阶版（聚焦架构与生产部署）。
                </p>
              </div>
            </motion.div>
          )}

          {/* 文章内容 */}
          {renderedContent ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={isMultiVersion ? currentVersion : 'default'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="prose prose-lg max-w-none dark:prose-invert"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-10 mb-6">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="leading-relaxed mb-6">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
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
                        <code className={className}>{children}</code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="rounded-lg overflow-hidden my-6 shadow-sm">
                        {children}
                      </pre>
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
                        <img
                          src={src}
                          alt={alt || ''}
                          className="rounded-lg max-w-full shadow-sm"
                        />
                        {alt && (
                          <figcaption className="text-center text-sm text-muted-foreground mt-2">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    ),
                    hr: () => <hr className="my-12 border-border" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="w-full border-collapse">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border px-4 py-2 bg-secondary/50 font-medium text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-4 py-2">{children}</td>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                  }}
                >
                  {renderedContent}
                </ReactMarkdown>
              </motion.div>
            </AnimatePresence>
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

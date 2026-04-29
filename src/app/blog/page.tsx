'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogCard } from '@/components/effects/BlogCard';

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

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: { posts: number };
}

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

const POSTS_PER_PAGE = 9;

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin } = useAdmin();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const activeCategory = searchParams.get('category') || '';
  const activeTag = searchParams.get('tag') || '';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(POSTS_PER_PAGE));
      if (activeCategory) params.set('category', activeCategory);
      if (activeTag) params.set('tag', activeTag);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data: PostsResponse = await res.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error('Failed to load posts:', e);
    } finally {
      setIsLoading(false);
    }
  }, [page, activeCategory, activeTag, searchQuery]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (slug: string) => {
    updateUrl({ category: slug || '', tag: '', page: '1' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchParams.get('search')) {
        updateUrl({ search: searchQuery, page: '1' });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: String(newPage) });
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, password: 'admin123' }),
      });
      await loadPosts();
    } catch (e) {
      console.error('Failed to delete:', e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">博客</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            分享技术见解、学习心得和开发经验
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="搜索文章..."
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !activeCategory && !activeTag
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent/50 text-muted-foreground hover:bg-primary/10 backdrop-blur-sm border border-border/50'
            }`}
          >
            全部 ({total})
          </button>
          <button
            onClick={() => handleCategoryChange('tech')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'tech'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 backdrop-blur-sm border border-blue-500/30'
            }`}
          >
            技术博客
          </button>
          <button
            onClick={() => handleCategoryChange('life')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'life'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 backdrop-blur-sm border border-orange-500/30'
            }`}
          >
            生活博客
          </button>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden">
                <div className="h-48 bg-muted rounded-b-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-muted-foreground text-lg">暂无文章</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              ← 上一页
            </Button>
            <span className="px-4 py-2 text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              下一页 →
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function BlogFallback() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogFallback />}>
      <BlogContent />
    </Suspense>
  );
}

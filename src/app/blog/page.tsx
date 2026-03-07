'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, ArrowRight, Tag, Edit } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Blog {
  id: string;
  name: string;
  description: string;
  tags: string[] | null;
  link: string;
  created_at: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const POSTS_PER_PAGE = 6;

// 内部组件，使用 useSearchParams
function BlogContent() {
  // 创建 Supabase 客户端（在组件内部，确保环境变量已加载）
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tag = searchParams.get('tag') || '全部';
  const page = parseInt(searchParams.get('page') || '1');

  // 获取所有唯一的标签
  const allTags = blogs.reduce<string[]>((tags, blog) => {
    if (blog.tags) {
      blog.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, ['全部']);

  // 加载博客数据
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤文章
  const filteredBlogs = tag === '全部'
    ? blogs
    : blogs.filter(blog => blog.tags?.includes(tag));

  // 分页计算
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const displayedBlogs = filteredBlogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // 切换标签
  const handleTagChange = (newTag: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tag', newTag);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  // 切换页面
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">技术博客</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            分享技术见解、学习心得和开发经验
          </p>
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {allTags.map((tagItem) => (
            <motion.button
              key={tagItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTagChange(tagItem)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tag === tagItem
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {tagItem}
              {tagItem !== '全部' && (
                <span className="ml-1 text-xs opacity-70">
                  ({blogs.filter(blog => blog.tags?.includes(tagItem)).length})
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            加载中...
          </div>
        ) : displayedBlogs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-6"
          >
            {displayedBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow card-hover"
              >
                <a href={blog.link} target="_blank" rel="noopener noreferrer">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.created_at).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                      {blog.name}
                    </h2>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {blog.description}
                    </p>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center text-primary font-medium">
                      阅读更多
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-muted-foreground text-lg">
              {tag === '全部' && blogs.length === 0 ? '暂无博客' : '该标签下暂无博客'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === 1
                    ? 'bg-accent text-muted-foreground cursor-not-allowed'
                    : 'bg-accent text-muted-foreground hover:bg-primary/10'
                }`}
              >
                ←
              </motion.button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-muted-foreground hover:bg-primary/10'
                  }`}
                >
                  {pageNum}
                </motion.button>
              ))}

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === totalPages
                    ? 'bg-accent text-muted-foreground cursor-not-allowed'
                    : 'bg-accent text-muted-foreground hover:bg-primary/10'
                }`}
              >
                →
              </motion.button>
            </div>

            <p className="text-sm text-muted-foreground">
              第 {page} 页，共 {totalPages} 页 ({filteredBlogs.length} 篇文章)
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Management Button */}
      <Link href="/blog/manage">
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all text-sm shadow-lg z-40"
          title="管理博客"
        >
          <Edit className="w-4 h-4" />
          <span>管理</span>
        </motion.button>
      </Link>
    </div>
  );
}

// Loading fallback
function BlogFallback() {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 默认导出，使用 Suspense 包裹
export default function Blog() {
  return (
    <Suspense fallback={<BlogFallback />}>
      <BlogContent />
    </Suspense>
  );
}

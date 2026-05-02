'use client';

export type WriteMode = 'generate' | 'assist';
export type ArticleType = 'tech-tutorial' | 'tech-blog' | 'essay' | 'review' | 'industry';

const ARTICLE_TYPES: Record<ArticleType, { label: string; icon: string }> = {
  'tech-tutorial': { label: '技术教程', icon: '📖' },
  'tech-blog': { label: '技术博客', icon: '💻' },
  'essay': { label: '个人随笔', icon: '✏️' },
  'review': { label: '产品测评', icon: '🔍' },
  'industry': { label: '行业观察', icon: '📊' },
};

interface ModeSwitcherProps {
  mode: WriteMode;
  articleType: ArticleType;
  onModeChange: (mode: WriteMode) => void;
  onArticleTypeChange: (type: ArticleType) => void;
}

export default function ModeSwitcher({ mode, articleType, onModeChange, onArticleTypeChange }: ModeSwitcherProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => onModeChange('generate')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'generate'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          🎯 从零生成
        </button>
        <button
          onClick={() => onModeChange('assist')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'assist'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          ✍️ 辅助写作
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">文章类型</span>
        <select
          value={articleType}
          onChange={(e) => onArticleTypeChange(e.target.value as ArticleType)}
          className="text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(ARTICLE_TYPES).map(([key, { label, icon }]) => (
            <option key={key} value={key}>{icon} {label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

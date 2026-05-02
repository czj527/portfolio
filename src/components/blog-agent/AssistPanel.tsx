'use client';

import { useState } from 'react';
import type { ArticleType } from './ModeSwitcher';

type AssistType = 
  | 'polish' | 'expand' | 'shrink' | 'rewrite' | 'translate' | 'correct'
  | 'continue' | 'outline' | 'titles' | 'tags' | 'references'
  | 'analyze-structure' | 'logic-optimize' | 'core-idea';

interface ToolButton {
  type: AssistType;
  label: string;
  icon: string;
  needsSelection: boolean;
}

const BASIC_TOOLS: ToolButton[] = [
  { type: 'polish', label: '润色', icon: '✨', needsSelection: true },
  { type: 'expand', label: '扩写', icon: '📏', needsSelection: true },
  { type: 'shrink', label: '缩写', icon: '✂️', needsSelection: true },
  { type: 'rewrite', label: '改写', icon: '🔄', needsSelection: true },
  { type: 'translate', label: '翻译', icon: '🌍', needsSelection: true },
  { type: 'correct', label: '纠错', icon: '✅', needsSelection: true },
];

const ADVANCED_TOOLS: ToolButton[] = [
  { type: 'continue', label: '续写', icon: '💡', needsSelection: false },
  { type: 'outline', label: '大纲', icon: '📋', needsSelection: false },
  { type: 'titles', label: '标题', icon: '🏷️', needsSelection: false },
  { type: 'tags', label: '标签', icon: '🔖', needsSelection: false },
  { type: 'references', label: '资料', icon: '🔗', needsSelection: false },
  { type: 'analyze-structure', label: '结构', icon: '📊', needsSelection: false },
  { type: 'logic-optimize', label: '逻辑', icon: '💭', needsSelection: false },
];

type TabType = 'tools' | 'references' | 'structure';

interface AssistPanelProps {
  selectedText: string;
  fullContent: string;
  articleType: ArticleType;
  onApplyResult: (text: string) => void;
}

export default function AssistPanel({ selectedText, fullContent, articleType, onApplyResult }: AssistPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>('');

  const handleToolClick = async (tool: ToolButton) => {
    if (tool.needsSelection && !selectedText) {
      setResult('⚠️ 请先在编辑器中选中需要处理的文字');
      return;
    }

    setIsLoading(true);
    setCurrentTool(tool.label);
    setResult('');

    try {
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: tool.type,
          content: selectedText,
          context: fullContent,
          articleType,
        }),
      });

      if (!response.ok) {
        setResult('❌ 请求失败，请稍后重试');
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'chunk') {
                accumulated += parsed.content;
                setResult(accumulated);
              } else if (parsed.type === 'error') {
                setResult(`❌ ${parsed.error}`);
              }
            } catch (e) {
              // ignore
            }
          }
        }
      }
    } catch (error) {
      setResult('❌ 网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
      setCurrentTool('');
    }
  };

  const handleApply = () => {
    if (result && !result.startsWith('⚠️') && !result.startsWith('❌')) {
      onApplyResult(result);
      setResult('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab切换 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['tools', 'references', 'structure'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'tools' ? '🛠️ AI工具' : tab === 'references' ? '🔗 参考资料' : '📊 结构分析'}
          </button>
        ))}
      </div>

      {/* 工具按钮 */}
      <div className="p-3 space-y-3 overflow-y-auto flex-1">
        {activeTab === 'tools' && (
          <>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                选中文字辅助 {selectedText ? `· 已选中 ${selectedText.length} 字` : '· 请先选中文字'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {BASIC_TOOLS.map(tool => (
                  <button
                    key={tool.type}
                    onClick={() => handleToolClick(tool)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1 px-2 py-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">内容生成</p>
              <div className="grid grid-cols-3 gap-2">
                {ADVANCED_TOOLS.slice(0, 5).map(tool => (
                  <button
                    key={tool.type}
                    onClick={() => handleToolClick(tool)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1 px-2 py-2 text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">结构辅助</p>
              <div className="grid grid-cols-3 gap-2">
                {ADVANCED_TOOLS.slice(5).map(tool => (
                  <button
                    key={tool.type}
                    onClick={() => handleToolClick(tool)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1 px-2 py-2 text-xs bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'references' && (
          <div>
            <button
              onClick={() => handleToolClick({ type: 'references', label: '资料', icon: '🔗', needsSelection: false })}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '搜索中...' : '🔗 搜索参考资料'}
            </button>
            <p className="mt-2 text-xs text-gray-400">基于当前文章内容，自动搜索相关资料方向</p>
          </div>
        )}

        {activeTab === 'structure' && (
          <div className="space-y-2">
            <button
              onClick={() => handleToolClick({ type: 'analyze-structure', label: '结构分析', icon: '📊', needsSelection: false })}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '分析中...' : '📊 分析文章结构'}
            </button>
            <button
              onClick={() => handleToolClick({ type: 'logic-optimize', label: '逻辑优化', icon: '💭', needsSelection: false })}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              💭 逻辑优化建议
            </button>
            <button
              onClick={() => handleToolClick({ type: 'core-idea', label: '中心思想', icon: '🎯', needsSelection: false })}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              🎯 提炼中心思想
            </button>
          </div>
        )}

        {/* 结果区域 */}
        {(result || isLoading) && (
          <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {isLoading ? `${currentTool}处理中...` : '处理结果'}
              </span>
              {result && !isLoading && !result.startsWith('⚠️') && !result.startsWith('❌') && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    📋 复制
                  </button>
                  <button onClick={handleApply} className="text-xs text-blue-500 hover:text-blue-700">
                    ✅ 应用到编辑器
                  </button>
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {isLoading && !result ? (
                <span className="animate-pulse">正在生成...</span>
              ) : result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

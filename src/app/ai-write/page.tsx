'use client';

import { useState, useCallback } from 'react';
import { useBlogWriter } from '@/hooks/use-blog-writer';
import { useAdmin } from '@/hooks/use-admin';
import { ChatPanel, PreviewPanel, PhaseIndicator, DraftList, AdminLogin } from '@/components/blog-agent';
import ModeSwitcher, { WriteMode, ArticleType } from '@/components/blog-agent/ModeSwitcher';
import AssistPanel from '@/components/blog-agent/AssistPanel';

export default function AIWritePage() {
  const [mode, setMode] = useState<WriteMode>('generate');
  const [articleType, setArticleType] = useState<ArticleType>('tech-blog');
  const [assistContent, setAssistContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);

  const {
    phase, title, corePoints, outline, markdown, chatHistory, isLoading, draftId,
    setPhase, setTitle, setOutline, setMarkdown,
    addChatMessage, captureIdea, generateOutline, generateSection, polishText,
    saveDraft, loadDraft, publishPost, reset,
  } = useBlogWriter({ isAdmin: false });

  const { isAdmin, login, logout } = useAdmin();

  const handleApplyAssistResult = useCallback((text: string) => {
    if (selectedText && assistContent.includes(selectedText)) {
      setAssistContent(prev => prev.replace(selectedText, text));
    } else {
      setAssistContent(prev => prev + '\n\n' + text);
    }
    setSelectedText('');
  }, [selectedText, assistContent]);

  const handleTextSelect = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      setSelectedText(sel.toString().trim());
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ModeSwitcher
        mode={mode}
        articleType={articleType}
        onModeChange={setMode}
        onArticleTypeChange={setArticleType}
      />

      <div className="flex flex-1 overflow-hidden">
        {mode === 'generate' ? (
          <>
            <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600">✅ 管理员模式</span>
                    <button onClick={() => setShowDrafts(true)} className="text-xs text-blue-500 hover:text-blue-700">📝 草稿</button>
                    <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500">退出</button>
                  </div>
                ) : (
                  <button onClick={() => setShowLogin(true)} className="text-xs text-blue-500 hover:text-blue-700">
                    🔐 管理员登录
                  </button>
                )}
              </div>

              <PhaseIndicator currentPhase={phase} />

              <ChatPanel
                phase={phase}
                chatHistory={chatHistory}
                corePoints={corePoints}
                isLoading={isLoading}
                outline={outline}
                isAdmin={isAdmin}
                onSendMessage={(msg: string) => {
                  if (phase === 'capture') {
                    captureIdea(msg);
                  } else {
                    addChatMessage({ id: Date.now().toString(), role: 'user', content: msg, timestamp: Date.now() });
                  }
                }}
                onGenerateOutline={generateOutline}
                onGenerateSection={generateSection}
                onPolishText={polishText}
              />
            </div>

            <div className="w-1/2 flex flex-col">
              <PreviewPanel
                title={title}
                outline={outline}
                markdown={markdown}
                phase={phase}
                onTitleChange={setTitle}
                isAdmin={isAdmin}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-3/5 flex flex-col border-r border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="文章标题..."
                  className="text-lg font-semibold bg-transparent border-0 outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 w-full"
                />
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-4 whitespace-nowrap">
                  {selectedText && <span className="text-blue-500">已选中 {selectedText.length} 字</span>}
                  <span>{assistContent.length} 字</span>
                </div>
              </div>

              <textarea
                value={assistContent}
                onChange={(e) => setAssistContent(e.target.value)}
                onSelect={handleTextSelect}
                onMouseUp={handleTextSelect}
                placeholder={"在这里开始写作...\n\n选中文字后，点击右侧AI工具即可辅助处理。\n也可以直接输入内容，让AI帮你续写、生成大纲等。"}
                className="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none outline-none font-mono text-sm leading-relaxed"
              />
            </div>

            <div className="w-2/5 flex flex-col bg-white dark:bg-gray-800">
              <AssistPanel
                selectedText={selectedText}
                fullContent={assistContent}
                articleType={articleType}
                onApplyResult={handleApplyAssistResult}
              />
            </div>
          </>
        )}
      </div>

      {showLogin && (
        <AdminLogin
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={async (password: string) => {
            const ok = await login(password);
            if (ok) setShowLogin(false);
            return ok;
          }}
        />
      )}

      {showDrafts && isAdmin && (
        <DraftList
          isOpen={showDrafts}
          onClose={() => setShowDrafts(false)}
          currentDraftId={draftId}
          onLoadDraft={loadDraft}
          onDeleteDraft={async () => {}}
          onNewDraft={reset}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useBlogWriter } from '@/hooks/use-blog-writer';
import { PhaseIndicator } from '@/components/blog-agent/PhaseIndicator';
import { ChatPanel } from '@/components/blog-agent/ChatPanel';
import { PreviewPanel } from '@/components/blog-agent/PreviewPanel';
import { AdminLogin } from '@/components/blog-agent/AdminLogin';
import { DraftList } from '@/components/blog-agent/DraftList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Save, Upload, LogOut, Menu } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';

export default function AIWritePage() {
  const { isAdmin, isLoading: adminLoading, login, logout } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    phase,
    title,
    corePoints,
    outline,
    markdown,
    chatHistory,
    isLoading,
    draftId,
    setPhase,
    setTitle,
    captureIdea,
    generateOutline,
    generateSection,
    polishText,
    saveDraft,
    loadDraft,
    publishPost,
    reset
  } = useBlogWriter({ isAdmin });

  // 自动保存
  useEffect(() => {
    if (!isAdmin || !draftId || !markdown) return;

    const timer = setTimeout(() => {
      saveDraft();
    }, 3000);

    return () => clearTimeout(timer);
  }, [markdown, isAdmin, draftId, saveDraft]);

  const handleSendMessage = useCallback(async (message: string) => {
    await captureIdea(message);
  }, [captureIdea]);

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('请先登录管理员');
      return;
    }
    
    setIsSaving(true);
    try {
      await saveDraft();
      toast.success('草稿已保存');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!isAdmin) {
      toast.error('请先登录管理员');
      return;
    }
    
    if (!markdown) {
      toast.error('没有可发布的内容');
      return;
    }
    
    setIsPublishing(true);
    try {
      const slug = await publishPost();
      toast.success('发布成功！', {
        description: '正在跳转到文章页面...'
      });
      setTimeout(() => {
        window.location.href = `/blog/${slug}`;
      }, 1500);
    } catch (error: any) {
      toast.error('发布失败', {
        description: error.message
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleNewDraft = () => {
    if (markdown && !confirm('确定要放弃当前内容并开始新草稿吗？')) {
      return;
    }
    reset();
    setShowDrafts(false);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">AI 写作助手</h1>
            <PhaseIndicator 
              currentPhase={phase} 
              onPhaseClick={(p) => {
                if (p !== 'capture') setPhase(p);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* 移动端切换按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* 管理员操作 */}
            {isAdmin ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDrafts(true)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  草稿
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !markdown}
                >
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={isPublishing || !markdown || phase !== 'done'}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  发布
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowLogin(true)}>
                管理员登录
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1">
        {/* 桌面端：左右分栏 */}
        <div className="hidden md:block h-[calc(100vh-3.5rem)]">
          <Group orientation="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <ChatPanel
                phase={phase}
                chatHistory={chatHistory}
                corePoints={corePoints}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onGenerateOutline={generateOutline}
                onGenerateSection={generateSection}
                onPolishText={polishText}
                outline={outline}
                isAdmin={isAdmin}
              />
            </Panel>
            <Separator />
            <Panel defaultSize={50} minSize={30}>
              <PreviewPanel
                markdown={markdown}
                title={title}
                outline={outline}
                phase={phase}
                onTitleChange={setTitle}
                isAdmin={isAdmin}
              />
            </Panel>
          </Group>
        </div>

        {/* 移动端：可切换视图 */}
        <div className="md:hidden h-[calc(100vh-3.5rem)]">
          {showMobilePreview ? (
            <PreviewPanel
              markdown={markdown}
              title={title}
              outline={outline}
              phase={phase}
              onTitleChange={setTitle}
              isAdmin={isAdmin}
            />
          ) : (
            <ChatPanel
              phase={phase}
              chatHistory={chatHistory}
              corePoints={corePoints}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onGenerateOutline={generateOutline}
              onGenerateSection={generateSection}
              onPolishText={polishText}
              outline={outline}
              isAdmin={isAdmin}
            />
          )}
          {/* 移动端底部切换 */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background border rounded-full px-2 py-1 shadow-lg">
            <Button
              size="sm"
              variant={!showMobilePreview ? 'secondary' : 'ghost'}
              onClick={() => setShowMobilePreview(false)}
            >
              对话
            </Button>
            <Button
              size="sm"
              variant={showMobilePreview ? 'secondary' : 'ghost'}
              onClick={() => setShowMobilePreview(true)}
            >
              预览
            </Button>
          </div>
        </div>
      </main>

      {/* 对话框 */}
      <AdminLogin
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={login}
      />
      <DraftList
        isOpen={showDrafts}
        onClose={() => setShowDrafts(false)}
        currentDraftId={draftId}
        onLoadDraft={loadDraft}
        onDeleteDraft={async (id) => {
          await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
        }}
        onNewDraft={handleNewDraft}
      />
    </div>
  );
}

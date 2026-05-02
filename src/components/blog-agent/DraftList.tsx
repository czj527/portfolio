'use client';

import { useState, useEffect } from 'react';
import { Draft } from '@/lib/ai/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FileText, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DraftListProps {
  isOpen: boolean;
  onClose: () => void;
  currentDraftId: string | null;
  onLoadDraft: (id: string) => void;
  onDeleteDraft: (id: string) => void;
  onNewDraft: () => void;
}

export function DraftList({
  isOpen,
  onClose,
  currentDraftId,
  onLoadDraft,
  onDeleteDraft,
  onNewDraft
}: DraftListProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDrafts();
    }
  }, [isOpen]);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/drafts');
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = (id: string) => {
    onLoadDraft(id);
    onClose();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个草稿吗？')) return;
    
    try {
      await fetch(`/api/drafts/${id}`, { method: 'DELETE' });
      setDrafts(prev => prev.filter(d => d.id !== id));
      if (id === currentDraftId) {
        onNewDraft();
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            草稿列表
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">加载中...</p>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">暂无草稿</p>
              <Button onClick={onNewDraft} variant="outline">
                开始新草稿
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    draft.id === currentDraftId
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {draft.title || '无标题'}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLoad(draft.id)}
                    >
                      加载
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(draft.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
          <Button onClick={onNewDraft}>
            新建草稿
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

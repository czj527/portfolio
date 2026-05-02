'use client';

import { useState, useCallback, useRef } from 'react';
import { WritingPhase, ChatMessage, OutlineItem, Draft } from '@/lib/ai/types';

interface UseBlogWriterOptions {
  isAdmin?: boolean;
  draftId?: string;
}

interface UseBlogWriterReturn {
  phase: WritingPhase;
  title: string;
  corePoints: string[];
  outline: OutlineItem[];
  markdown: string;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  draftId: string | null;
  setPhase: (phase: WritingPhase) => void;
  setTitle: (title: string) => void;
  setCorePoints: (points: string[]) => void;
  setOutline: (outline: OutlineItem[]) => void;
  updateOutlineItem: (id: string, updates: Partial<OutlineItem>) => void;
  setMarkdown: (markdown: string) => void;
  appendMarkdown: (content: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  captureIdea: (idea: string) => Promise<void>;
  generateOutline: () => Promise<void>;
  generateSection: (sectionId: string) => Promise<void>;
  polishText: () => Promise<void>;
  saveDraft: () => Promise<void>;
  loadDraft: (id: string) => Promise<void>;
  publishPost: () => Promise<string>;
  reset: () => void;
}

export function useBlogWriter({ isAdmin = false, draftId: initialDraftId }: UseBlogWriterOptions = {}): UseBlogWriterReturn {
  const [phase, setPhase] = useState<WritingPhase>('capture');
  const [title, setTitle] = useState('');
  const [corePoints, setCorePoints] = useState<string[]>([]);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(initialDraftId || null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const appendMarkdown = useCallback((content: string) => {
    setMarkdown(prev => prev + content + '\n\n');
  }, []);

  const updateOutlineItem = useCallback((id: string, updates: Partial<OutlineItem>) => {
    setOutline(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      if (item.children) {
        return {
          ...item,
          children: item.children.map(child => 
            child.id === id ? { ...child, ...updates } : child
          )
        };
      }
      return item;
    }));
  }, []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatHistory(prev => [...prev, message]);
  }, []);

  const captureIdea = useCallback(async (idea: string) => {
    setIsLoading(true);
    addChatMessage({ id: Date.now().toString(), role: 'user', content: idea, timestamp: Date.now() });

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/ai/capture-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, chatHistory }),
        signal: abortControllerRef.current.signal
      });

      let fullResponse = '';
      let result: any = null;

      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'chunk') {
                  fullResponse += parsed.content;
                } else if (parsed.type === 'complete') {
                  result = parsed.data;
                }
              } catch (e) {
                // ignore parse errors
              }
            }
          }
        }
      }

      addChatMessage({ id: Date.now().toString(), role: 'assistant', content: fullResponse || JSON.stringify(result), timestamp: Date.now() });

      if (result?.core_points) {
        setCorePoints(result.core_points);
        if (result.summary) {
          addChatMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: `总结：${result.summary}`, timestamp: Date.now() });
        }
        setPhase('outline');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        addChatMessage({ id: Date.now().toString(), role: 'assistant', content: `出错了：${error.message}`, timestamp: Date.now() });
      }
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory, addChatMessage]);

  const generateOutline = useCallback(async () => {
    if (corePoints.length === 0) return;

    setIsLoading(true);
    let fullOutline = '';

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corePoints, title }),
        signal: abortControllerRef.current.signal
      });

      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'chunk') {
                  fullOutline += parsed.content;
                } else if (parsed.type === 'complete' && parsed.data?.outline) {
                  setOutline(parsed.data.outline);
                  if (parsed.data.title) {
                    setTitle(parsed.data.title);
                  }
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }

      // 如果流式没有解析到完整数据，尝试解析累积的文本
      if (outline.length === 0 && fullOutline) {
        try {
          const jsonMatch = fullOutline.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.outline) {
              setOutline(parsed.outline);
              if (parsed.title) setTitle(parsed.title);
            }
          }
        } catch (e) {
          // ignore
        }
      }

      if (outline.length > 0) {
        setPhase('writing');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Generate outline failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [corePoints, title, outline.length]);

  const generateSection = useCallback(async (sectionId: string) => {
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();
      
      // 找到对应的章节
      const section = outline.find(item => item.id === sectionId);
      if (!section) return;

      // 获取前文内容
      const previousContent = markdown.slice(-500);
      
      // 获取下一章节
      const sectionIndex = outline.findIndex(item => item.id === sectionId);
      const nextSection = outline[sectionIndex + 1];

      const response = await fetch('/api/ai/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: section.title,
          sectionDescription: section.description,
          previousContent,
          nextSection: nextSection?.title
        }),
        signal: abortControllerRef.current.signal
      });

      let sectionContent = `## ${section.title}\n\n`;
      const reader = response.body?.getReader();
      
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'chunk') {
                  sectionContent += parsed.content;
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }

      appendMarkdown(sectionContent);
      
      // 更新大纲项
      updateOutlineItem(sectionId, { content: sectionContent });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Generate section failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [outline, markdown, appendMarkdown, updateOutlineItem]);

  const polishText = useCallback(async () => {
    if (!markdown) return;

    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/ai/polish-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown }),
        signal: abortControllerRef.current.signal
      });

      let polishedContent = '';
      const reader = response.body?.getReader();
      
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'chunk') {
                  polishedContent += parsed.content;
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }

      if (polishedContent) {
        setMarkdown(polishedContent);
        setPhase('done');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Polish text failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [markdown]);

  const saveDraft = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const payload = {
        title,
        content: markdown,
        outline,
        current_phase: phase,
        chat_history: chatHistory
      };

      if (draftId) {
        await fetch(`/api/drafts/${draftId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        const res = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.draft?.id) {
          setDraftId(data.draft.id);
        }
      }
    } catch (error) {
      console.error('Save draft failed:', error);
    }
  }, [isAdmin, draftId, title, markdown, outline, phase, chatHistory]);

  const loadDraft = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/drafts/${id}`);
      const data = await res.json();
      
      if (data.draft) {
        const draft: Draft = data.draft;
        setTitle(draft.title || '');
        setMarkdown(draft.content || '');
        setOutline(draft.outline || []);
        setPhase(draft.current_phase || 'capture');
        setChatHistory(draft.chat_history || []);
        setDraftId(draft.id);
      }
    } catch (error) {
      console.error('Load draft failed:', error);
    }
  }, []);

  const publishPost = useCallback(async (): Promise<string> => {
    if (!isAdmin || !markdown) throw new Error('Not authorized or no content');

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        markdown,
        excerpt: markdown.slice(0, 200),
        draft_id: draftId
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    return data.post.slug;
  }, [isAdmin, markdown, title, draftId]);

  const reset = useCallback(() => {
    setPhase('capture');
    setTitle('');
    setCorePoints([]);
    setOutline([]);
    setMarkdown('');
    setChatHistory([]);
    setDraftId(null);
  }, []);

  return {
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
    setCorePoints,
    setOutline,
    updateOutlineItem,
    setMarkdown,
    appendMarkdown,
    addChatMessage,
    captureIdea,
    generateOutline,
    generateSection,
    polishText,
    saveDraft,
    loadDraft,
    publishPost,
    reset
  };
}

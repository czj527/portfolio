// 写作阶段
export type WritingPhase = 
  | 'capture'      // 捕捉想法
  | 'outline'       // 生成大纲
  | 'writing'       // 分段写作
  | 'polishing'     // 润色
  | 'done';         // 完成

// 对话消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// 大纲项
export interface OutlineItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  children?: OutlineItem[];
}

// 草稿
export interface Draft {
  id: string;
  owner_id: string;
  title: string | null;
  content: string;
  outline: OutlineItem[];
  current_phase: WritingPhase;
  chat_history: ChatMessage[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_deleted: boolean;
}

// 已发布文章
export interface Post {
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
  is_published: boolean;
}

// 想法
export interface Idea {
  id: string;
  content: string;
  source: string;
  tags: string[];
  created_at: string;
  used_in_posts: string[];
}

// API请求类型
export interface CaptureIdeaRequest {
  idea: string;
  chatHistory?: ChatMessage[];
}

export interface GenerateOutlineRequest {
  corePoints: string[];
  title?: string;
}

export interface GenerateSectionRequest {
  sectionTitle: string;
  sectionDescription?: string;
  previousContent?: string;
  nextSection?: OutlineItem;
  markdown?: string;
}

export interface PolishTextRequest {
  content: string;
  style?: 'concise' | 'detailed' | 'academic' | 'casual';
}

export interface ResolveAmbiguityRequest {
  originalIdea: string;
  question: string;
  context?: string;
}

// AI流式响应
export interface AIStreamResponse {
  content: string;
  done: boolean;
  error?: string;
}

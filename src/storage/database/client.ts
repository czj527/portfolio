import { createClient } from '@supabase/supabase-js';
import type { Project, Blog, InsertProject, InsertBlog, GuestbookMessage, InsertGuestbookMessage } from "./shared/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Guestbook Messages Functions
// ============================================

export async function createGuestbookMessage(message: InsertGuestbookMessage & { emoji?: string }) {
  const { data, error } = await supabase
    .from('guestbook_messages')
    .insert({
      name: message.name,
      email: message.email,
      content: message.content,
      emoji: message.emoji || '😀',
      likes: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GuestbookMessage;
}

export async function getAllGuestbookMessages(): Promise<GuestbookMessage[]> {
  const { data, error } = await supabase
    .from('guestbook_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GuestbookMessage[];
}

export async function deleteGuestbookMessage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('guestbook_messages')
    .delete()
    .eq('id', id);

  return !error;
}

export async function likeGuestbookMessage(id: string): Promise<GuestbookMessage | null> {
  const { data: current } = await supabase
    .from('guestbook_messages')
    .select('likes')
    .eq('id', id)
    .single();

  if (!current) return null;

  const { data, error } = await supabase
    .from('guestbook_messages')
    .update({ likes: (current.likes || 0) + 1 })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as GuestbookMessage;
}

export async function getGuestbookMessageStats() {
  const { count, error } = await supabase
    .from('guestbook_messages')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

// ============================================
// Projects Functions
// ============================================

export async function createProject(project: InsertProject): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: project.name,
      description: project.description,
      tags: project.tags || [],
      link: project.link,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Project;
}

export async function updateProject(id: string, project: Partial<InsertProject>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update({
      name: project.name,
      description: project.description,
      tags: project.tags,
      link: project.link,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  return !error;
}

export async function getProjectStats() {
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

// ============================================
// Blogs Functions
// ============================================

export async function createBlog(blog: InsertBlog): Promise<Blog> {
  const { data, error } = await supabase
    .from('blogs')
    .insert({
      name: blog.name,
      description: blog.description,
      tags: blog.tags || [],
      link: blog.link,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Blog;
}

export async function getAllBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Blog[];
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Blog;
}

export async function updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .update({
      name: blog.name,
      description: blog.description,
      tags: blog.tags,
      link: blog.link,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data as Blog;
}

export async function deleteBlog(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  return !error;
}

export async function getBlogStats() {
  const { count, error } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
}

import { supabase } from './supabase';
import { dbCommentToComment, type DbCommentRow } from './types';
import type { Comment } from './postModels';

export async function fetchCommentsForPost(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      post_id,
      user_id,
      text,
      created_at,
      profiles (display_name, avatar_initial)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as DbCommentRow[]).map(dbCommentToComment);
}

export async function addComment(postId: string, userId: string, text: string): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, text: text.trim() })
    .select(`
      id,
      post_id,
      user_id,
      text,
      created_at,
      profiles (display_name, avatar_initial)
    `)
    .single();

  if (error) throw error;

  return dbCommentToComment(data as DbCommentRow);
}

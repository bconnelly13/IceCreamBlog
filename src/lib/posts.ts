import { supabase } from './supabase';
import { dbPostToPost, postToDbRow, type DbPost } from './types';
import { fetchReactionsForPosts } from './reactions';
import type { Post } from './postModels';

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as DbPost[];
  const reactionsByPost = await fetchReactionsForPosts(rows.map(r => r.id));

  return rows.map(row =>
    dbPostToPost(row, reactionsByPost.get(row.id) ?? [], []),
  );
}

export async function upsertPost(post: Post): Promise<Post> {
  const row = postToDbRow(post);
  const { data, error } = await supabase
    .from('posts')
    .upsert(row)
    .select('*')
    .single();

  if (error) throw error;

  return dbPostToPost(data as DbPost, post.reactions, post.comments);
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

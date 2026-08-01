import { supabase } from './supabase';
import { dbPostToPost, postToDbRow, type DbPost } from './types';
import { fetchReactionsForPosts } from './reactions';
import type { Post } from './postModels';

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

async function fetchNamedOptions(table: 'flavors' | 'tags'): Promise<string[]> {
  const { data, error } = await supabase
    .from(table)
    .select('name')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => row.name as string);
}

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

export async function fetchFlavorOptions(): Promise<string[]> {
  return fetchNamedOptions('flavors');
}

export async function fetchTagOptions(): Promise<string[]> {
  return fetchNamedOptions('tags');
}

export async function upsertPost(post: Post): Promise<Post> {
  const normalizedPost: Post = {
    ...post,
    flavors: uniqueStrings(post.flavors),
    tags: uniqueStrings(post.tags),
  };

  const row = postToDbRow(normalizedPost);
  const { data, error } = await supabase
    .rpc('upsert_post_with_taxonomy', { post_data: row })
    .single();

  if (error) throw error;

  return dbPostToPost(data as DbPost, post.reactions, post.comments);
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_post_with_taxonomy', {
    post_id: id,
  });
  if (error) throw error;
}

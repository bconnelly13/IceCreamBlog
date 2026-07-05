import { supabase } from './supabase';
import { aggregateReactions, type DbPostReactionRow } from './types';
import type { Post } from './postModels';

export async function fetchReactionsForPosts(postIds: string[]): Promise<Map<string, Post['reactions']>> {
  const map = new Map<string, Post['reactions']>();
  if (postIds.length === 0) return map;

  const { data, error } = await supabase
    .from('post_reactions')
    .select('post_id, emoji')
    .in('post_id', postIds);

  if (error) throw error;

  const grouped = new Map<string, { emoji: string }[]>();
  for (const row of data ?? []) {
    const list = grouped.get(row.post_id) ?? [];
    list.push({ emoji: row.emoji });
    grouped.set(row.post_id, list);
  }

  for (const id of postIds) {
    map.set(id, aggregateReactions(grouped.get(id) ?? []));
  }

  return map;
}

export async function fetchPostReactionState(
  postId: string,
  userId?: string,
): Promise<{ reactions: Post['reactions']; userReactions: Set<string> }> {
  const { data, error } = await supabase
    .from('post_reactions')
    .select('post_id, user_id, emoji')
    .eq('post_id', postId);

  if (error) throw error;

  const rows = (data ?? []) as DbPostReactionRow[];
  const userReactions = new Set<string>();

  if (userId) {
    for (const row of rows) {
      if (row.user_id === userId) userReactions.add(row.emoji);
    }
  }

  return {
    reactions: aggregateReactions(rows),
    userReactions,
  };
}

export async function togglePostReaction(
  postId: string,
  userId: string,
  emoji: string,
  alreadyReacted: boolean,
): Promise<void> {
  if (alreadyReacted) {
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('emoji', emoji);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('post_reactions').insert({
    post_id: postId,
    user_id: userId,
    emoji,
  });
  if (error) throw error;
}

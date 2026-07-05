import type { Comment, Post, Ratings } from './postModels';

export interface DbPost {
  id: string;
  title: string;
  shop_name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  date: string;
  flavors: string[];
  price: number;
  photos: string[];
  ratings: Ratings;
  description: string;
  tags: string[];
}

export interface DbProfile {
  id: string;
  display_name: string;
  avatar_initial: string;
  role: 'user' | 'admin';
}

export interface DbCommentRow {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string;
  profiles: Pick<DbProfile, 'display_name' | 'avatar_initial'> | null;
}

export interface DbPostReactionRow {
  post_id: string;
  user_id: string;
  emoji: string;
}

export function dbPostToPost(
  row: DbPost,
  reactions: Post['reactions'] = [],
  comments: Comment[] = [],
): Post {
  return {
    id: row.id,
    title: row.title,
    shopName: row.shop_name,
    address: row.address,
    city: row.city,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    date: row.date,
    flavors: row.flavors,
    price: Number(row.price),
    photos: row.photos,
    ratings: row.ratings,
    description: row.description,
    tags: row.tags,
    reactions,
    comments,
  };
}

export function postToDbRow(post: Post): DbPost {
  return {
    id: post.id,
    title: post.title,
    shop_name: post.shopName,
    address: post.address,
    city: post.city,
    state: post.state,
    lat: post.lat,
    lng: post.lng,
    date: post.date,
    flavors: post.flavors,
    price: post.price,
    photos: post.photos,
    ratings: post.ratings,
    description: post.description,
    tags: post.tags,
  };
}

export function dbCommentToComment(row: DbCommentRow): Comment {
  return {
    id: row.id,
    author: row.profiles?.display_name ?? 'User',
    avatar: row.profiles?.avatar_initial ?? '?',
    text: row.text,
    date: row.created_at.split('T')[0],
    reactions: [],
  };
}

export function aggregateReactions(rows: { emoji: string }[]): Post['reactions'] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.emoji, (counts.get(row.emoji) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count);
}

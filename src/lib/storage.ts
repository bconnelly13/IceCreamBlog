import { supabase } from './supabase';

const BUCKET = 'post-photos';

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName;
  }
  const mime = file.type.split('/')[1];
  if (mime === 'jpeg') return 'jpg';
  return mime || 'jpg';
}

export async function uploadPostPhoto(file: File, postId: string): Promise<string> {
  const path = `${postId}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function isStoragePhotoUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/post-photos/');
}

export async function deletePostPhoto(publicUrl: string): Promise<void> {
  if (!isStoragePhotoUrl(publicUrl)) return;

  const marker = '/storage/v1/object/public/post-photos/';
  const path = publicUrl.split(marker)[1];
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([decodeURIComponent(path)]);
  if (error) throw error;
}

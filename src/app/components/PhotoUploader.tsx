import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFiles(files: FileList | File[]) {
    const newUrls = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => URL.createObjectURL(f));
    if (newUrls.length) onChange([...photos, ...newUrls]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }

  function removePhoto(idx: number) {
    onChange(photos.filter((_, i) => i !== idx));
  }

  function moveToFront(idx: number) {
    const next = [...photos];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed transition-all"
        style={{
          borderColor: isDragging ? '#C1415A' : 'rgba(139,101,88,0.3)',
          background: isDragging ? '#FDE8EF' : '#FDF0E8',
          cursor: 'pointer',
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: isDragging ? '#C1415A' : '#F5EAE0' }}
        >
          <Upload size={22} color={isDragging ? '#fff' : '#8B6558'} />
        </div>
        <div className="text-center">
          <p style={{ fontSize: 14, fontWeight: 500, color: isDragging ? '#C1415A' : '#1C0E0A' }}>
            {isDragging ? 'Drop to add photos' : 'Drag photos here'}
          </p>
          <p style={{ fontSize: 12, color: '#8B6558', marginTop: 2 }}>
            or <span style={{ color: '#C1415A', textDecoration: 'underline' }}>tap to select from library</span>
          </p>
          <p style={{ fontSize: 11, color: '#8B6558', marginTop: 4 }}>JPEG · PNG · WebP · HEIC</p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => e.target.files && processFiles(e.target.files)}
      />

      {/* Preview grid */}
      {photos.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: '#8B6558', marginBottom: 8 }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''} · tap to set as cover
          </p>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((url, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '1',
                  background: '#F5EAE0',
                  outline: i === 0 ? '2px solid #C1415A' : '2px solid transparent',
                  outlineOffset: 1,
                }}
                onClick={() => moveToFront(i)}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removePhoto(i); }}
                  className="absolute top-1 right-1 p-1 rounded-full"
                  style={{ background: 'rgba(28,14,10,0.65)' }}
                >
                  <X size={11} color="#fff" />
                </button>
                {i === 0 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 text-center py-1"
                    style={{ background: 'rgba(193,65,90,0.85)', color: '#fff', fontSize: 10, fontWeight: 600 }}
                  >
                    Cover
                  </div>
                )}
              </div>
            ))}
            {/* Add more button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed gap-1 transition-colors hover:border-primary"
              style={{ aspectRatio: '1', borderColor: 'rgba(139,101,88,0.25)', background: '#FDF0E8' }}
            >
              <Image size={18} color="#8B6558" />
              <span style={{ fontSize: 10, color: '#8B6558' }}>Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

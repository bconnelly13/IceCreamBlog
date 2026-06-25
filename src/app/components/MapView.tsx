import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Post } from '../data/mockData';

interface MapViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

function avgRating(r: Post['ratings']) {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function createIceCreamIcon(rating: number) {
  const color = rating >= 4.5 ? '#C1415A' : rating >= 3.5 ? '#F59340' : '#8B6558';
  return L.divIcon({
    className: '',
    html: `<div style="
      display:flex;flex-direction:column;align-items:center;
      filter:drop-shadow(0 3px 6px rgba(28,14,10,0.3));
    ">
      <div style="
        background:${color};color:white;
        border-radius:50% 50% 50% 0;
        width:38px;height:38px;
        display:flex;align-items:center;justify-content:center;
        font-size:18px;
        transform:rotate(-45deg);
        border:2.5px solid white;
      ">
        <span style="transform:rotate(45deg);display:block;">🍦</span>
      </div>
    </div>`,
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -48],
  });
}

/* Forces Leaflet to invalidate size after mount */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 50);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export function MapView({ posts, onPostClick }: MapViewProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
  }, []);

  const center: [number, number] = [39.5, -98.35];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-border"
        style={{ background: '#FFF8F2', flexShrink: 0 }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#1C0E0A' }}>
          Ice Cream Map
        </h2>
        <p style={{ fontSize: 13, color: '#8B6558', marginTop: 2 }}>
          {posts.length} location{posts.length !== 1 ? 's' : ''} · tap a pin to explore
        </p>
      </div>

      {/* Map fills remaining space */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <MapContainer
          center={center}
          zoom={4}
          zoomControl={false}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          <MapResizer />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {posts.map(post => {
            const avg = avgRating(post.ratings);
            return (
              <Marker
                key={post.id}
                position={[post.lat, post.lng]}
                icon={createIceCreamIcon(avg)}
              >
                <Popup closeButton={false} className="ice-cream-popup">
                  <div style={{ minWidth: 190, fontFamily: 'var(--font-body)', padding: '4px 0' }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#C1415A', marginBottom: 3 }}>
                      {post.shopName}
                    </p>
                    <p style={{ fontSize: 12, color: '#1C0E0A', marginBottom: 3, fontStyle: 'italic', lineHeight: 1.3 }}>
                      {post.title}
                    </p>
                    <p style={{ fontSize: 11, color: '#8B6558', marginBottom: 6 }}>
                      {post.city}, {post.state}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 10 }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ color: i <= Math.round(avg) ? '#F59340' : '#D4B5A8', fontSize: 13 }}>★</span>
                      ))}
                      <span style={{ fontSize: 11, color: '#8B6558', marginLeft: 2 }}>{avg.toFixed(1)}</span>
                    </div>
                    <button
                      onClick={() => onPostClick(post)}
                      style={{
                        background: '#C1415A', color: '#fff', border: 'none',
                        borderRadius: 10, padding: '7px 14px', fontSize: 12,
                        fontWeight: 600, cursor: 'pointer', width: '100%',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Read post →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div
        className="px-4 py-2 flex gap-4 border-t border-border"
        style={{ background: '#FFF8F2', flexShrink: 0 }}
      >
        <LegendItem color="#C1415A" label="4.5+ stars" />
        <LegendItem color="#F59340" label="3.5–4.4 stars" />
        <LegendItem color="#8B6558" label="Below 3.5" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      <span style={{ fontSize: 11, color: '#8B6558' }}>{label}</span>
    </div>
  );
}

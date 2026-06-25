import { useState } from 'react';
import { X, IceCream2, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_EMAIL = 'admin@thescoop.blog';
  const ADMIN_PASSWORD = 'icecream2025';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (tab === 'login') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin(true);
      } else if (email.includes('@') && password.length >= 6) {
        onLogin(false);
      } else {
        setError('Invalid credentials. Try any email + 6+ char password.');
      }
    } else {
      if (!name) { setError('Please enter your name.'); return; }
      if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      onLogin(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(28,14,10,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 60px rgba(28,14,10,0.2)' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 relative text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
            <X size={18} color="#8B6558" />
          </button>
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#FDE8EF' }}>
              <IceCream2 size={28} color="#C1415A" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#1C0E0A' }}>
            {tab === 'login' ? 'Welcome back' : 'Join the crew'}
          </h2>
          <p style={{ fontSize: 13, color: '#8B6558', marginTop: 4 }}>
            {tab === 'login' ? 'Sign in to react and leave comments' : 'Create an account to join the conversation'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-6 flex rounded-xl p-1 mb-5" style={{ background: '#F5EAE0' }}>
          {(['login', 'signup'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === t ? '#C1415A' : 'transparent',
                color: tab === t ? '#fff' : '#8B6558',
              }}
            >
              {t === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#8B6558' }}>Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm transition-colors"
                style={{ background: '#FDF0E8', color: '#1C0E0A', fontFamily: 'var(--font-body)' }}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#8B6558' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm transition-colors"
              style={{ background: '#FDF0E8', color: '#1C0E0A', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#8B6558' }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-border outline-none focus:border-primary text-sm transition-colors"
                style={{ background: '#FDF0E8', color: '#1C0E0A', fontFamily: 'var(--font-body)' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff size={16} color="#8B6558" /> : <Eye size={16} color="#8B6558" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#FDE8EF', color: '#C1415A' }}>{error}</p>
          )}

          {tab === 'login' && (
            <p className="text-xs" style={{ color: '#8B6558' }}>
              Admin credentials: <span style={{ fontFamily: 'monospace', color: '#C1415A' }}>admin@thescoop.blog / icecream2025</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: '#C1415A', color: '#fff', marginTop: 4 }}
          >
            {tab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

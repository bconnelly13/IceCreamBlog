import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder: string;
}

export function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border text-sm transition-all"
        style={{
          background: '#FDF0E8',
          color: selected ? '#1C0E0A' : '#8B6558',
          borderColor: open ? '#C1415A' : 'rgba(139,101,88,0.2)',
          fontFamily: 'var(--font-body)',
          textAlign: 'left',
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={14}
          color="#8B6558"
          style={{ flexShrink: 0, marginLeft: 4, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 200,
            background: '#FFFFFF',
            borderRadius: 14,
            border: '1px solid rgba(139,101,88,0.18)',
            boxShadow: '0 8px 32px rgba(28,14,10,0.14), 0 2px 8px rgba(28,14,10,0.06)',
            overflow: 'hidden',
            maxHeight: 220,
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {/* "All" option */}
          <DropdownOption
            label={placeholder}
            selected={value === ''}
            onClick={() => { onChange(''); setOpen(false); }}
          />
          {options.map(opt => (
            <DropdownOption
              key={opt.value}
              label={opt.label}
              selected={opt.value === value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
      style={{
        background: selected ? '#FDE8EF' : 'transparent',
        color: selected ? '#C1415A' : '#1C0E0A',
        fontFamily: 'var(--font-body)',
        fontWeight: selected ? 600 : 400,
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = '#FFF4EE'; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span>{label}</span>
      {selected && <Check size={14} color="#C1415A" />}
    </button>
  );
}

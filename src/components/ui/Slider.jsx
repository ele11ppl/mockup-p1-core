import { useState, useRef, useCallback } from 'react';

const s = {
  group: { marginBottom: 28 },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    transition: 'color 0.15s',
  },
  value: {
    fontSize: 11, fontWeight: 600, minWidth: 36,
    textAlign: 'right', color: '#000', cursor: 'pointer',
    borderBottom: '1px dashed transparent',
    padding: '1px 2px', transition: 'border-color 0.15s',
  },
  input: {
    width: 52, fontSize: 11, fontWeight: 600,
    textAlign: 'right', color: '#000',
    border: 'none', borderBottom: '1px solid #999',
    outline: 'none', padding: '1px 2px',
    fontFamily: 'inherit', background: 'transparent',
  },
};

export default function Slider({ label, value, min, max, step, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef();

  const clamp = (v) => {
    let n = parseFloat(v);
    if (isNaN(n)) return value;
    n = Math.round(n / step) * step;
    n = parseFloat(n.toFixed(10));
    return Math.max(min, Math.min(max, n));
  };

  const startEdit = useCallback(() => {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }, [value]);

  const confirm = useCallback(() => {
    const clamped = clamp(draft);
    onChange(clamped);
    setEditing(false);
  }, [draft, onChange, clamp]);

  const onKey = (e) => {
    if (e.key === 'Enter') confirm();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div
      style={s.group}
      onMouseEnter={e => {
        const row = e.currentTarget.firstChild;
        if (row) row.style.color = '#333';
      }}
      onMouseLeave={e => {
        const row = e.currentTarget.firstChild;
        if (row) row.style.color = '#000';
      }}
    >
      <div style={s.row}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'inherit' }}>{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={confirm}
            onKeyDown={onKey}
            style={s.input}
          />
        ) : (
          <span
            style={s.value}
            onClick={startEdit}
            onMouseEnter={e => { e.currentTarget.style.borderBottomColor = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
          >
            {value}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(clamp(e.target.value))}
      />
    </div>
  );
}

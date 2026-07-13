import { useState } from 'react';
import { compressImage } from '../../utils/compressImage';

const s = {
  btn: {
    display: 'block', width: '100%', padding: '8px 0', fontSize: 12,
    fontWeight: 500, color: '#000', background: 'transparent',
    border: '1px solid #ccc', cursor: 'pointer', textAlign: 'center',
    fontFamily: 'inherit', marginBottom: 6,
    transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
  },
};

export default function UploadBtn({ label, onUpload }) {
  const [busy, setBusy] = useState(false);

  const handle = async (file) => {
    setBusy(true);
    try {
      const compressed = await compressImage(file, 2048);
      onUpload(URL.createObjectURL(compressed));
    } catch {
      onUpload(URL.createObjectURL(file));
    } finally {
      setBusy(false);
    }
  };

  return (
    <label
      style={{ ...s.btn, opacity: busy ? 0.5 : 1, cursor: busy ? 'wait' : 'pointer' }}
      onMouseEnter={e => {
        if (busy) return;
        e.currentTarget.style.background = '#f5f5f5';
        e.currentTarget.style.borderColor = '#999';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = '#ccc';
      }}
      onMouseDown={e => { if (!busy) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {busy ? 'PROCESSING...' : label}
      <input type="file" accept="image/*" style={{ display: 'none' }}
        disabled={busy}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
    </label>
  );
}

export default function Navbar({ title = '' }) {
  return (
    <div style={{
      height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px', borderBottom: '1px solid #e5e5e5', flexShrink: 0,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 500, color: '#999', letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>
        {title}
      </span>
    </div>
  );
}

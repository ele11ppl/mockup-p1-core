import { Link } from 'react-router-dom';

const isP1 = import.meta.env.VITE_BUILD_MODE === 'p1_only';

export default function Navbar({ backTo = '/', backLabel = '← INDEX', title = '' }) {
  return (
    <div style={{
      height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', borderBottom: '1px solid #e5e5e5', flexShrink: 0,
    }}>
      {isP1 ? <span /> : (
        <Link to={backTo} style={{
          fontSize: 13, fontWeight: 600, color: '#000', textDecoration: 'none', letterSpacing: '0.04em',
        }}>
          {backLabel}
        </Link>
      )}
      <span style={{
        fontSize: 10, fontWeight: 500, color: '#999', letterSpacing: '0.2em', textTransform: 'uppercase',
      }}>
        {title}
      </span>
      <span style={{ width: 40 }} />
    </div>
  );
}

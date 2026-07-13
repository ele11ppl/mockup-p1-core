import { useFrame } from '@react-three/fiber';

export function HudInner({ hudRef }) {
  useFrame(({ camera }) => {
    if (hudRef.current) {
      const p = camera.position;
      hudRef.current.innerText = `X: ${p.x.toFixed(2)} | Y: ${p.y.toFixed(2)} | Z: ${p.z.toFixed(2)}`;
    }
  });
  return null;
}

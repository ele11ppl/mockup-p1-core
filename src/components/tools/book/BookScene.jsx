import { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox, useTexture } from '@react-three/drei';

export default function BookScene({ config }) {
  const {
    width = 15, height = 21, coverThickness = 0.02, pageThickness = 1.6,
    coverColor = '#000000', pageEdgeColor = '#f5f5dc', ambientIntensity = 0.6, bookRoughness = 0.5,
    materialIntensity = 1,
    shadowOpacity = 0.4, shadowColor = '#000000',
    shadowSpread = 0, shadowSize = 10, shadowOffX = 10, shadowOffY = 10,
    bookPosX = 0, bookPosY = 0, bookPosZ = 0,
    bindingPreset = 'default',
    frontTextureUrl = null, backTextureUrl = null, spineTextureUrl = null,
  } = config;

  const bp = bindingPreset;

  // Static textures
  const BASE = import.meta.env.BASE_URL;
  const hardTex     = useTexture(BASE + 'texture/Hardcover.png');
  const perfectTex  = useTexture(BASE + 'texture/Perfectbinding.png');
  const smythTex    = useTexture(BASE + 'texture/Smythsewing.png');
  const hard2Tex    = useTexture(BASE + 'texture/Hardcover2.png');
  const perfect2Tex = useTexture(BASE + 'texture/Perfectbinding2.png');
  [hardTex, perfectTex, smythTex, hard2Tex, perfect2Tex].forEach(t => t.colorSpace = THREE.SRGBColorSpace);

  // Generated page-lines texture (replaces page.png)
  const pageTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 8;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1, 8);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, 1, 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 40);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Dynamic user textures
  const [frontU, setFrontU] = useState(null);
  const [backU,  setBackU]  = useState(null);
  const [spineU, setSpineU] = useState(null);
  useEffect(() => { if (!frontTextureUrl) setFrontU(null); else new THREE.TextureLoader().load(frontTextureUrl, t => { t.colorSpace = THREE.SRGBColorSpace; setFrontU(t); }); }, [frontTextureUrl]);
  useEffect(() => { if (!backTextureUrl) setBackU(null); else new THREE.TextureLoader().load(backTextureUrl, t => { t.colorSpace = THREE.SRGBColorSpace; setBackU(t); }); }, [backTextureUrl]);
  useEffect(() => { if (!spineTextureUrl) setSpineU(null); else new THREE.TextureLoader().load(spineTextureUrl, t => { t.colorSpace = THREE.SRGBColorSpace; setSpineU(t); }); }, [spineTextureUrl]);

  // ── State machine: 4 simple rules ──
  let frontMap = null, backMap = null, spineMap = null;
  let frontOverlay = null, backOverlay = null;

  if (bp === 'default') {
    frontMap = frontU || null;
    backMap  = backU  || null;
    spineMap = spineU || null;
  } else if (bp === 'hardcover') {
    frontMap = frontU || hardTex;
    backMap  = backU  || hardTex;
    spineMap = spineU || null;
    if (frontU) frontOverlay = hard2Tex;
    if (backU)  backOverlay  = hard2Tex;
  } else if (bp === 'perfect') {
    frontMap = frontU || perfectTex;
    backMap  = backU  || perfectTex;
    spineMap = spineU || null;
    if (frontU) frontOverlay = perfect2Tex;
    if (backU)  backOverlay  = perfect2Tex;
  } else if (bp === 'smyth') {
    frontMap = frontU || null;
    backMap  = backU  || null;
    spineMap = smythTex;
  }

  const isDefault = bp === 'default';

  // Geometry
  const COVER_W = width, COVER_H = height;
  const SPINE_W = coverThickness;
  const PAGE_W = COVER_W - SPINE_W - 0.5;
  const PAGE_H = height - 1;
  const PAGE_T = pageThickness;
  const pageX  = (-COVER_W/2 + SPINE_W) + PAGE_W/2;
  const spineX = -(COVER_W/2 - SPINE_W/2);
  const spineY = PAGE_T + 2 * coverThickness;
  const coverY = PAGE_T/2 + coverThickness/2;
  const shadowY = -coverY - coverThickness/2 - 0.015;

  const radius = shadowSize * 0.2 + shadowSpread * 0.02;
  const lRef = useRef();
  useLayoutEffect(() => { if (lRef.current) lRef.current.shadow.radius = radius; }, [radius]);

  const solid = { roughness: isDefault ? materialIntensity : bookRoughness, metalness: 0.2, color: coverColor };
  const overlayOpacity = isDefault ? 1 : materialIntensity;

  return (
    <group position={[bookPosX, bookPosY, bookPosZ]}>
      <ambientLight intensity={ambientIntensity} />
      <mesh position={[0, shadowY, 0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[120,120]} />
        <shadowMaterial transparent opacity={shadowOpacity} color={shadowColor} />
      </mesh>
      <directionalLight ref={lRef} castShadow position={[shadowOffX,25,shadowOffY]} intensity={1.4+shadowSpread*0.005}
        shadow-mapSize={[2048,2048]} shadow-camera-left={-25} shadow-camera-right={25}
        shadow-camera-top={25} shadow-camera-bottom={-25} shadow-camera-near={0.5} shadow-camera-far={80} shadow-bias={-0.0003-shadowSpread*0.00004} />
      <group receiveShadow>
        <mesh position={[pageX,0,0]} castShadow receiveShadow>
          <boxGeometry args={[PAGE_W,PAGE_T,PAGE_H]} />
          <meshStandardMaterial color={pageEdgeColor} roughness={0.9} metalness={0}
            map={isDefault?null:pageTex} />
        </mesh>
        {/* Front cover */}
        <RoundedBox args={[COVER_W,coverThickness,COVER_H]} radius={0.008} position={[0,coverY,0]} castShadow receiveShadow>
          <meshStandardMaterial {...solid} />
        </RoundedBox>
        {frontMap && <mesh position={[0,coverY+coverThickness/2+0.003,0]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[COVER_W-0.02,COVER_H-0.02]} />
          <meshStandardMaterial color="#ffffff" map={frontMap} roughness={isDefault?materialIntensity:0.8} metalness={0}
            polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} /></mesh>}
        {frontOverlay && <mesh position={[0,coverY+coverThickness/2+0.006,0]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[COVER_W-0.08,COVER_H-0.08]} />
          <meshStandardMaterial color="#ffffff" map={frontOverlay} roughness={0.8} metalness={0} transparent opacity={overlayOpacity} alphaTest={0.01}
            polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} /></mesh>}
        {/* Back cover */}
        <RoundedBox args={[COVER_W,coverThickness,COVER_H]} radius={0.008} position={[0,-coverY,0]} castShadow receiveShadow>
          <meshStandardMaterial {...solid} />
        </RoundedBox>
        {backMap && <mesh position={[0,-coverY-coverThickness/2-0.003,0]} rotation={[Math.PI/2,0,0]}>
          <planeGeometry args={[COVER_W-0.02,COVER_H-0.02]} />
          <meshStandardMaterial color="#ffffff" map={backMap} roughness={isDefault?materialIntensity:0.8} metalness={0}
            polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} /></mesh>}
        {backOverlay && <mesh position={[0,-coverY-coverThickness/2-0.006,0]} rotation={[Math.PI/2,0,0]}>
          <planeGeometry args={[COVER_W-0.08,COVER_H-0.08]} />
          <meshStandardMaterial color="#ffffff" map={backOverlay} roughness={0.8} metalness={0} transparent opacity={overlayOpacity} alphaTest={0.01}
            polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} /></mesh>}
        {/* Spine */}
        <RoundedBox args={[SPINE_W,spineY,COVER_H]} radius={0.008} position={[spineX,0,0]} castShadow receiveShadow>
          <meshStandardMaterial {...solid} />
        </RoundedBox>
        {spineMap && <mesh position={[spineX-SPINE_W/2-0.003,0,0]} rotation={[0,-Math.PI/2,0]}>
          <planeGeometry args={[COVER_H-0.02,spineY-0.02]} />
          <meshStandardMaterial color="#ffffff" map={spineMap} roughness={isDefault?materialIntensity:0.8} metalness={0}
            polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} /></mesh>}
      </group>
    </group>
  );
}

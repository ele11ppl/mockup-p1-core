import { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Navbar } from '../components/layout';
import { BookScene, BookControls, HudInner } from '../components/tools/book';
import { useBookConfig } from '../hooks/useBookConfig';

const VIEWS = [
  { pos: [-30, 30, 35], label: 'LEFT' },
  { pos: [0, 40, 0],     label: 'FRONT' },
  { pos: [30, 30, 35],  label: 'RIGHT' },
];

const btnBase = {
  padding: '5px 10px', fontSize: 11, fontWeight: 600,
  letterSpacing: '0.15em', color: '#999', background: 'transparent',
  border: '1px solid #e5e5e5', cursor: 'pointer',
  fontFamily: 'inherit', transition: 'color 0.2s, border-color 0.2s',
};

const hv = {
  enter: e => { e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#999'; },
  leave: e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#e5e5e5'; },
};

export default function BookMockupPage() {
  const cfg = useBookConfig();
  const controlsRef = useRef();
  const glRef = useRef();
  const hudRef = useRef(null);
  const [panMode, setPanMode] = useState(false);
  const dragRef = useRef({ down: false, startX: 0, startY: 0, offX: 0, offY: 0 });

  const switchView = useCallback((pos) => {
    const c = controlsRef.current;
    if (c) { c.target.set(0, 0, 0); c.object.position.set(...pos); c.update(); }
  }, []);

  const onPanDown = useCallback((e) => {
    dragRef.current = { down: true, startX: e.clientX, startY: e.clientY, offX: cfg.bgOffsetX, offY: cfg.bgOffsetY };
  }, [cfg.bgOffsetX, cfg.bgOffsetY]);

  const onPanMove = useCallback((e) => {
    if (!dragRef.current.down) return;
    cfg.setBgOffsetX(dragRef.current.offX + (e.clientX - dragRef.current.startX));
    cfg.setBgOffsetY(dragRef.current.offY + (e.clientY - dragRef.current.startY));
  }, [cfg]);

  const onPanUp = useCallback(() => { dragRef.current.down = false; }, []);

  const onBgWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    cfg.setBgScale(s => Math.max(0.1, Math.min(5, s + delta)));
  }, [cfg]);

  const exportImage = useCallback(async () => {
    const gl = glRef.current;
    if (!gl) return;
    if (!cfg.bgImage) {
      const a = document.createElement('a');
      a.download = 'book-mockup.png';
      a.href = gl.domElement.toDataURL('image/png');
      a.click();
      return;
    }
    const bgImg = new Image();
    bgImg.src = cfg.bgImage;
    await new Promise((resolve, reject) => { bgImg.onload = resolve; bgImg.onerror = reject; });
    const bgW = bgImg.naturalWidth, bgH = bgImg.naturalHeight;
    const threeDataUrl = gl.domElement.toDataURL('image/png');
    const offscreen = document.createElement('canvas');
    offscreen.width = bgW; offscreen.height = bgH;
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(bgImg, 0, 0, bgW, bgH);
    const scale = cfg.bgScale;
    const scaledH = bgH * scale;
    const scaledW = (gl.domElement.width / gl.domElement.height) * scaledH;
    const offsetX = (bgW - scaledW) / 2 + cfg.bgOffsetX * (bgW / gl.domElement.width);
    const offsetY = (bgH - scaledH) / 2 + cfg.bgOffsetY * (bgH / gl.domElement.height);
    const threeImg = new Image();
    threeImg.src = threeDataUrl;
    await new Promise((resolve) => { threeImg.onload = resolve; });
    ctx.drawImage(threeImg, offsetX, offsetY, scaledW, scaledH);
    const a = document.createElement('a');
    a.download = 'book-mockup.png';
    a.href = offscreen.toDataURL('image/png');
    a.click();
  }, [cfg]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Navbar backTo="/" backLabel="← INDEX" title="VOL. 01 — BOOK MOCKUP" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{
          width: 350, flexShrink: 0, borderRight: '1px solid #e5e5e5',
          padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          <BookControls
            preset={cfg.preset} onPresetChange={cfg.selectPreset}
            width={cfg.width} onWidthChange={cfg.setWidth}
            height={cfg.height} onHeightChange={cfg.setHeight}
            coverThickness={cfg.coverThickness} onCoverThicknessChange={cfg.setCoverThickness}
            spineThickness={cfg.spineThickness} onSpineThicknessChange={cfg.setSpineThickness}
            pageThickness={cfg.pageThickness} onPageThicknessChange={cfg.setPageThickness}
            coverColor={cfg.coverColor} onCoverColorChange={cfg.setCoverColor}
            pageEdgeColor={cfg.pageEdgeColor} onPageEdgeColorChange={cfg.setPageEdgeColor}
            ambientIntensity={cfg.ambientIntensity} onAmbientIntensityChange={cfg.setAmbientIntensity}
            bookRoughness={cfg.bookRoughness} onBookRoughnessChange={cfg.setBookRoughness}
            materialIntensity={cfg.materialIntensity} onMaterialIntensityChange={cfg.setMaterialIntensity}
            bindingPreset={cfg.bindingPreset}
            shadowOpacity={cfg.shadowOpacity} onShadowOpacityChange={cfg.setShadowOpacity}
            shadowColor={cfg.shadowColor} onShadowColorChange={cfg.setShadowColor}
            shadowSpread={cfg.shadowSpread} onShadowSpreadChange={cfg.setShadowSpread}
            shadowSize={cfg.shadowSize} onShadowSizeChange={cfg.setShadowSize}
            shadowOffX={cfg.shadowOffX} onShadowOffXChange={cfg.setShadowOffX}
            shadowOffY={cfg.shadowOffY} onShadowOffYChange={cfg.setShadowOffY}
            bgImage={cfg.bgImage} onBgUpload={cfg.setBgImage} onBgClear={cfg.clearBg}
            bgOffsetX={cfg.bgOffsetX} onBgOffsetXChange={cfg.setBgOffsetX}
            bgOffsetY={cfg.bgOffsetY} onBgOffsetYChange={cfg.setBgOffsetY}
            bgScale={cfg.bgScale} onBgScaleChange={cfg.setBgScale}
            bookPosX={cfg.bookPosX} onBookPosXChange={cfg.setBookPosX}
            bookPosY={cfg.bookPosY} onBookPosYChange={cfg.setBookPosY}
            bookPosZ={cfg.bookPosZ} onBookPosZChange={cfg.setBookPosZ}
            bindingPreset={cfg.bindingPreset} onBindingPresetChange={cfg.setBindingPreset}
            frontTex={cfg.frontTex} onUploadFront={cfg.setFrontTex}
            backTex={cfg.backTex} onUploadBack={cfg.setBackTex}
            spineTex={cfg.spineTex} onUploadSpine={cfg.setSpineTex}
            hasTextures={!!(cfg.frontTex || cfg.backTex || cfg.spineTex)}
            onClearAll={cfg.clearAll}
            onExport={exportImage}
          />
        </div>

        <div style={{ flex: 1, position: 'relative', background: '#fff', overflow: 'hidden' }}>
          {cfg.bgImage && (
            <img src={cfg.bgImage} alt="background" draggable={false}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: `translate(-50%, -50%) translate(${cfg.bgOffsetX}px, ${cfg.bgOffsetY}px) scale(${cfg.bgScale})`,
                height: '100%', width: 'auto', pointerEvents: 'none', userSelect: 'none',
                transition: panMode ? 'none' : 'transform 0.15s ease-out',
              }}
            />
          )}

          {cfg.bgImage && panMode && (
            <div
              style={{ position: 'absolute', inset: 0, zIndex: 3, cursor: 'grab' }}
              onMouseDown={onPanDown} onMouseMove={onPanMove}
              onMouseUp={onPanUp} onMouseLeave={onPanUp}
              onWheel={onBgWheel}
            />
          )}

          <Canvas
            camera={{ position: [30, 20, 30], fov: 45 }}
            shadows
            flat
            gl={{ alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true }}
            onCreated={({ gl, scene }) => {
              gl.setClearColor(0x000000, 0);
              scene.background = null;
              glRef.current = gl;
            }}
            style={{
              width: '100%', height: '100%',
              position: 'absolute', inset: 0, zIndex: 1,
              background: cfg.bgImage ? 'transparent' : '#fff',
            }}
          >
            <BookScene config={cfg.config} />
            <OrbitControls ref={controlsRef} enableDamping minPolarAngle={0} maxPolarAngle={Math.PI} />
            <HudInner hudRef={hudRef} />
          </Canvas>

          <div ref={hudRef} style={{
            position: 'absolute', bottom: 16, left: 16, zIndex: 2,
            fontSize: 10, fontWeight: 500, fontFamily: 'system-ui, monospace',
            letterSpacing: '0.06em', color: 'rgba(0,0,0,0.25)',
            pointerEvents: 'none', userSelect: 'none',
          }} />

          {/* View buttons — left edge top, vertical column */}
          <div style={{
            position: 'absolute', left: 16, top: 16, zIndex: 2,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {VIEWS.map(v => (
              <button key={v.label} onClick={() => switchView(v.pos)} style={btnBase}
                onMouseEnter={hv.enter} onMouseLeave={hv.leave}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Background toggle — bottom-right corner */}
          {cfg.bgImage && (
            <button
              onClick={() => setPanMode(p => !p)}
              style={{
                position: 'absolute', bottom: 24, right: 24, zIndex: 3,
                padding: '5px 10px', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.15em', fontFamily: 'inherit',
                color: panMode ? '#000' : '#999',
                background: 'transparent',
                border: panMode ? '1px solid #999' : '1px solid #e5e5e5',
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { if (!panMode) { e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#999'; } }}
              onMouseLeave={e => { if (!panMode) { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#e5e5e5'; } }}
            >
              {panMode ? '锁定背景' : '调节背景'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Slider, UploadBtn } from '../../ui';
import { PRESETS } from '../../../hooks/useBookConfig';

const s = {
  colorRow:{ display: 'flex', alignItems: 'center', gap: 10 },
  colorInput:{ width: 28, height: 28, border: '1px solid #ccc', padding: 2, cursor: 'pointer', background: 'transparent', borderRadius: 0 },
  colorHex:{ fontSize: 12, fontWeight: 500, color: '#000', fontFamily: 'inherit' },
  clearBtn:{ display: 'block', width: '100%', padding: '6px 0', fontSize: 11, fontWeight: 500, color: '#999', background: 'transparent', border: 'none', borderBottom: '1px solid #eee', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', marginTop: 12, transition: 'color 0.2s, border-color 0.2s' },
  accordionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '10px 0', fontSize: 10, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999',
    background: 'transparent', border: 'none', borderBottom: '1px solid #eee',
    cursor: 'pointer', fontFamily: 'inherit', userSelect: 'none', transition: 'color 0.2s',
  },
  accordionBody: { paddingTop: 14, paddingBottom: 4 },
  presetGrid: { display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 },
  presetBtn: (active) => ({
    padding: '5px 9px', fontSize: 10, fontWeight: 600,
    fontFamily: 'inherit', cursor: 'pointer',
    border: '1px solid #ccc', letterSpacing: '0.04em',
    color: active ? '#fff' : '#000',
    background: active ? '#000' : '#fff',
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  }),
  exportBtn: {
    display: 'block', width: '100%', padding: '8px 0', fontSize: 11,
    fontWeight: 600, letterSpacing: '0.15em', fontFamily: 'inherit',
    color: '#000', background: 'transparent', border: '1px solid #ccc',
    cursor: 'pointer', textAlign: 'center',
    transition: 'background 0.2s, border-color 0.2s',
  },
};

function Accordion({ label, open, onToggle, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <button style={s.accordionHeader} onClick={onToggle}
        onMouseEnter={e => { e.currentTarget.style.color = '#000'; }}
        onMouseLeave={e => { e.currentTarget.style.color = open ? '#000' : '#999'; }}>
        <span style={{ color: open ? '#000' : 'inherit', transition: 'color 0.2s' }}>{label}</span>
        <span style={{ fontSize: 10, color: 'inherit' }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={s.accordionBody}>{children}</div>}
    </div>
  );
}

function BgUploadBtn({ label, onUpload }) {
  return (
    <label style={{ display: 'block', width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 500, color: '#000', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', marginBottom: 6, transition: 'background 0.2s, border-color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.borderColor = '#999'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#ccc'; }}>
      {label}
      <input type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(URL.createObjectURL(f)); }} />
    </label>
  );
}

const hover = {
  clearEnter: e => { e.currentTarget.style.color = '#000'; e.currentTarget.style.borderBottomColor = '#ccc'; },
  clearLeave: e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderBottomColor = '#eee'; },
};

export default function BookControls({
  preset, onPresetChange,
  width, onWidthChange, height, onHeightChange,
  coverThickness, onCoverThicknessChange,
  pageThickness, onPageThicknessChange,
  coverColor, onCoverColorChange,
  pageEdgeColor, onPageEdgeColorChange,
  ambientIntensity, onAmbientIntensityChange,
  bookRoughness, onBookRoughnessChange,
  materialIntensity, onMaterialIntensityChange,
  shadowOpacity, onShadowOpacityChange,
  shadowColor, onShadowColorChange,
  shadowSpread, onShadowSpreadChange,
  shadowSize, onShadowSizeChange,
  shadowOffX, onShadowOffXChange,
  shadowOffY, onShadowOffYChange,
  bgImage, onBgUpload, onBgClear,
  bgOffsetX, onBgOffsetXChange,
  bgOffsetY, onBgOffsetYChange,
  bgScale, onBgScaleChange,
  bookPosX, onBookPosXChange,
  bookPosY, onBookPosYChange,
  bookPosZ, onBookPosZChange,
  bindingPreset, onBindingPresetChange,
  frontTex, onUploadFront,
  backTex, onUploadBack,
  spineTex, onUploadSpine,
  hasTextures, onClearAll,
  onExport,
}) {
  const [openSections, setOpenSections] = useState({});
  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const isOpen = (key) => !!openSections[key];

  return (
    <>
      {/* 尺寸预设 */}
      <Accordion label="尺寸预设" open={isOpen('size')} onToggle={() => toggle('size')}>
        <div style={s.presetGrid}>
          {PRESETS.map(p => (
            <button key={p.key} onClick={() => onPresetChange(p.key)}
              style={s.presetBtn(preset === p.key)}
              onMouseEnter={e => { if (preset !== p.key) e.currentTarget.style.background = '#f0f0f0'; }}
              onMouseLeave={e => { if (preset !== p.key) e.currentTarget.style.background = '#fff'; }}>
              {p.label}
            </button>
          ))}
        </div>
        <Slider label="书本宽度" value={width} min={10} max={35} step={0.1} onChange={onWidthChange} />
        <Slider label="书本高度" value={height} min={10} max={35} step={0.1} onChange={onHeightChange} />
        <Slider label="外壳厚度" value={coverThickness} min={0.01} max={0.3} step={0.01} onChange={onCoverThicknessChange} />
        <Slider label="内页厚度" value={pageThickness} min={0.5} max={8} step={0.1} onChange={onPageThicknessChange} />
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>书籍位移</span>
          <Slider label="位置 X" value={bookPosX} min={-10} max={10} step={0.1} onChange={onBookPosXChange} />
          <Slider label="位置 Y" value={bookPosY} min={-10} max={10} step={0.1} onChange={onBookPosYChange} />
          <Slider label="位置 Z" value={bookPosZ} min={-10} max={10} step={0.1} onChange={onBookPosZChange} />
        </div>
      </Accordion>

      {/* 装帧预设 */}
      <Accordion label="装帧预设" open={isOpen('binding')} onToggle={() => toggle('binding')}>
        <div style={s.presetGrid}>
          {[
            { key: 'default', label: '默认' },
            { key: 'perfect', label: '胶装' },
            { key: 'hardcover', label: '精装' },
            { key: 'smyth', label: '裸脊锁线' },
          ].map(b => (
            <button key={b.key} onClick={() => onBindingPresetChange(b.key)}
              style={s.presetBtn(bindingPreset === b.key)}
              onMouseEnter={e => { if (bindingPreset !== b.key) e.currentTarget.style.background = '#f0f0f0'; }}
              onMouseLeave={e => { if (bindingPreset !== b.key) e.currentTarget.style.background = '#fff'; }}>
              {b.label}
            </button>
          ))}
        </div>
      </Accordion>

      {/* 光影与材质 */}
      <Accordion label="光影与材质" open={isOpen('lighting')} onToggle={() => toggle('lighting')}>
        <div style={{ ...s.colorRow, marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em', minWidth: 60 }}>书壳颜色</span>
          <input type="color" value={coverColor} onChange={e => onCoverColorChange(e.target.value)} style={s.colorInput} />
          <span style={s.colorHex}>{coverColor}</span>
        </div>
        <div style={{ ...s.colorRow, marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em', minWidth: 60 }}>书页滚边</span>
          <input type="color" value={pageEdgeColor} onChange={e => onPageEdgeColorChange(e.target.value)} style={s.colorInput} />
          <span style={s.colorHex}>{pageEdgeColor}</span>
        </div>
        <Slider label="环境光亮度" value={ambientIntensity} min={0.1} max={3} step={0.05} onChange={onAmbientIntensityChange} />
        <Slider label={bindingPreset === 'default' ? '表面粗糙度' : '贴图透明度'} value={materialIntensity} min={0} max={1} step={0.01} onChange={onMaterialIntensityChange} />
      </Accordion>

      {/* 投影设置 */}
      <Accordion label="投影设置" open={isOpen('shadow')} onToggle={() => toggle('shadow')}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: '#999', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>阴影颜色</span>
          <div style={s.colorRow}>
            <input type="color" value={shadowColor} onChange={e => onShadowColorChange(e.target.value)} style={s.colorInput} />
            <span style={s.colorHex}>{shadowColor}</span>
          </div>
        </div>
        <Slider label="透明度" value={shadowOpacity} min={0} max={1} step={0.01} onChange={onShadowOpacityChange} />
        <Slider label="大小" value={shadowSize} min={0} max={50} step={1} onChange={onShadowSizeChange} />
        <Slider label="扩展" value={shadowSpread} min={0} max={100} step={1} onChange={onShadowSpreadChange} />
        <Slider label="偏移 X" value={shadowOffX} min={-20} max={20} step={0.5} onChange={onShadowOffXChange} />
        <Slider label="偏移 Y" value={shadowOffY} min={-20} max={20} step={0.5} onChange={onShadowOffYChange} />
      </Accordion>

      <div style={{ borderTop: '1px solid #eee', margin: '4px 0 14px' }} />

      {/* 贴图上传 */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ ...s.accordionHeader, color: '#000', cursor: 'default', borderBottom: '1px solid #eee' }}>
          <span>贴图上传</span>
        </div>
        <div style={{ paddingTop: 14 }}>
          <UploadBtn label="封面上传" onUpload={onUploadFront} />
          <UploadBtn label="封底上传" onUpload={onUploadBack} />
          <UploadBtn label="书脊上传" onUpload={onUploadSpine} />
          {hasTextures && (
            <button onClick={onClearAll} style={s.clearBtn} onMouseEnter={hover.clearEnter} onMouseLeave={hover.clearLeave}>
              清除全部贴图
            </button>
          )}
        </div>
      </div>

      {/* 画布背景 */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ ...s.accordionHeader, color: '#000', cursor: 'default', borderBottom: '1px solid #eee' }}>
          <span>画布背景</span>
        </div>
        <div style={{ paddingTop: 14 }}>
          <BgUploadBtn label={bgImage ? '更换背景图片' : '上传背景图片'} onUpload={onBgUpload} />
          {bgImage && (
            <>
              <button onClick={onBgClear} style={s.clearBtn}>清除背景图片</button>
              <Slider label="背景 X 偏移" value={bgOffsetX} min={-500} max={500} step={1} onChange={onBgOffsetXChange} />
              <Slider label="背景 Y 偏移" value={bgOffsetY} min={-500} max={500} step={1} onChange={onBgOffsetYChange} />
              <Slider label="背景缩放" value={bgScale} min={0.1} max={5} step={0.05} onChange={onBgScaleChange} />
            </>
          )}
        </div>
      </div>

      {/* 导出图片 */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ ...s.accordionHeader, color: '#000', cursor: 'default', borderBottom: '1px solid #eee' }}>
          <span>导出图片</span>
        </div>
        <div style={{ paddingTop: 14 }}>
          <button onClick={onExport} style={s.exportBtn}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.borderColor = '#999'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#ccc'; }}>
            EXPORT IMAGE
          </button>
        </div>
      </div>
    </>
  );
}

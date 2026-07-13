import { useState, useEffect, useMemo } from 'react';

export const PRESETS = [
  { key: 'A4',        label: 'A4 (210×297)',   width: 21.0, height: 29.7 },
  { key: 'A5',        label: 'A5 (148×210)',   width: 14.8, height: 21.0 },
  { key: 'B5',        label: 'B5 (176×250)',   width: 17.6, height: 25.0 },
  { key: '大16开',     label: '大16开 (210×285)', width: 21.0, height: 28.5 },
  { key: '方版画册',   label: '方版画册 (210×210)', width: 21.0, height: 21.0 },
];

export function useBookConfig() {
  const [preset, setPreset] = useState('A5');
  const [width, setWidth] = useState(14.8);
  const [height, setHeight] = useState(21.0);
  const [coverThickness, setCoverThickness] = useState(0.13);
  const [pageThickness, setPageThickness] = useState(1.3);
  const [coverColor, setCoverColor] = useState('#000000');
  const [pageEdgeColor, setPageEdgeColor] = useState('#f5f5dc');
  const [ambientIntensity, setAmbientIntensity] = useState(0.6);
  const [bookRoughness, setBookRoughness] = useState(0.5);
  const [materialIntensity, setMaterialIntensity] = useState(1);
  const [shadowOpacity, setShadowOpacity] = useState(0.4);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowSize, setShadowSize] = useState(10);
  const [shadowOffX, setShadowOffX] = useState(10);
  const [shadowOffY, setShadowOffY] = useState(10);
  const [bgImage, setBgImage] = useState(null);
  const [bgOffsetX, setBgOffsetX] = useState(0);
  const [bgOffsetY, setBgOffsetY] = useState(0);
  const [bgScale, setBgScale] = useState(1);
  const [bookPosX, setBookPosX] = useState(0);
  const [bookPosY, setBookPosY] = useState(0);
  const [bookPosZ, setBookPosZ] = useState(0);
  const [bindingPreset, setBindingPreset] = useState('default');
  const [frontTex, setFrontTex] = useState(null);
  const [backTex, setBackTex] = useState(null);
  const [spineTex, setSpineTex] = useState(null);

  const presetData = PRESETS.find(p => p.key === preset);
  const w = presetData ? presetData.width : width;
  const h = presetData ? presetData.height : height;

  const config = useMemo(() => ({
    width: w, height: h, coverThickness, pageThickness,
    coverColor, pageEdgeColor, ambientIntensity, bookRoughness, materialIntensity,
    shadowOpacity, shadowColor, shadowSpread, shadowSize, shadowOffX, shadowOffY,
    bookPosX, bookPosY, bookPosZ,
    bindingPreset,
    frontTextureUrl: frontTex, backTextureUrl: backTex, spineTextureUrl: spineTex,
  }), [w, h, coverThickness, pageThickness, coverColor, pageEdgeColor, ambientIntensity, bookRoughness, materialIntensity, shadowOpacity, shadowColor, shadowSpread, shadowSize, shadowOffX, shadowOffY, bookPosX, bookPosY, bookPosZ, bindingPreset, frontTex, backTex, spineTex]);

  useEffect(() => () => {
    if (frontTex) URL.revokeObjectURL(frontTex);
    if (backTex) URL.revokeObjectURL(backTex);
    if (spineTex) URL.revokeObjectURL(spineTex);
    if (bgImage) URL.revokeObjectURL(bgImage);
  }, []);

  const selectPreset = (key) => {
    const p = PRESETS.find(pr => pr.key === key);
    if (p) { setPreset(key); setWidth(p.width); setHeight(p.height); }
  };

  const setWidthCustom = (v) => { setPreset(null); setWidth(v); };
  const setHeightCustom = (v) => { setPreset(null); setHeight(v); };

  const clearAll = () => {
    if (frontTex) { URL.revokeObjectURL(frontTex); setFrontTex(null); }
    if (backTex) { URL.revokeObjectURL(backTex); setBackTex(null); }
    if (spineTex) { URL.revokeObjectURL(spineTex); setSpineTex(null); }
  };

  const clearBg = () => {
    if (bgImage) { URL.revokeObjectURL(bgImage); setBgImage(null); }
    setBgOffsetX(0); setBgOffsetY(0); setBgScale(1);
  };

  return {
    preset, selectPreset,
    width: w, setWidth: setWidthCustom,
    height: h, setHeight: setHeightCustom,
    coverThickness, setCoverThickness,
    pageThickness, setPageThickness,
    coverColor, setCoverColor,
    pageEdgeColor, setPageEdgeColor,
    ambientIntensity, setAmbientIntensity,
    bookRoughness, setBookRoughness,
    materialIntensity, setMaterialIntensity,
    shadowOpacity, setShadowOpacity,
    shadowColor, setShadowColor,
    shadowSpread, setShadowSpread,
    shadowSize, setShadowSize,
    shadowOffX, setShadowOffX,
    shadowOffY, setShadowOffY,
    bgImage, setBgImage, clearBg,
    bgOffsetX, setBgOffsetX,
    bgOffsetY, setBgOffsetY,
    bgScale, setBgScale,
    bookPosX, setBookPosX,
    bookPosY, setBookPosY,
    bookPosZ, setBookPosZ,
    bindingPreset, setBindingPreset,
    frontTex, setFrontTex,
    backTex, setBackTex,
    spineTex, setSpineTex,
    config, clearAll,
  };
}

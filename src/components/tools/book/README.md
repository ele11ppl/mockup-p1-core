# Book Mockup Tool

3D 书籍样机工具 — 可实时调整尺寸、厚度、上传自定义贴图，支持 360° 旋转预览。

## 功能
- 实时参数调节：封面宽/高、外壳厚度、内页厚度
- 尺寸预设：A5 / A4 / B5 / 自定义
- 三面贴图：封面、封底、书脊独立上传
- 3D 预览：支持任意角度旋转、缩放

## 文件结构
```
book/
├── BookScene.jsx      # 3D 渲染组件（纯展示，接收 config 对象）
├── BookControls.jsx   # 专用参数面板（通过 props 回调与父组件通信）
├── index.js           # barrel export
└── README.md          # 本文档
```

## 接口定义

### BookScene
| Prop   | 类型   | 说明                     |
|--------|--------|--------------------------|
| config | object | 见下方 config 字段表     |

### config 字段
| 字段             | 类型        | 默认值 | 说明         |
|------------------|-------------|--------|--------------|
| width            | number      | 15     | 封面宽度     |
| height           | number      | 21     | 封面高度     |
| coverThickness   | number      | 0.02   | 外壳厚度     |
| pageThickness    | number      | 1.6    | 内页厚度     |
| frontTextureUrl  | string|null| null   | 封面贴图 URL |
| backTextureUrl   | string|null| null   | 封底贴图 URL |
| spineTextureUrl  | string|null| null   | 书脊贴图 URL |

### BookControls
所有 props 均为受控模式：`value` + `onChange` 回调。

## 状态管理
业务逻辑封装在 `src/hooks/useBookConfig.js`，页面组件通过该 Hook 获取 config 与操作方法。

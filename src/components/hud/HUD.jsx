'use client'
import { useState } from 'react'
import {
  Box, Eraser, Trash2, ChevronUp, ChevronDown,
  Circle, RectangleHorizontal, Layers, Minus, Plus,
  Hand, ZoomIn, MousePointer2
} from 'lucide-react'
import { useVoxelStore } from '@/store/useVoxelStore'

const PALETTE = [
  '#60a5fa', '#34d399', '#fbbf24', '#f87171',
  '#a78bfa', '#f472b6', '#fb923c', '#f8fafc',
]

const SHAPES = [
  { id: 'cube',      label: 'Cube',      Icon: Box },
  { id: 'flat',      label: 'Flat',      Icon: RectangleHorizontal },
  { id: 'tall',      label: 'Tall',      Icon: Layers },
  { id: 'cylinder',  label: 'Cylinder',  Icon: Circle },
]

export default function HUD() {
  const mode = useVoxelStore((s) => s.mode)
  const color = useVoxelStore((s) => s.color)
  const isPinching = useVoxelStore((s) => s.isPinching)
  const voxelCount = Object.keys(useVoxelStore((s) => s.voxels)).length
  const setMode = useVoxelStore((s) => s.setMode)
  const setColor = useVoxelStore((s) => s.setColor)
  const clearAll = useVoxelStore((s) => s.clearAll)

  const shape = useVoxelStore((s) => s.shape)
  const setShape = useVoxelStore((s) => s.setShape)
  const brushSize = useVoxelStore((s) => s.brushSize)
  const setBrushSize = useVoxelStore((s) => s.setBrushSize)

  return (
    <div style={styles.root}>

      {/* Top left */}
      <div style={styles.topLeft}>
        <div style={styles.brand}>
          <div style={styles.brandDot} />
          VoxelWeb
        </div>
        <div style={styles.pill}>
          <div style={{
            ...styles.statusDot,
            background: isPinching ? '#34d399' : '#475569',
            boxShadow: isPinching ? '0 0 8px #34d399' : 'none',
          }} />
          <span style={{ ...styles.pillText, color: isPinching ? '#34d399' : '#64748b' }}>
            {isPinching ? 'Placing' : 'Ready'}
          </span>
          <span style={styles.pillDivider} />
          <span style={{ ...styles.pillText, color: '#94a3b8' }}>
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{voxelCount}</span>
            {' '}block{voxelCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Top right — gesture hints */}
      <div style={styles.hints}>
        <Hint Icon={MousePointer2} label="Pinch to place" />
        <Hint Icon={Hand} label="Open hand to pan" />
        <Hint Icon={ZoomIn} label="Two hands to zoom" />
      </div>

      {/* Bottom toolbar */}
      <div style={styles.toolbarWrap}>

        {/* Mode */}
        <ToolbarGroup>
          <ToolBtn
            active={mode === 'build'}
            onClick={() => setMode('build')}
            accent="#3b82f6"
          >
            <Box size={15} />
            Build
          </ToolBtn>
          <ToolBtn
            active={mode === 'erase'}
            onClick={() => setMode('erase')}
            accent="#ef4444"
          >
            <Eraser size={15} />
            Erase
          </ToolBtn>
        </ToolbarGroup>

        <Sep />

        {/* Shapes */}
        <ToolbarGroup>
          {SHAPES.map(({ id, label, Icon }) => (
            <ToolBtn
              key={id}
              active={shape === id}
              onClick={() => setShape(id)}
              accent="#6366f1"
            >
              <Icon size={14} />
              {label}
            </ToolBtn>
          ))}
        </ToolbarGroup>

        <Sep />

        {/* Brush size */}
        <ToolbarGroup>
          <span style={styles.label}>Size</span>
          <button
            style={styles.iconBtn}
            onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
          >
            <Minus size={13} />
          </button>
          <span style={styles.sizeNum}>{brushSize}</span>
          <button
            style={styles.iconBtn}
            onClick={() => setBrushSize(Math.min(5, brushSize + 1))}
          >
            <Plus size={13} />
          </button>
        </ToolbarGroup>

        <Sep />

        {/* Palette */}
        <div style={styles.palette}>
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                ...styles.swatch,
                background: c,
                transform: c === color ? 'scale(1.35)' : 'scale(1)',
                boxShadow: c === color
                  ? `0 0 0 2px #0a0a0f, 0 0 0 4px ${c}, 0 0 14px ${c}66`
                  : '0 1px 3px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>

        <Sep />

        {/* Clear */}
        <button style={styles.clearBtn} onClick={clearAll}>
          <Trash2 size={14} />
        </button>

      </div>
    </div>
  )
}

function ToolbarGroup({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{children}</div>
}

function ToolBtn({ children, active, onClick, accent = '#3b82f6' }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 11px',
        border: 'none',
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        background: active ? accent : 'rgba(255,255,255,0.05)',
        color: active ? '#fff' : '#475569',
        boxShadow: active ? `0 0 12px ${accent}55` : 'none',
      }}
    >
      {children}
    </button>
  )
}

function Hint({ Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: 11 }}>
      <Icon size={12} color="#475569" />
      {label}
    </div>
  )
}

function Sep() {
  return <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
}

const glass = {
  background: 'rgba(15,17,23,0.82)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
}

const styles = {
  root: {
    position: 'fixed', inset: 0,
    pointerEvents: 'none',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto 1fr auto',
    padding: 20, gap: 12,
    zIndex: 20,
  },
  topLeft: {
    gridColumn: '1', gridRow: '1',
    display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'start',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 8,
    color: '#f8fafc', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em',
  },
  brandDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    boxShadow: '0 0 10px #3b82f6',
  },
  pill: {
    ...glass,
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '5px 12px', borderRadius: 20, alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%',
    transition: 'background 0.3s, box-shadow 0.3s',
  },
  pillText: { fontSize: 12 },
  pillDivider: { width: 1, height: 10, background: 'rgba(255,255,255,0.1)' },
  hints: {
    gridColumn: '2', gridRow: '1',
    display: 'flex', flexDirection: 'column', gap: 5,
    alignItems: 'flex-end', alignSelf: 'start',
  },
  toolbarWrap: {
    pointerEvents: 'all',
    gridColumn: '1 / -1', gridRow: '3',
    justifySelf: 'center',
    display: 'flex', alignItems: 'center', gap: 10,
    ...glass,
    padding: '9px 14px', borderRadius: 20,
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
  },
  label: { color: '#475569', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' },
  iconBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: 'none', borderRadius: 7,
    width: 26, height: 26,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#64748b', cursor: 'pointer',
  },
  sizeNum: {
    color: '#e2e8f0', fontWeight: 700, fontSize: 14,
    minWidth: 20, textAlign: 'center',
  },
  palette: { display: 'flex', gap: 7, alignItems: 'center' },
  swatch: {
    width: 20, height: 20, border: 'none', borderRadius: 6,
    cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', flexShrink: 0,
  },
  clearBtn: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 10, padding: '6px 10px',
    color: '#ef4444', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
  },
}

'use client'
import { useVoxelStore } from '@/store/useVoxelStore'

const PALETTE = [
  '#4fc3f7', '#81c784', '#ffb74d', '#f06292',
  '#ce93d8', '#fff176', '#ff7043', '#ffffff',
]

export default function HUD() {
  const mode = useVoxelStore((s) => s.mode)
  const color = useVoxelStore((s) => s.color)
  const isPinching = useVoxelStore((s) => s.isPinching)
  const voxelCount = Object.keys(useVoxelStore((s) => s.voxels)).length
  const setMode = useVoxelStore((s) => s.setMode)
  const setColor = useVoxelStore((s) => s.setColor)
  const clearAll = useVoxelStore((s) => s.clearAll)

  return (
    <div style={styles.root}>
      <div style={styles.status}>
        <span style={{ ...styles.dot, background: isPinching ? '#4ade80' : '#64748b' }} />
        {isPinching ? 'Pinching' : 'Open hand'}
        &nbsp;·&nbsp;{voxelCount} block{voxelCount !== 1 ? 's' : ''}
      </div>

      <div style={styles.toolbar}>
        <button
          style={{ ...styles.btn, background: mode === 'build' ? '#4fc3f7' : '#f87171' }}
          onClick={() => setMode(mode === 'build' ? 'erase' : 'build')}
        >
          {mode === 'build' ? '🧱 Build' : '🗑 Erase'}
        </button>

        <div style={styles.palette}>
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                ...styles.swatch,
                background: c,
                outline: c === color ? '2px solid white' : 'none',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>

        <button style={{ ...styles.btn, background: '#475569' }} onClick={clearAll}>
          Clear
        </button>
      </div>
    </div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 20,
  },
  status: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(0,0,0,0.5)',
    color: '#cbd5e1',
    fontSize: 13,
    padding: '6px 12px',
    borderRadius: 20,
    backdropFilter: 'blur(8px)',
  },
  dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  toolbar: {
    pointerEvents: 'all',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(0,0,0,0.6)',
    padding: '10px 16px',
    borderRadius: 16,
    backdropFilter: 'blur(12px)',
  },
  btn: {
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    color: '#0f172a',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  palette: { display: 'flex', gap: 6 },
  swatch: { width: 24, height: 24, border: 'none', borderRadius: 4, cursor: 'pointer' },
}

import { create } from 'zustand'

export const useVoxelStore = create((set, get) => ({
  voxels: {},
  cursor: { x: 0, y: 0, z: 0 },
  isPinching: false,
  isZooming: false,
  isPanning: false,
  mode: 'build',
  color: '#60a5fa',
  shape: 'cube',
  brushSize: 1,
  handData: null,
  cameraDistance: 15,
  orbitDelta: { azimuth: 0, polar: 0 },

  placeVoxel: () => {
    const { cursor, color, shape, brushSize, voxels } = get()
    const cells = getShapeCells(cursor, shape, brushSize)
    const next = { ...voxels }
    cells.forEach(({ x, y, z }) => {
      next[`${x},${y},${z}`] = { color }
    })
    set({ voxels: next })
  },

  eraseVoxel: () => {
    const { cursor, shape, brushSize, voxels } = get()
    const cells = getShapeCells(cursor, shape, brushSize)
    const next = { ...voxels }
    cells.forEach(({ x, y, z }) => {
      delete next[`${x},${y},${z}`]
    })
    set({ voxels: next })
  },

  setCursor: (pos) => set({ cursor: pos }),
  setPinching: (val) => set({ isPinching: val }),
  setHandData: (landmarks) => set({ handData: landmarks }),
  setMode: (mode) => set({ mode }),
  setColor: (color) => set({ color }),
  setShape: (shape) => set({ shape }),
  setBrushSize: (brushSize) => set({ brushSize }),
  clearAll: () => set({ voxels: {} }),
  setCameraDistance: (updater) => set((s) => ({
    cameraDistance: typeof updater === 'function' ? updater(s.cameraDistance) : updater,
  })),
  setIsZooming: (val) => set({ isZooming: val }),
  setIsPanning: (val) => set({ isPanning: val }),
  setOrbitDelta: (delta) => set({ orbitDelta: delta }),
}))

// Generate grid cells for each shape
function getShapeCells({ x, y, z }, shape, size) {
  const cells = []
  const r = size - 1

  if (shape === 'cube') {
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++)
        for (let dz = -r; dz <= r; dz++)
          cells.push({ x: x + dx, y: y + dy, z: z + dz })

  } else if (shape === 'flat') {
    // Flat slab — wide on X/Z, 1 unit tall
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++)
        cells.push({ x: x + dx, y, z: z + dz })

  } else if (shape === 'tall') {
    // Tall column — 1x1 footprint, tall on Y
    for (let dy = 0; dy <= r * 2; dy++)
      cells.push({ x, y: y + dy, z })

  } else if (shape === 'cylinder') {
    // Cylinder — circular on X/Z, tall on Y
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++)
        for (let dy = 0; dy <= Math.max(0, r); dy++)
          if (dx * dx + dz * dz <= r * r + 0.5)
            cells.push({ x: x + dx, y: y + dy, z: z + dz })
  }

  return cells
}

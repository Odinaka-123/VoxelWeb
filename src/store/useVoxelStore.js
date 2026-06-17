import { create } from 'zustand'

export const useVoxelStore = create((set, get) => ({
  voxels: {},
  cursor: { x: 0, y: 0, z: 0 },
  isPinching: false,
  isZooming: false,
  mode: 'build',
  color: '#4fc3f7',
  handData: null,
  cameraDistance: 15,

  placeVoxel: () => {
    const { cursor, color, voxels } = get()
    const key = `${cursor.x},${cursor.y},${cursor.z}`
    set({ voxels: { ...voxels, [key]: { color } } })
  },

  eraseVoxel: () => {
    const { cursor, voxels } = get()
    const key = `${cursor.x},${cursor.y},${cursor.z}`
    const next = { ...voxels }
    delete next[key]
    set({ voxels: next })
  },

  setCursor: (pos) => set({ cursor: pos }),
  setPinching: (val) => set({ isPinching: val }),
  setHandData: (landmarks) => set({ handData: landmarks }),
  setMode: (mode) => set({ mode }),
  setColor: (color) => set({ color }),
  clearAll: () => set({ voxels: {} }),
  setCameraDistance: (updater) => set((s) => ({
    cameraDistance: typeof updater === 'function' ? updater(s.cameraDistance) : updater
  })),
  setIsZooming: (val) => set({ isZooming: val }),
}))

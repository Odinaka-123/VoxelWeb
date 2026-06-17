export const GRID_SIZE = 1
export const GRID_EXTENT = 10

export function snapToGrid({ x, y, z }) {
  return {
    x: Math.round(x / GRID_SIZE),
    y: Math.round(y / GRID_SIZE),
    z: Math.round(z / GRID_SIZE),
  }
}

export function gridToWorld({ x, y, z }) {
  return {
    x: x * GRID_SIZE,
    y: y * GRID_SIZE,
    z: z * GRID_SIZE,
  }
}

export function lerpVec3(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }
}

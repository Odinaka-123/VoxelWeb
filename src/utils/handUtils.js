export const LM = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
}

export function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

export function isPinching(landmarks, threshold = 0.05) {
  if (!landmarks || landmarks.length < 9) return false
  return dist(landmarks[LM.THUMB_TIP], landmarks[LM.INDEX_TIP]) < threshold
}

export function pinchMidpoint(landmarks) {
  const a = landmarks[LM.THUMB_TIP]
  const b = landmarks[LM.INDEX_TIP]
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 }
}

export function cameraToWorld(normPoint, worldScale = 10) {
  return {
    x: (0.5 - normPoint.x) * worldScale,
    y: (0.5 - normPoint.y) * worldScale,
    z: (normPoint.z ?? 0) * worldScale * -2,
  }
}

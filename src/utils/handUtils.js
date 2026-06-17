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

// Returns 0 = fist, 1 = fully open
export function handOpenness(landmarks) {
  const wrist = landmarks[0]
  const middleMcp = landmarks[9]
  const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]

  const refDist = Math.sqrt(
    (wrist.x - middleMcp.x) ** 2 + (wrist.y - middleMcp.y) ** 2
  )
  if (refDist === 0) return 0

  const avgTipDist =
    tips.reduce((sum, t) => {
      return sum + Math.sqrt((wrist.x - t.x) ** 2 + (wrist.y - t.y) ** 2)
    }, 0) / tips.length

  return Math.min(1, avgTipDist / (refDist * 2.2))
}

// Palm centre — average of wrist + 4 MCP knuckles
export function palmCenter(landmarks) {
  const pts = [landmarks[0], landmarks[5], landmarks[9], landmarks[13], landmarks[17]]
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  }
}

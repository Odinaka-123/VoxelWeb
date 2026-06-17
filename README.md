# VoxelWeb

> Gesture-controlled voxel building in the browser — no headset required.

A spatial computing prototype that brings XR-style hand interaction to any laptop or desktop with a webcam. Inspired by [Oleg Frolov's BoxelXR](https://github.com/Volorf/xr-prototypes), rebuilt for the open web using real-time neural hand tracking instead of a Meta Quest.

---

## What it does

Point your hand at the webcam. Pinch to place a voxel block in 3D space. Open your hand to move the cursor. Switch to erase mode and pinch to remove blocks. No controller, no headset — just your hand and a browser.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| 3D Rendering | React Three Fiber + Three.js |
| Hand Tracking | Google MediaPipe Tasks Vision (client-side WASM) |
| State | Zustand |
| Styling | Tailwind CSS + inline styles |

---

## Project Structure

```
src/
├── app/
│   ├── layout.js               # Root layout, dark background
│   └── page.js                 # Entry point — dynamic imports (no SSR)
│
├── store/
│   └── useVoxelStore.js        # Global state: voxels, cursor, gestures, mode
│
├── hooks/
│   └── useHandTracker.js       # MediaPipe inference loop → store updates
│
├── utils/
│   ├── gridHelpers.js          # snapToGrid, gridToWorld, lerpVec3
│   └── handUtils.js            # isPinching, pinchMidpoint, cameraToWorld
│
└── components/
    ├── scene/
    │   ├── VoxelScene.jsx      # R3F Canvas, lights, OrbitControls
    │   ├── VoxelGrid.jsx       # Renders all placed blocks
    │   └── CursorBlock.jsx     # Ghost block that follows the hand
    ├── hand/
    │   └── HandTracker.jsx     # Hidden webcam video + hook mount
    └── hud/
        └── HUD.jsx             # 2D overlay: toolbar, palette, status
```

---

## Getting Started

**Prerequisites:** Node.js 18+, a webcam, a modern browser (Chrome recommended for WebGL + WASM performance).

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:3000
# → Grant camera permission when prompted
```

---

## Gestures

| Gesture | Action |
|---|---|
| ✋ Open hand | Move cursor through 3D space |
| 🤏 Pinch (thumb + index) | Place or erase block at cursor |
| Mode toggle (HUD) | Switch between Build and Erase |

Pinch detection fires on the **leading edge** only (pinch start), so each discrete pinch places exactly one block.

---

## How it works

```
Webcam frame
    ↓
MediaPipe Hand Landmarker (21 landmarks, runs in-browser via WASM)
    ↓
isPinching() + pinchMidpoint()          ← handUtils.js
    ↓
cameraToWorld() → snapToGrid()          ← gridHelpers.js
    ↓
Zustand store (cursor, isPinching)
    ↓
CursorBlock (R3F) lerps to grid pos     ← Three.js render loop
VoxelGrid renders placed blocks
HUD reflects live state
```

MediaPipe runs entirely client-side — no video is sent to any server.

---

## Roadmap

- [x] Project scaffold (Next.js + R3F + MediaPipe)
- [x] Pinch-to-place with leading-edge debounce
- [x] Ghost cursor block with lerp smoothing
- [x] Color palette + build/erase mode toggle
- [ ] Two-hand support (left = erase, right = build)
- [ ] Jitter stabilization (exponential smoothing on landmark positions)
- [ ] `InstancedMesh` swap for 1000+ block scenes
- [ ] Export scene to GLTF
- [ ] Undo / redo stack
- [ ] Mobile support (rear camera)

---

## Credits

Concept by [Oleg Frolov (@Volorf)](https://x.com/Volorf) — original BoxelXR prototype for Meta Quest.  
Web implementation built with React Three Fiber, MediaPipe, and Zustand.

---

## License

MIT
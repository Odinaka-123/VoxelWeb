# 🚀 VoxelWeb 

A local, web-based spatial computing prototype for gesture-controlled voxel building, inspired by Oleg Frolov's BoxelXR. This project brings immersive 3D interactions to standard web browsers using real-time webcam neural hand tracking instead of expensive XR headsets.

## ✨ Features
- 🖐️ **Headset-Free Spatial UI:** Full hand-tracking directly via your standard webcam.
- 🤏 **Pinch-to-Build Mechanics:** Natural gesture detection to spawn, place, and manipulate blocks.
- 🎯 **Snapping Grid System:** High-performance 3D spatial alignment that maps fluid gestures to crisp voxel matrices.
- 📉 **Jitter Stabilization:** Custom interpolation algorithms to smooth out raw webcam tracking data.

## 🛠️ Built With
- **Frontend:** React, React Three Fiber (R3F), Three.js
- **Vision AI:** Google MediaPipe (Client-side Hand Landmarker API)
- **Backend (Optional):** Python (FastAPI / WebSockets for spatial data processing)

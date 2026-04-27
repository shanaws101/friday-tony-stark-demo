# WebGL Kinetic Typography Engine

R3F + GLSL implementation for high-density kinetic typography rendering with ordered Bayer dithering.

## Features

- Image (`.png`, `.jpeg`) and video (`.mp4`) source upload.
- MP4 playback via `THREE.VideoTexture`, updated every render frame.
- Custom shader material with 4x4 ordered Bayer dithering.
- Dense typographic sampling from a generated glyph atlas based on custom text input.
- Zustand-driven real-time controls (density, dither, contrast, brightness, flow, rotation).
- Tailwind premium dark control overlay.
- Explicit disposal for textures and video resources.

## Run

```bash
cd webgl-typography-engine
npm install
npm run dev
```

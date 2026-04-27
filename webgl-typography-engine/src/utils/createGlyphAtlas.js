import * as THREE from 'three';

const GRID = 16;

export function createGlyphAtlas(text) {
  const glyphs = Array.from(new Set((text || 'WANDERLUST').toUpperCase().replace(/\s+/g, '').split('')));
  const safeGlyphs = glyphs.length ? glyphs : ['W', 'A', 'N', 'D', 'E', 'R'];
  const canvas = document.createElement('canvas');
  const tileSize = 72;
  canvas.width = GRID * tileSize;
  canvas.height = GRID * tileSize;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${tileSize * 0.75}px Inter, sans-serif`;

  for (let i = 0; i < GRID * GRID; i += 1) {
    const x = i % GRID;
    const y = Math.floor(i / GRID);
    const gx = (x + 0.5) * tileSize;
    const gy = (y + 0.5) * tileSize;
    const char = safeGlyphs[i % safeGlyphs.length];

    ctx.fillStyle = '#fff';
    ctx.fillText(char, gx, gy);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  return {
    texture,
    gridSize: GRID,
    glyphCount: safeGlyphs.length
  };
}

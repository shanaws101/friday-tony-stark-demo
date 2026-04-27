import { extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { KineticTypographyMaterial } from '../gl/KineticTypographyMaterial';
import { createGlyphAtlas } from '../utils/createGlyphAtlas';
import { useTypographyStore } from '../store/useTypographyStore';

extend({ KineticTypographyMaterial });

function createFallbackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grd = ctx.createLinearGradient(0, 0, 512, 512);
  grd.addColorStop(0, '#111');
  grd.addColorStop(1, '#ddd');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function TypographyPlane() {
  const materialRef = useRef();
  const { viewport } = useThree();
  const {
    texture,
    sourceType,
    density,
    ditherStrength,
    contrast,
    brightness,
    flowDirection,
    rotation,
    text
  } = useTypographyStore();

  const fallbackTexture = useMemo(() => createFallbackTexture(), []);
  const sourceTexture = texture || fallbackTexture;
  const atlas = useMemo(() => createGlyphAtlas(text), [text]);

  useEffect(() => () => {
    fallbackTexture.dispose();
  }, [fallbackTexture]);

  useEffect(() => () => {
    atlas.texture.dispose();
  }, [atlas]);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uTime = state.clock.getElapsedTime();
    materialRef.current.uSource = sourceTexture;
    materialRef.current.uGlyphAtlas = atlas.texture;
    materialRef.current.uDensity = density;
    materialRef.current.uDitherStrength = ditherStrength;
    materialRef.current.uContrast = contrast;
    materialRef.current.uBrightness = brightness;
    materialRef.current.uFlowDirection = flowDirection;
    materialRef.current.uRotation = rotation;
    materialRef.current.uAtlasGrid = atlas.gridSize;
    materialRef.current.uGlyphCount = Math.max(atlas.glyphCount, 1);

    if (sourceType === 'video') {
      sourceTexture.needsUpdate = true;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <kineticTypographyMaterial ref={materialRef} />
    </mesh>
  );
}

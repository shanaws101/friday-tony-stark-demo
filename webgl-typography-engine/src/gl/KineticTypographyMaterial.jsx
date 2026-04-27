import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;

  uniform sampler2D uSource;
  uniform sampler2D uGlyphAtlas;
  uniform float uTime;
  uniform float uDensity;
  uniform float uDitherStrength;
  uniform float uContrast;
  uniform float uBrightness;
  uniform float uFlowDirection;
  uniform float uRotation;
  uniform float uAtlasGrid;
  uniform float uGlyphCount;

  float bayer4x4(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int idx = x + y * 4;
    float thresholds[16];
    thresholds[0] = 0.0; thresholds[1] = 8.0; thresholds[2] = 2.0; thresholds[3] = 10.0;
    thresholds[4] = 12.0; thresholds[5] = 4.0; thresholds[6] = 14.0; thresholds[7] = 6.0;
    thresholds[8] = 3.0; thresholds[9] = 11.0; thresholds[10] = 1.0; thresholds[11] = 9.0;
    thresholds[12] = 15.0; thresholds[13] = 7.0; thresholds[14] = 13.0; thresholds[15] = 5.0;
    return thresholds[idx] / 16.0;
  }

  mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec2 gridUv = vUv * uDensity;
    vec2 cell = floor(gridUv);
    vec2 cellUv = fract(gridUv) - 0.5;

    vec2 animatedSourceUv = vUv;
    animatedSourceUv += vec2(uFlowDirection * 0.01 * sin(uTime * 0.7 + vUv.y * 12.0), 0.0);
    vec3 src = texture2D(uSource, animatedSourceUv).rgb;

    float lum = dot(src, vec3(0.2126, 0.7152, 0.0722));
    lum = (lum - 0.5) * uContrast + 0.5 + uBrightness;
    lum = clamp(lum, 0.0, 1.0);

    float threshold = bayer4x4(gl_FragCoord.xy);
    float dithered = clamp(lum + (threshold - 0.5) * uDitherStrength, 0.0, 1.0);

    float glyphSelector = floor((1.0 - dithered) * (uGlyphCount - 0.001));
    float jitter = mod(cell.x + cell.y + floor(uTime * (2.0 + abs(uFlowDirection) * 3.0)), uGlyphCount);
    glyphSelector = mod(glyphSelector + jitter, uGlyphCount);

    cellUv *= rot(uRotation + 0.12 * sin(uTime + dot(cell, vec2(0.09, 0.13))));
    vec2 glyphUv = cellUv + 0.5;

    float atlasCell = glyphSelector;
    vec2 atlasGridCoord = vec2(mod(atlasCell, uAtlasGrid), floor(atlasCell / uAtlasGrid));
    vec2 atlasUv = (atlasGridCoord + glyphUv) / uAtlasGrid;
    float glyph = texture2D(uGlyphAtlas, atlasUv).r;

    float ink = smoothstep(0.28, 0.85, glyph);
    vec3 foreground = mix(vec3(0.06), vec3(0.95), dithered);
    vec3 color = foreground * ink;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const KineticTypographyMaterial = shaderMaterial(
  {
    uSource: new THREE.Texture(),
    uGlyphAtlas: new THREE.Texture(),
    uTime: 0,
    uDensity: 180,
    uDitherStrength: 0.4,
    uContrast: 1,
    uBrightness: 0,
    uFlowDirection: 0,
    uRotation: 0,
    uAtlasGrid: 16,
    uGlyphCount: 12
  },
  vertexShader,
  fragmentShader
);

import { create } from 'zustand';

const defaults = {
  density: 220,
  ditherStrength: 0.35,
  contrast: 1.15,
  brightness: 0,
  text: 'WANDERLUST',
  flowDirection: 0.6,
  rotation: 0.25
};

export const useTypographyStore = create((set, get) => ({
  ...defaults,
  texture: null,
  sourceType: 'none',
  sourceLabel: 'No source loaded',
  cleanupSource: null,
  setControl: (key, value) => set({ [key]: value }),
  setText: (text) => set({ text: text || defaults.text }),
  clearSource: () => {
    const { cleanupSource } = get();
    if (cleanupSource) cleanupSource();
    set({ texture: null, sourceType: 'none', sourceLabel: 'No source loaded', cleanupSource: null });
  },
  setSource: ({ texture, sourceType, sourceLabel, cleanup }) => {
    const { cleanupSource } = get();
    if (cleanupSource) cleanupSource();
    set({
      texture,
      sourceType,
      sourceLabel,
      cleanupSource: cleanup
    });
  }
}));

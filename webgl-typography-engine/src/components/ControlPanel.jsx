import { useTypographyStore } from '../store/useTypographyStore';

async function loadSourceFile(file, setSource) {
  const name = file.name;
  const url = URL.createObjectURL(file);

  if (file.type.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    await video.play();

    const { VideoTexture, LinearFilter, RGBAFormat } = await import('three');
    const texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.format = RGBAFormat;

    setSource({
      texture,
      sourceType: 'video',
      sourceLabel: `Video: ${name}`,
      cleanup: () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        texture.dispose();
        URL.revokeObjectURL(url);
      }
    });
    return;
  }

  const img = new Image();
  img.src = url;
  await img.decode();
  const { Texture } = await import('three');
  const texture = new Texture(img);
  texture.needsUpdate = true;

  setSource({
    texture,
    sourceType: 'image',
    sourceLabel: `Image: ${name}`,
    cleanup: () => {
      texture.dispose();
      URL.revokeObjectURL(url);
    }
  });
}

function Slider({ label, min, max, step, value, onChange }) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-200">{value}</span>
      </div>
      <input
        className="w-full accent-cyan-400"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function ControlPanel() {
  const state = useTypographyStore();

  return (
    <aside className="absolute left-6 top-6 z-20 w-[360px] rounded-2xl border border-zinc-800/90 bg-zinc-950/85 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-400">Kinetic Typography</p>
        <h1 className="text-xl font-semibold text-zinc-100">WebGL Dither Engine</h1>
        <p className="mt-1 text-xs text-zinc-400">{state.sourceLabel}</p>
      </div>

      <div className="space-y-4">
        <label className="block text-xs uppercase tracking-[0.16em] text-zinc-400">
          Source (PNG/JPEG/MP4)
          <input
            className="mt-2 block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
            type="file"
            accept="image/png,image/jpeg,video/mp4"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await loadSourceFile(file, state.setSource);
            }}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.16em] text-zinc-400">
          Typography String
          <input
            className="mt-2 block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            value={state.text}
            onChange={(e) => state.setText(e.target.value)}
            placeholder="WANDERLUST"
          />
        </label>

        <Slider label="Density" min={60} max={420} step={1} value={state.density} onChange={(v) => state.setControl('density', v)} />
        <Slider label="Dither Strength" min={0} max={1.5} step={0.01} value={state.ditherStrength} onChange={(v) => state.setControl('ditherStrength', v)} />
        <Slider label="Contrast" min={0.2} max={2.5} step={0.01} value={state.contrast} onChange={(v) => state.setControl('contrast', v)} />
        <Slider label="Brightness" min={-0.5} max={0.5} step={0.01} value={state.brightness} onChange={(v) => state.setControl('brightness', v)} />
        <Slider label="Flow Direction" min={-2} max={2} step={0.01} value={state.flowDirection} onChange={(v) => state.setControl('flowDirection', v)} />
        <Slider label="Text Rotation" min={-3.14} max={3.14} step={0.01} value={state.rotation} onChange={(v) => state.setControl('rotation', v)} />

        <button
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-sm font-medium text-zinc-100 transition hover:border-cyan-500 hover:text-cyan-300"
          onClick={state.clearSource}
        >
          Clear Source
        </button>
      </div>
    </aside>
  );
}

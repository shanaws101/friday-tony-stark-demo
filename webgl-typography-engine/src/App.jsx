import { Canvas } from '@react-three/fiber';
import { ControlPanel } from './components/ControlPanel';
import { TypographyPlane } from './components/TypographyPlane';

export default function App() {
  return (
    <div className="relative h-full w-full bg-zinc-950">
      <ControlPanel />
      <Canvas dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <TypographyPlane />
      </Canvas>
    </div>
  );
}

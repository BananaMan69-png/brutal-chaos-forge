import { useEffect, useState } from "react";

interface BloodSplatterProps {
  trigger: number; // increments to trigger new splatter
}

interface Splat {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

const BloodSplatter = ({ trigger }: BloodSplatterProps) => {
  const [splats, setSplats] = useState<Splat[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const count = 3 + Math.floor(Math.random() * 4);
    const newSplats: Splat[] = [];
    for (let i = 0; i < count; i++) {
      newSplats.push({
        id: Date.now() + i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 20 + Math.random() * 60,
        rotation: Math.random() * 360,
      });
    }
    setSplats((prev) => [...prev, ...newSplats]);
    // Clean up old splats after animation
    setTimeout(() => {
      setSplats((prev) => prev.filter((s) => !newSplats.find((n) => n.id === s.id)));
    }, 2000);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-45 overflow-hidden">
      {splats.map((splat) => (
        <div
          key={splat.id}
          className="absolute animate-blood-splat"
          style={{
            left: `${splat.x}%`,
            top: `${splat.y}%`,
            width: `${splat.size}px`,
            height: `${splat.size}px`,
            transform: `rotate(${splat.rotation}deg)`,
          }}
        >
          <div className="w-full h-full rounded-full bg-red-800/50 blur-sm" />
          <div className="absolute inset-1 rounded-full bg-red-900/60" />
        </div>
      ))}
    </div>
  );
};

export default BloodSplatter;

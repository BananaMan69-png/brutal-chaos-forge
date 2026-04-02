import { useEffect, useMemo } from "react";

interface WeatherEffectsProps {
  conditions: string;
}

const WeatherEffects = ({ conditions }: WeatherEffectsProps) => {
  const lower = conditions.toLowerCase();

  const effects = useMemo(() => {
    const result: string[] = [];
    if (/chuva|tempestade|dilúvio|tormenta/.test(lower)) result.push("rain");
    if (/neve|nevasca|gelo|frio/.test(lower)) result.push("snow");
    if (/fogo|lava|vulcão|inferno|chamas/.test(lower)) result.push("fire");
    if (/meteoro|asteroide|cometa/.test(lower)) result.push("meteors");
    if (/neblina|névoa|nevoeiro|fog/.test(lower)) result.push("fog");
    if (/raio|relâmpago|trovão|lightning/.test(lower)) result.push("lightning");
    if (/vento|furacão|tornado|vendaval/.test(lower)) result.push("wind");
    if (/noite|escuridão|trevas/.test(lower)) result.push("dark");
    return result;
  }, [lower]);

  if (effects.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {effects.includes("rain") && <RainEffect />}
      {effects.includes("snow") && <SnowEffect />}
      {effects.includes("fire") && <FireEffect />}
      {effects.includes("meteors") && <MeteorEffect />}
      {effects.includes("fog") && <FogEffect />}
      {effects.includes("lightning") && <LightningEffect />}
      {effects.includes("wind") && <WindEffect />}
      {effects.includes("dark") && <DarkOverlay />}
    </div>
  );
};

const RainEffect = () => (
  <div className="absolute inset-0">
    {[...Array(80)].map((_, i) => (
      <div
        key={i}
        className="absolute w-[1px] bg-gradient-to-b from-transparent via-blue-400/40 to-blue-300/60 animate-rain"
        style={{
          left: `${Math.random() * 100}%`,
          height: `${15 + Math.random() * 25}px`,
          animationDuration: `${0.4 + Math.random() * 0.4}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

const SnowEffect = () => (
  <div className="absolute inset-0">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-white/60 animate-snow"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${3 + Math.random() * 4}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

const FireEffect = () => (
  <div className="absolute inset-0">
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-600/20 via-red-600/10 to-transparent animate-pulse" />
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute bottom-0 w-2 h-2 rounded-full bg-ember animate-fire-particle"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${1 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

const MeteorEffect = () => (
  <div className="absolute inset-0">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-16 bg-gradient-to-b from-orange-400 via-red-500 to-transparent rounded-full animate-meteor"
        style={{
          left: `${10 + Math.random() * 80}%`,
          top: `-${Math.random() * 20}%`,
          animationDuration: `${1.5 + Math.random() * 2}s`,
          animationDelay: `${i * 1.5 + Math.random() * 2}s`,
          transform: `rotate(${20 + Math.random() * 30}deg)`,
        }}
      />
    ))}
  </div>
);

const FogEffect = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-white/10 to-transparent animate-fog" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/8 animate-fog" style={{ animationDelay: "3s" }} />
  </div>
);

const LightningEffect = () => (
  <div className="absolute inset-0 animate-lightning-flash" />
);

const WindEffect = () => (
  <div className="absolute inset-0">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wind-line"
        style={{
          top: `${10 + Math.random() * 80}%`,
          width: `${60 + Math.random() * 40}%`,
          animationDuration: `${1 + Math.random() * 1.5}s`,
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ))}
  </div>
);

const DarkOverlay = () => (
  <div className="absolute inset-0 bg-black/30" />
);

export default WeatherEffects;

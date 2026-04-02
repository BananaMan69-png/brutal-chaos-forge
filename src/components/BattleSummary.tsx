import { useState, useEffect } from "react";
import { RotateCcw, Trophy, Skull, Swords } from "lucide-react";

interface BattleSummaryProps {
  summaryText: string;
  teamA: string[];
  teamB: string[];
  totalSteps: number;
  location: string;
  conditions: string;
  fighterImages: Record<string, string>;
  onRestart: () => void;
}

const BattleSummary = ({
  summaryText,
  teamA,
  teamB,
  totalSteps,
  location,
  conditions,
  fighterImages,
  onRestart,
}: BattleSummaryProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 ${show ? "opacity-100" : "opacity-0"}`}>
      {/* Blood vignette */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/20" />
      </div>

      <div className="relative z-10 max-w-lg w-full space-y-6">
        {/* Trophy */}
        <div className="text-center animate-brutal-entrance">
          <Trophy className="w-16 h-16 mx-auto text-ember mb-2" />
          <h2 className="font-title text-3xl text-primary text-glow-red">BATALHA ENCERRADA</h2>
        </div>

        {/* Stats card */}
        <div className="glass-dark brutal-border rounded-xl p-5 space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Swords className="w-4 h-4" /> {totalSteps} turnos</span>
            <span>📍 {location}</span>
          </div>
          {conditions && (
            <p className="text-xs text-muted-foreground text-center">🌩️ {conditions}</p>
          )}
        </div>

        {/* Teams display with images */}
        <div className="flex gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex-1 glass-dark rounded-xl p-3">
            <p className="font-title text-xs text-ember text-center mb-2">TIME A 🔥</p>
            <div className="space-y-2">
              {teamA.map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                  {fighterImages[name] ? (
                    <img src={fighterImages[name]} alt={name} className="w-8 h-8 rounded-full object-cover border border-ember" />
                  ) : (
                    <Skull className="w-5 h-5 text-ember shrink-0" />
                  )}
                  <span className="text-xs truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 glass-dark rounded-xl p-3">
            <p className="font-title text-xs text-primary text-center mb-2">TIME B 💀</p>
            <div className="space-y-2">
              {teamB.map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                  {fighterImages[name] ? (
                    <img src={fighterImages[name]} alt={name} className="w-8 h-8 rounded-full object-cover border border-primary" />
                  ) : (
                    <Skull className="w-5 h-5 text-primary shrink-0" />
                  )}
                  <span className="text-xs truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary text */}
        <div className="glass-dark brutal-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h3 className="font-title text-sm text-ember mb-3">📜 RESUMO DA CARNIFICINA</h3>
          <p className="text-sm leading-relaxed text-foreground">{summaryText}</p>
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="w-full py-4 font-title text-sm tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-blood-glow transition-colors flex items-center justify-center gap-2 animate-pulse-blood animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <RotateCcw className="w-4 h-4" /> NOVA BATALHA
        </button>
      </div>
    </div>
  );
};

export default BattleSummary;

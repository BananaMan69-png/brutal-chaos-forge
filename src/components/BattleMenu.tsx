import { useState, useEffect } from "react";
import { Sword, Skull, Flame } from "lucide-react";

interface BattleMenuProps {
  onStart: () => void;
}

const BattleMenu = ({ onStart }: BattleMenuProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowTitle(true), 300);
    setTimeout(() => setShowSubtitle(true), 800);
    setTimeout(() => setShowButton(true), 1200);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-blood/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      
      {/* Floating embers */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-ember animate-float-up"
          style={{
            left: `${15 + Math.random() * 70}%`,
            bottom: `${Math.random() * 30}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}

      <div className="relative z-10 text-center px-4">
        {/* Skull icon */}
        <div className={`mb-6 transition-all duration-700 ${showTitle ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <Skull className="w-16 h-16 mx-auto text-primary" />
        </div>

        {/* Title */}
        <h1
          className={`font-title text-5xl sm:text-7xl md:text-8xl text-primary text-glow-red tracking-wider transition-all duration-700 ${
            showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          BATALHA
        </h1>
        <h1
          className={`font-title text-4xl sm:text-6xl md:text-7xl text-ember text-glow-ember tracking-widest mt-1 transition-all duration-700 delay-200 ${
            showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          BRUTAL
        </h1>

        {/* Subtitle */}
        <p
          className={`text-muted-foreground mt-6 text-sm sm:text-base max-w-md mx-auto transition-all duration-500 ${
            showSubtitle ? "opacity-100" : "opacity-0"
          }`}
        >
          Qualquer criatura. Qualquer pessoa. Qualquer coisa. Só uma sobrevive.
        </p>

        {/* Start button */}
        <button
          onClick={onStart}
          className={`mt-10 group relative px-10 py-4 font-title text-lg tracking-wider text-primary-foreground bg-primary rounded-lg 
            hover:bg-blood-glow transition-all duration-300 animate-pulse-blood
            ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <span className="flex items-center gap-3">
            <Sword className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            INICIAR BATALHA
            <Flame className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </span>
        </button>
      </div>

      {/* Bottom blood drip decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 blood-gradient" />
    </div>
  );
};

export default BattleMenu;

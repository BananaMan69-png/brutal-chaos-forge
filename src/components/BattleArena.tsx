import { useState, useEffect, useCallback } from "react";
import { Skull, SkipForward, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BattleArenaProps {
  teamA: string[];
  teamB: string[];
  location: string;
  conditions: string;
  onRestart: () => void;
}

interface BattleStep {
  text: string;
  type: "action" | "critical" | "death" | "summary";
}

const BattleArena = ({ teamA, teamB, location, conditions, onRestart }: BattleArenaProps) => {
  const [steps, setSteps] = useState<BattleStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [battleOver, setBattleOver] = useState(false);

  const generateBattle = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("brutal-battle", {
        body: { teamA, teamB, location, conditions },
      });

      if (error) throw error;
      if (data?.steps) {
        setSteps(data.steps);
      }
    } catch (err) {
      console.error("Battle generation error:", err);
      toast.error("Erro ao gerar a batalha! Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [teamA, teamB, location, conditions]);

  useEffect(() => {
    generateBattle();
  }, [generateBattle]);

  const triggerEffects = (step: BattleStep) => {
    if (step.type === "critical" || step.type === "death") {
      setIsShaking(true);
      setIsFlashing(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setIsFlashing(false), 300);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      triggerEffects(steps[next]);
      if (steps[next].type === "summary") {
        setBattleOver(true);
      }
    }
  };

  const currentBattleStep = steps[currentStep];

  const getStepColor = (type: string) => {
    switch (type) {
      case "critical": return "text-ember";
      case "death": return "text-primary";
      case "summary": return "text-foreground";
      default: return "text-foreground";
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "death": return "💀";
      case "critical": return "🩸";
      case "summary": return "⚔️";
      default: return "⚡";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Skull className="w-16 h-16 text-primary animate-pulse" />
        <p className="font-title text-xl text-primary text-glow-red">PREPARANDO A CARNIFICINA...</p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isShaking ? "animate-shake" : ""}`}>
      {/* Red flash overlay */}
      {isFlashing && <div className="fixed inset-0 z-50 animate-flash-red pointer-events-none" />}

      {/* Header with teams */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex-1 text-center">
          <p className="font-title text-xs text-ember">TIME A</p>
          <p className="text-xs text-muted-foreground truncate">{teamA.join(", ")}</p>
        </div>
        <div className="font-title text-lg text-primary animate-vs-pulse mx-2">VS</div>
        <div className="flex-1 text-center">
          <p className="font-title text-xs text-primary">TIME B</p>
          <p className="text-xs text-muted-foreground truncate">{teamB.join(", ")}</p>
        </div>
      </div>

      {/* Location bar */}
      <div className="text-center py-2 bg-secondary/30 border-b border-border">
        <p className="text-xs text-muted-foreground">
          📍 {location} {conditions && `• ${conditions}`}
        </p>
      </div>

      {/* Battle log */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {currentBattleStep && (
          <div className="max-w-lg w-full animate-brutal-entrance" key={currentStep}>
            <div className="glass-dark brutal-border rounded-xl p-6 space-y-4">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Turno {currentStep + 1}/{steps.length}</span>
                <span className="text-lg">{getStepIcon(currentBattleStep.type)}</span>
              </div>

              {/* Step text */}
              <p className={`text-base sm:text-lg leading-relaxed ${getStepColor(currentBattleStep.type)}`}>
                {currentBattleStep.text}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        {battleOver ? (
          <button
            onClick={onRestart}
            className="w-full py-4 font-title text-sm tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-blood-glow transition-colors flex items-center justify-center gap-2 animate-pulse-blood"
          >
            <RotateCcw className="w-4 h-4" /> NOVA BATALHA
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
            className="w-full py-4 font-title text-sm tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-blood-glow transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4" /> PRÓXIMO
          </button>
        )}
      </div>
    </div>
  );
};

export default BattleArena;

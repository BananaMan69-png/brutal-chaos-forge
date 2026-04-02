import { useState, useEffect, useCallback } from "react";
import { Skull, SkipForward } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import WeatherEffects from "./WeatherEffects";
import BloodSplatter from "./BloodSplatter";
import BattleSummary from "./BattleSummary";
import { useSoundEngine } from "@/hooks/useSoundEngine";

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
  const [showSummary, setShowSummary] = useState(false);
  const [bloodTrigger, setBloodTrigger] = useState(0);
  const [fighterImages, setFighterImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(true);

  const sound = useSoundEngine(conditions);

  // Generate fighter images
  useEffect(() => {
    const allFighters = [...teamA, ...teamB];
    let mounted = true;

    const generateImages = async () => {
      const images: Record<string, string> = {};
      // Generate in parallel but with slight delays to avoid rate limits
      const promises = allFighters.map(async (name, i) => {
        try {
          await new Promise((r) => setTimeout(r, i * 500));
          if (!mounted) return;
          const { data, error } = await supabase.functions.invoke("generate-fighter-image", {
            body: { name },
          });
          if (!error && data?.imageUrl) {
            images[name] = data.imageUrl;
            if (mounted) setFighterImages({ ...images });
          }
        } catch (err) {
          console.warn(`Failed to generate image for ${name}:`, err);
        }
      });

      await Promise.all(promises);
      if (mounted) {
        setFighterImages(images);
        setLoadingImages(false);
      }
    };

    generateImages();
    return () => { mounted = false; };
  }, [teamA, teamB]);

  const generateBattle = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("brutal-battle", {
        body: { teamA, teamB, location, conditions },
      });

      if (error) throw error;
      if (data?.steps) {
        // Filter out summary from steps, keep it separate
        const battleSteps = data.steps.filter((s: BattleStep) => s.type !== "summary");
        const summaryStep = data.steps.find((s: BattleStep) => s.type === "summary");
        if (summaryStep) {
          battleSteps.push(summaryStep); // Keep at end but we'll handle display separately
        }
        setSteps(data.steps);
      }
    } catch (err) {
      console.error("Battle generation error:", err);
      toast.error("Erro ao gerar a batalha! Tente novamente.");
    } finally {
      setIsLoading(false);
      // Start ambient sound after loading
      sound.startAmbient();
    }
  }, [teamA, teamB, location, conditions]);

  useEffect(() => {
    generateBattle();
    return () => { sound.stopAmbient(); };
  }, [generateBattle]);

  const triggerEffects = (step: BattleStep) => {
    if (step.type === "action") {
      sound.playImpact();
    }
    if (step.type === "critical") {
      setIsShaking(true);
      setIsFlashing(true);
      setBloodTrigger((prev) => prev + 1);
      sound.playCritical();
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setIsFlashing(false), 300);
    }
    if (step.type === "death") {
      setIsShaking(true);
      setIsFlashing(true);
      setBloodTrigger((prev) => prev + 1);
      sound.playDeath();
      setTimeout(() => setIsShaking(false), 600);
      setTimeout(() => setIsFlashing(false), 400);
    }
  };

  const nextStep = () => {
    sound.playClick();
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      if (steps[next].type === "summary") {
        sound.stopAmbient();
        sound.playVictory();
        setShowSummary(true);
        return;
      }
      setCurrentStep(next);
      triggerEffects(steps[next]);
    }
  };

  const currentBattleStep = steps[currentStep];
  const nonSummarySteps = steps.filter((s) => s.type !== "summary");
  const summaryStep = steps.find((s) => s.type === "summary");

  const getStepColor = (type: string) => {
    switch (type) {
      case "critical": return "text-ember";
      case "death": return "text-primary";
      default: return "text-foreground";
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "death": return "💀";
      case "critical": return "🩸";
      default: return "⚡";
    }
  };

  if (showSummary && summaryStep) {
    return (
      <BattleSummary
        summaryText={summaryStep.text}
        teamA={teamA}
        teamB={teamB}
        totalSteps={nonSummarySteps.length}
        location={location}
        conditions={conditions}
        fighterImages={fighterImages}
        onRestart={onRestart}
      />
    );
  }

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
        {/* Show fighter images as they load */}
        {Object.keys(fighterImages).length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-xs">
            {Object.entries(fighterImages).map(([name, url]) => (
              <div key={name} className="text-center animate-brutal-entrance">
                <img src={url} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[60px]">{name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isShaking ? "animate-shake" : ""}`}>
      {/* Weather effects */}
      <WeatherEffects conditions={conditions} />
      
      {/* Blood splatters */}
      <BloodSplatter trigger={bloodTrigger} />

      {/* Red flash overlay */}
      {isFlashing && <div className="fixed inset-0 z-50 animate-flash-red pointer-events-none" />}

      {/* Header with teams and images */}
      <div className="flex items-center justify-between p-3 border-b border-border relative z-10">
        <div className="flex-1 flex items-center gap-2 justify-center">
          <div className="flex -space-x-2">
            {teamA.map((name, i) => (
              fighterImages[name] ? (
                <img key={i} src={fighterImages[name]} alt={name} className="w-8 h-8 rounded-full object-cover border border-ember" />
              ) : (
                <div key={i} className="w-8 h-8 rounded-full bg-secondary border border-ember flex items-center justify-center text-[10px]">
                  {name.charAt(0)}
                </div>
              )
            ))}
          </div>
          <div>
            <p className="font-title text-[10px] text-ember">TIME A</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">{teamA.join(", ")}</p>
          </div>
        </div>
        <div className="font-title text-lg text-primary animate-vs-pulse mx-2">VS</div>
        <div className="flex-1 flex items-center gap-2 justify-center">
          <div>
            <p className="font-title text-[10px] text-primary text-right">TIME B</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[80px] text-right">{teamB.join(", ")}</p>
          </div>
          <div className="flex -space-x-2">
            {teamB.map((name, i) => (
              fighterImages[name] ? (
                <img key={i} src={fighterImages[name]} alt={name} className="w-8 h-8 rounded-full object-cover border border-primary" />
              ) : (
                <div key={i} className="w-8 h-8 rounded-full bg-secondary border border-primary flex items-center justify-center text-[10px]">
                  {name.charAt(0)}
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Location bar */}
      <div className="text-center py-2 bg-secondary/30 border-b border-border relative z-10">
        <p className="text-xs text-muted-foreground">
          📍 {location} {conditions && `• ${conditions}`}
        </p>
      </div>

      {/* Battle log */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {currentBattleStep && currentBattleStep.type !== "summary" && (
          <div className="max-w-lg w-full animate-brutal-entrance" key={currentStep}>
            <div className="glass-dark brutal-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Turno {currentStep + 1}/{nonSummarySteps.length}</span>
                <span className="text-lg">{getStepIcon(currentBattleStep.type)}</span>
              </div>

              <p className={`text-base sm:text-lg leading-relaxed ${getStepColor(currentBattleStep.type)}`}>
                {currentBattleStep.text}
              </p>

              <div className="w-full bg-secondary rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / nonSummarySteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border relative z-10">
        <button
          onClick={nextStep}
          className="w-full py-4 font-title text-sm tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-blood-glow transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
        >
          <SkipForward className="w-4 h-4" /> PRÓXIMO
        </button>
      </div>
    </div>
  );
};

export default BattleArena;

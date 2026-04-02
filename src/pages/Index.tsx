import { useState } from "react";
import BattleMenu from "@/components/BattleMenu";
import TeamSetup from "@/components/TeamSetup";
import BattleArena from "@/components/BattleArena";

type GameState = "menu" | "setup" | "battle";

interface BattleConfig {
  teamA: string[];
  teamB: string[];
  location: string;
  conditions: string;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [battleConfig, setBattleConfig] = useState<BattleConfig | null>(null);

  const handleStartBattle = (teamA: string[], teamB: string[], location: string, conditions: string) => {
    setBattleConfig({ teamA, teamB, location, conditions });
    setGameState("battle");
  };

  const handleRestart = () => {
    setBattleConfig(null);
    setGameState("menu");
  };

  return (
    <div className="min-h-screen bg-background">
      {gameState === "menu" && <BattleMenu onStart={() => setGameState("setup")} />}
      {gameState === "setup" && (
        <TeamSetup onStartBattle={handleStartBattle} onBack={() => setGameState("menu")} />
      )}
      {gameState === "battle" && battleConfig && (
        <BattleArena {...battleConfig} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;

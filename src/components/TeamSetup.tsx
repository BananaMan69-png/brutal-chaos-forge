import { useState } from "react";
import { Plus, X, Swords, MapPin, Cloud } from "lucide-react";

interface TeamSetupProps {
  onStartBattle: (teamA: string[], teamB: string[], location: string, conditions: string) => void;
  onBack: () => void;
}

const TeamSetup = ({ onStartBattle, onBack }: TeamSetupProps) => {
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [step, setStep] = useState<"teams" | "location">("teams");
  const [location, setLocation] = useState("");
  const [conditions, setConditions] = useState("");

  const addToTeam = (team: "A" | "B") => {
    if (team === "A" && inputA.trim()) {
      setTeamA([...teamA, inputA.trim()]);
      setInputA("");
    } else if (team === "B" && inputB.trim()) {
      setTeamB([...teamB, inputB.trim()]);
      setInputB("");
    }
  };

  const removeFromTeam = (team: "A" | "B", index: number) => {
    if (team === "A") setTeamA(teamA.filter((_, i) => i !== index));
    else setTeamB(teamB.filter((_, i) => i !== index));
  };

  const canProceed = teamA.length > 0 && teamB.length > 0;
  const canStart = location.trim().length > 0;

  if (step === "location") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-slide-up">
        <div className="w-full max-w-lg space-y-6">
          <h2 className="font-title text-3xl text-primary text-glow-red text-center">CAMPO DE BATALHA</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" /> Local da batalha
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Coliseu Romano, Praça da Sé, Vulcão ativo..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Cloud className="w-4 h-4" /> Condições (opcional)
              </label>
              <input
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Ex: Chuva de meteoros, neblina densa, terremoto..."
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("teams")}
              className="flex-1 py-3 font-title text-sm tracking-wider bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              VOLTAR
            </button>
            <button
              onClick={() => onStartBattle(teamA, teamB, location, conditions)}
              disabled={!canStart}
              className="flex-1 py-3 font-title text-sm tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-blood-glow transition-colors disabled:opacity-30 disabled:cursor-not-allowed animate-pulse-blood"
            >
              ⚔️ COMEÇAR BATALHA
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="font-title text-2xl sm:text-3xl text-primary text-glow-red">MONTEM SEUS TIMES</h2>
        <p className="text-muted-foreground text-xs mt-1">Adicione qualquer coisa: pessoas, criaturas, objetos...</p>
      </div>

      {/* Teams */}
      <div className="flex-1 flex flex-col sm:flex-row gap-4 relative">
        {/* Team A */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-title text-lg text-ember text-center mb-3">TIME A 🔥</h3>
          <div className="flex-1 glass-dark rounded-lg p-3 space-y-2 min-h-[150px]">
            {teamA.map((unit, i) => (
              <div key={i} className="flex items-center justify-between bg-secondary/50 rounded px-3 py-2 animate-brutal-entrance">
                <span className="text-sm font-medium">{unit}</span>
                <button onClick={() => removeFromTeam("A", i)} className="text-muted-foreground hover:text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToTeam("A")}
              placeholder="Nome da unidade..."
              className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ember"
            />
            <button onClick={() => addToTeam("A")} className="p-2 bg-ember text-accent-foreground rounded-lg hover:opacity-80">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center sm:flex-col py-2 sm:py-0">
          <div className="hidden sm:block flex-1 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="font-title text-2xl text-primary animate-vs-pulse mx-4 sm:my-4">VS</div>
          <div className="hidden sm:block flex-1 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
          <div className="sm:hidden flex-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-title text-lg text-primary text-center mb-3">TIME B 💀</h3>
          <div className="flex-1 glass-dark rounded-lg p-3 space-y-2 min-h-[150px]">
            {teamB.map((unit, i) => (
              <div key={i} className="flex items-center justify-between bg-secondary/50 rounded px-3 py-2 animate-brutal-entrance">
                <span className="text-sm font-medium">{unit}</span>
                <button onClick={() => removeFromTeam("B", i)} className="text-muted-foreground hover:text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToTeam("B")}
              placeholder="Nome da unidade..."
              className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <button onClick={() => addToTeam("B")} className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-80">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4 pb-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 font-title text-sm tracking-wider bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          VOLTAR
        </button>
        <button
          onClick={() => setStep("location")}
          disabled={!canProceed}
          className="flex-1 py-3 font-title text-sm tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-blood-glow transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" /> PRÓXIMO
        </button>
      </div>
    </div>
  );
};

export default TeamSetup;

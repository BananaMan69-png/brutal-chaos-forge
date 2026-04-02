import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { teamA, teamB, location, conditions } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const totalFighters = teamA.length + teamB.length;

    const systemPrompt = `Você é o narrador do jogo "Batalha Brutal". Você narra batalhas extremamente violentas, brutais e com humor negro pesado (estilo brasileiro, com referências culturais). Suas narrações devem ser:
- MUITO violentas e gráficas (tripas, sangue, ossos quebrando, etc)
- Com humor negro e absurdo
- REALISTAS: considere o poder REAL de cada lutador. Um demônio devorador de mundos NÃO deveria ter dificuldade contra uma formiga. Seja justo com o poder de cada um.
- Em português brasileiro informal e engraçado
- Cada passo deve ser uma ação significativa
- CONSIDERE AS CONDIÇÕES DO AMBIENTE: se está chovendo, nevando, com meteoros, etc - isso DEVE afetar a narrativa e as ações!

REGRAS DE TURNOS DINÂMICOS:
- Se a diferença de poder é ABSURDA (ex: Deus vs formiga), a batalha deve ter apenas 2-4 turnos
- Se os lutadores são equilibrados, 6-10 turnos
- Se há muitos lutadores (${totalFighters}+), pode ter mais turnos para dar atenção a todos
- Nunca faça batalhas artificialmente longas quando o resultado é óbvio

IMPORTANTE: Responda APENAS com um JSON válido, sem nenhum texto antes ou depois. O formato deve ser:
{
  "steps": [
    {"text": "descrição da ação", "type": "action"},
    {"text": "descrição de golpe crítico/brutal", "type": "critical"},
    {"text": "descrição da morte/finalização", "type": "death"},
    {"text": "resumo DETALHADO e épico da batalha: quem venceu, como venceu, estatísticas da carnificina (quantas mortes, litros de sangue estimados, nível de brutalidade de 1-10, etc). Seja criativo e engraçado no resumo!", "type": "summary"}
  ]
}

Tipos: "action" para ações normais, "critical" para momentos brutais, "death" para mortes/finalizações, "summary" para o resumo final.
O último passo DEVE ser do tipo "summary" com um resumo BEM DETALHADO.`;

    const userPrompt = `BATALHA BRUTAL!

TIME A: ${teamA.join(", ")}
TIME B: ${teamB.join(", ")}
LOCAL: ${location}
CONDIÇÕES: ${conditions || "Normal"}

Narre essa batalha brutal passo a passo! Lembre-se: seja o mais violento, engraçado e criativo possível. Considere as características reais de cada lutador. ADAPTE O NÚMERO DE TURNOS ao nível de poder dos lutadores!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit! Espere um pouco e tente novamente." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados. Adicione créditos no workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let battleSteps;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      battleSteps = JSON.parse(jsonStr);
    } catch {
      try {
        battleSteps = JSON.parse(content);
      } catch {
        console.error("Failed to parse AI response:", content);
        battleSteps = {
          steps: [
            { text: "Os combatentes se encaram com ódio mortal...", type: "action" },
            { text: content || "A batalha foi tão brutal que o narrador desmaiou!", type: "action" },
            { text: "O vencedor emerge coberto de sangue dos pés à cabeça. Brutalidade: 10/10. Litros de sangue: incontáveis.", type: "summary" },
          ],
        };
      }
    }

    return new Response(JSON.stringify(battleSteps), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Battle error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

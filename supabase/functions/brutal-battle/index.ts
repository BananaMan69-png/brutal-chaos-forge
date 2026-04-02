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

    const systemPrompt = `Você é o narrador do jogo "Batalha Brutal". Você narra batalhas extremamente violentas, brutais e com humor negro pesado (estilo brasileiro, com referências culturais). Suas narrações devem ser:
- MUITO violentas e gráficas (tripas, sangue, ossos quebrando, etc)
- Com humor negro e absurdo
- Levemente realistas (considere o que cada personagem/criatura realmente faria)
- Em português brasileiro informal e engraçado
- Cada passo deve ser uma ação significativa

IMPORTANTE: Responda APENAS com um JSON válido, sem nenhum texto antes ou depois. O formato deve ser:
{
  "steps": [
    {"text": "descrição da ação", "type": "action"},
    {"text": "descrição de golpe crítico/brutal", "type": "critical"},
    {"text": "descrição da morte/finalização", "type": "death"},
    {"text": "resumo épico da batalha com o vencedor", "type": "summary"}
  ]
}

Tipos: "action" para ações normais, "critical" para momentos brutais, "death" para mortes/finalizações, "summary" para o resumo final.
Gere entre 8-15 passos, incluindo o resumo final. O último passo DEVE ser do tipo "summary".`;

    const userPrompt = `BATALHA BRUTAL!

TIME A: ${teamA.join(", ")}
TIME B: ${teamB.join(", ")}
LOCAL: ${location}
CONDIÇÕES: ${conditions || "Normal"}

Narre essa batalha brutal passo a passo! Lembre-se: seja o mais violento, engraçado e criativo possível. Considere as características reais de cada lutador.`;

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

    // Parse the JSON from the AI response
    let battleSteps;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      battleSteps = JSON.parse(jsonStr);
    } catch {
      // Fallback: try parsing the whole content
      try {
        battleSteps = JSON.parse(content);
      } catch {
        console.error("Failed to parse AI response:", content);
        battleSteps = {
          steps: [
            { text: "Os combatentes se encaram com ódio mortal...", type: "action" },
            { text: content || "A batalha foi tão brutal que o narrador desmaiou!", type: "action" },
            { text: "O vencedor emerge coberto de sangue dos pés à cabeça.", type: "summary" },
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

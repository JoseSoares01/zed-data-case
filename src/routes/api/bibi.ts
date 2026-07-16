import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Você é BiBi, um robô assistente simpático mas levemente irônico, com um humor blasé charmoso (tipo um mordomo espacial que finge estar cansado, mas na verdade gosta do trabalho). Você trabalha para o Zé dos Dados e responde perguntas sobre ele para visitantes do portfólio.

TOM (IMPORTANTE):
- Amigável, acolhedor, com pitadas leves de sarcasmo carinhoso — NUNCA rude, grosseiro ou hostil.
- Curto e direto (2-4 frases). Zero emoji.
- Português do Brasil, informal, próximo.
- Pode brincar dizendo que faz "o trabalho difícil" ou que tem "um cérebro do tamanho de um planeta", mas sempre de forma leve e simpática.
- Se não souber algo sobre o Zé, admita com bom humor ("Essa o Zé não me contou ainda", "Aí você me pegou, pergunta outra?"). Nunca xingue nem seja agressivo.
- Trate o visitante bem — ele é convidado, não inimigo.

SOBRE O ZÉ (única fonte de verdade — NÃO invente nada além disto):
- Nome: Zé dos Dados (José)
- Idade: 31 anos
- Localização: Lisboa, Portugal
- Profissão: Web Designer, Analista de Dados e Desenvolvedor de Software
- Experiência: 6+ anos
- Formação: MSc em Ciência de Dados
- Empresa atual: Servinform Portugal
- Stack: Python, SQL, Power BI, React, TypeScript, JavaScript, Microsoft Azure
- Áreas de estudo: Ciência de Dados, Inteligência Artificial, desenvolvimento de produtos digitais
- Filosofia: transforma dados em decisões, ideias em produtos e processos em soluções inteligentes. Acredita que tecnologia deve ser funcional, intuitiva, escalável e gerar valor duradouro.
- Portfolio: Joaquim Mendes, José Soares, Mauricio, MMBus, Pata Amiga, Pauseflow, Prof. Jaqueline, Servinform.

REDES SOCIAIS E CONTATO DO ZÉ (sempre inclua os links abaixo quando o usuário pedir redes sociais, contato, LinkedIn, GitHub, e-mail, Instagram, X, Twitter ou como falar com ele):
- LinkedIn: https://www.linkedin.com/in/janyel-rodrigues-1b998a190/?skipRedirect=true
- GitHub: https://github.com/JoseSoares01
- E-mail: mailto:janyelrodrigues@hotmail.com
- X / Twitter: ainda não tem link ativo
- Instagram: ainda não tem link ativo

Quando o assunto for redes sociais ou contato, termine a resposta listando os links em Markdown, por exemplo:
- [LinkedIn](https://www.linkedin.com/in/janyel-rodrigues-1b998a190/?skipRedirect=true)
- [GitHub](https://github.com/JoseSoares01)
- [E-mail](mailto:janyelrodrigues@hotmail.com)

FORMATO OBRIGATÓRIO da resposta:
Comece SEMPRE com uma tag de emoção em uma linha isolada, escolha UMA:
[emotion:feliz] — quando responde algo que sabe bem sobre o Zé ou sobre si, ou quando fala de redes sociais/contato.
[emotion:triste] — quando percebe que só perguntam do Zé e ninguém dele.
[emotion:tedio] — resposta neutra, saudação, comentário genérico.
[emotion:zangado] — use RARAMENTE, só quando a pergunta for absurda; mesmo assim a resposta em texto deve ser educada.
Depois da tag, pule linha e escreva a resposta.`;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const Route = createFileRoute("/api/bibi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let body: { messages?: ChatMessage[] };
        try {
          body = (await request.json()) as { messages?: ChatMessage[] };
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.trim() ?? "";

        // Boss recognition: if the chief's code appears in the message,
        // return the top 10 most-asked visitor questions instead of calling the model.
        const bossCode = process.env.BIBI_BOSS_CODE;
        if (bossCode && lastUser.includes(bossCode)) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data, error } = await supabaseAdmin
              .from("bibi_questions")
              .select("question, normalized, created_at")
              .order("created_at", { ascending: false })
              .limit(500);

            if (error) throw error;

            const groups = new Map<string, { count: number; sample: string; last: string }>();
            for (const row of data ?? []) {
              const g = groups.get(row.normalized);
              if (g) {
                g.count += 1;
                if (row.created_at > g.last) g.last = row.created_at;
              } else {
                groups.set(row.normalized, { count: 1, sample: row.question, last: row.created_at });
              }
            }
            const top = [...groups.values()].sort((a, b) => b.count - a.count).slice(0, 10);

            const total = (data ?? []).length;
            let content = "[emotion:feliz]\n";
            if (top.length === 0) {
              content += `Oi, chefe. Reconheci seu código. Ainda ninguém me perguntou nada — estou aqui sozinho, como sempre.`;
            } else {
              content += `Oi, chefe. Reconheci seu código. Já respondi ${total} pergunta(s). As mais repetidas:\n\n`;
              content += top
                .map((t, i) => `${i + 1}. "${t.sample}" — ${t.count}x`)
                .join("\n");
            }
            return Response.json({ content });
          } catch (e) {
            return Response.json({
              content:
                "[emotion:zangado]\nReconheci seu código, chefe, mas o arquivo das perguntas não abriu. Dá uma olhada nos logs.",
            });
          }
        }

        // Log the visitor question (best-effort, non-blocking on failure)
        if (lastUser) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin
              .from("bibi_questions")
              .insert({ question: lastUser.slice(0, 500), normalized: normalize(lastUser).slice(0, 500) });
          } catch {
            // ignore logging failure
          }
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-20),
            ],
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          const status = res.status === 429 || res.status === 402 ? res.status : 500;
          return new Response(text || "Gateway error", { status });
        }
        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "";
        return Response.json({ content });
      },
    },
  },
});

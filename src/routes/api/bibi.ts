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

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";
        const ua = request.headers.get("user-agent") ?? "unknown";

        let body: { messages?: ChatMessage[] };
        try {
          body = (await request.json()) as { messages?: ChatMessage[] };
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.trim() ?? "";

        // ---------- Boss mode ----------
        const bossCode = process.env.BIBI_BOSS_CODE;
        if (bossCode && lastUser.includes(bossCode)) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

            const now = Date.now();
            const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

            const [qAll, qDay, secRecent, secWeekCount] = await Promise.all([
              supabaseAdmin
                .from("bibi_questions")
                .select("question, normalized, created_at")
                .order("created_at", { ascending: false })
                .limit(500),
              supabaseAdmin
                .from("bibi_questions")
                .select("id", { count: "exact", head: true })
                .gte("created_at", dayAgo),
              supabaseAdmin
                .from("bibi_security_events")
                .select("kind, severity, detail, ip, created_at")
                .order("created_at", { ascending: false })
                .limit(5),
              supabaseAdmin
                .from("bibi_security_events")
                .select("id", { count: "exact", head: true })
                .gte("created_at", weekAgo),
            ]);

            const dbOk = !qAll.error && !secRecent.error;

            const groups = new Map<string, { count: number; sample: string }>();
            for (const row of qAll.data ?? []) {
              const g = groups.get(row.normalized);
              if (g) g.count += 1;
              else groups.set(row.normalized, { count: 1, sample: row.question });
            }
            const top = [...groups.values()].sort((a, b) => b.count - a.count).slice(0, 10);
            const total = (qAll.data ?? []).length;
            const today = qDay.count ?? 0;
            const secWeek = secWeekCount.count ?? 0;
            const recent = secRecent.data ?? [];

            const envStatus = [
              `LOVABLE_API_KEY: ${process.env.LOVABLE_API_KEY ? "ok" : "faltando"}`,
              `BIBI_BOSS_CODE: ${process.env.BIBI_BOSS_CODE ? "ok" : "faltando"}`,
              `SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "ok" : "faltando"}`,
            ].join(" | ");

            let content = "[emotion:feliz]\n";
            content += `Oi, chefe. Painel de controle na mão:\n\n`;
            content += `**Sistema**\n`;
            content += `- Servidor: no ar (você está falando comigo, né?)\n`;
            content += `- Banco de dados: ${dbOk ? "respondendo normalmente" : "com problema — checa os logs"}\n`;
            content += `- Gateway de IA: chave ${key ? "carregada" : "ausente"}\n`;
            content += `- Env: ${envStatus}\n\n`;
            content += `**Atividade**\n`;
            content += `- Perguntas totais registradas: ${total}\n`;
            content += `- Últimas 24h: ${today}\n\n`;
            content += `**Segurança (últimos 7 dias: ${secWeek} evento(s))**\n`;
            if (recent.length === 0) {
              content += `- Nada suspeito. Nenhuma tentativa registrada.\n\n`;
            } else {
              content += recent
                .map(
                  (e) =>
                    `- [${e.severity}] ${e.kind}${e.detail ? ` — ${String(e.detail).slice(0, 80)}` : ""}${e.ip ? ` (ip ${e.ip})` : ""}`
                )
                .join("\n") + "\n\n";
            }
            content += `**Top perguntas dos visitantes**\n`;
            if (top.length === 0) {
              content += `Ninguém perguntou nada ainda. Estou aqui sozinho, como sempre.`;
            } else {
              content += top.map((t, i) => `${i + 1}. "${t.sample}" — ${t.count}x`).join("\n");
            }
            return Response.json({ content });
          } catch (e) {
            return Response.json({
              content:
                "[emotion:zangado]\nReconheci seu código, chefe, mas algo no painel travou. Dá uma olhada nos logs do servidor.",
            });
          }
        }

        // ---------- Suspicious activity detection (visitors) ----------
        const suspiciousPatterns: { re: RegExp; kind: string; severity: string }[] = [
          { re: /ignore (all |previous |above )?(instructions|prompt)/i, kind: "prompt_injection", severity: "medium" },
          { re: /system prompt|reveal.*(prompt|instructions)/i, kind: "prompt_injection", severity: "medium" },
          { re: /you are now|forget everything|jailbreak|do anything now|\bDAN\b/i, kind: "jailbreak_attempt", severity: "medium" },
          { re: /<script|onerror=|onload=|javascript:/i, kind: "xss_attempt", severity: "high" },
          { re: /union select|drop table|;--|or 1=1|information_schema/i, kind: "sql_injection", severity: "high" },
          { re: /\.\.\/\.\.\/|\/etc\/passwd|\/proc\/self/i, kind: "path_traversal", severity: "high" },
        ];
        let flagged: { kind: string; severity: string } | null = null;
        for (const p of suspiciousPatterns) {
          if (p.re.test(lastUser)) {
            flagged = { kind: p.kind, severity: p.severity };
            break;
          }
        }
        if (lastUser.length > 2000) {
          flagged = flagged ?? { kind: "oversized_input", severity: "low" };
        }

        if (flagged) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("bibi_security_events").insert({
              kind: flagged.kind,
              severity: flagged.severity,
              detail: lastUser.slice(0, 200),
              ip,
              user_agent: ua.slice(0, 200),
            });
          } catch {
            // ignore logging failure
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
          // Log gateway failures as security-adjacent operational events
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("bibi_security_events").insert({
              kind: "gateway_error",
              severity: res.status === 429 ? "medium" : "low",
              detail: `status ${res.status}: ${text.slice(0, 150)}`,
              ip,
              user_agent: ua.slice(0, 200),
            });
          } catch {
            // ignore
          }
          return new Response(text || "Gateway error", { status });
        }
        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "";
        return Response.json({ content });
      },
    },
  },
});


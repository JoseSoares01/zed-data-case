import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import logoZeDosDados from "@/assets/logo-ze-dos-dados.png.asset.json";
import { BlueprintNumber } from "@/components/BlueprintNumber";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos — Zé dos Dados" },
      { name: "description", content: "Portfólio completo de projetos: apps, sites políticos, plataformas de dados e mais." },
      { property: "og:title", content: "Projetos — Zé dos Dados" },
      { property: "og:description", content: "Explore todos os projetos criados por Zé dos Dados." },
    ],
  }),
  component: ProjetosPage,
});

function ProjetosPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("todos");

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      const cat = p.tag.split("·")[0]?.trim() || p.tag;
      set.add(cat);
    });
    return ["todos", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const cat = p.tag.split("·")[0]?.trim() || p.tag;
      const matchCat = activeTag === "todos" || cat === activeTag;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.year.includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeTag]);

  return (
    <div className="min-h-screen bg-cream text-ink overflow-x-hidden w-full">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6">
        {/* Nav */}
        <header className="flex items-center justify-between border-b border-ink/15 pb-6">
          <Link to="/" className="flex items-center">
            <img src={logoZeDosDados.url} alt="Zé dos Dados" className="h-14 md:h-20 lg:h-24 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            voltar
          </Link>
        </header>

        {/* Title */}
        <section className="pt-12">
          <p className="font-script text-2xl text-ink/60">todo o trabalho.</p>
          <h1 className="font-display text-[14vw] lg:text-[10rem] leading-none tracking-tight">
            projetos<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-ink/70">
            Uma coleção completa dos projetos que desenvolvi — de apps a plataformas de dados,
            passando por campanhas políticas e ferramentas internas.
          </p>
        </section>

        {/* Filters */}
        <section className="mt-12 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTag(cat)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  activeTag === cat
                    ? "bg-ink text-cream border-ink"
                    : "border-ink/30 hover:border-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink/50" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="buscar projeto..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-ink/30 bg-transparent text-sm focus:outline-none focus:border-ink transition-colors"
            />
          </div>
        </section>

        {/* Grid */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative rounded-3xl border border-ink/15 p-6 hover:bg-ink hover:text-cream transition-colors flex flex-col gap-6"
            >
              <div className="flex items-start justify-between">
                <BlueprintNumber value={i + 1} />
                <div className="w-11 h-11 rounded-full border border-current flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-ink transition-all">
                  <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </div>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                <div className="font-display text-2xl md:text-3xl italic leading-tight">
                  {p.title}
                </div>
                <div className="mt-2 flex items-center justify-between text-sm opacity-70">
                  <span>{p.tag}</span>
                  <span>{p.year}</span>
                </div>
              </div>
            </a>
          ))}
        </section>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-ink/60">nenhum projeto encontrado.</p>
        )}

        {/* Footer */}
        <footer className="mt-24 border-t border-ink/15 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span className="font-medium">zé dos dados</span>
          <Link to="/" className="hover:text-accent">← voltar para o início</Link>
          <span className="text-ink/60">© 2026 — Lisboa, PT</span>
        </footer>
      </div>
    </div>
  );
}

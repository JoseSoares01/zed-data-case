import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Globe, Plus, Quote } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.png.asset.json";
import aboutPortrait from "@/assets/about-portrait.png.asset.json";

import proj1 from "@/assets/proj1.jpg";
import proj2 from "@/assets/proj2.jpg";
import proj3 from "@/assets/proj3.jpg";
import proj4 from "@/assets/proj4.jpg";
import proj5 from "@/assets/proj5.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const projects = [
  { title: "Dr. Mauricio Sergio", tag: "Político · Marca Pessoal", url: "https://mauricio-soares.vercel.app/", img: proj2, year: "2026" },
  { title: "Dra. Joaquina Maria", tag: "Campanha Política", url: "https://joaquina-maria-deputada.lovable.app", img: proj1, year: "2026" },
  { title: "Dr. Joaquim Mendes", tag: "Político · Site Oficial", url: "https://joaquim-magic-site.lovable.app", img: proj3, year: "2026" },
  { title: "Profª. Jaqueline Soares", tag: "Professora · Letras", url: "https://jaquelinesoares-letras.lovable.app", img: proj4, year: "2026" },
  { title: "José Soares — Perfil", tag: "Portfólio Pessoal", url: "https://zedosdados-xp.vercel.app/", img: proj5, year: "2026" },
];


function Index() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6">
        {/* Nav */}
        <header className="flex items-center justify-between border-b border-ink/15 pb-6">
          <a href="#" className="flex items-center gap-1 font-display text-2xl tracking-tight">
            <span className="inline-block h-4 w-4 rounded-full bg-ink" />
            <span className="inline-block h-4 w-4 rounded-full bg-ink -ml-1" />
          </a>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {["Início", "Sobre", "Portfólio", "Projetos", "Contato"].map((l, i) => (
              <a key={l} href={`#s${i}`} className="px-4 py-2 hover:text-accent transition-colors flex items-center gap-4">
                {i > 0 && <span className="text-ink/30">/</span>}
                {l}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 text-accent" />
            <span className="font-medium">Lisboa, PT</span>
            <span className="text-muted-foreground">— disponível</span>
          </div>
        </header>

        {/* Hero */}
        <section id="s0" className="grid lg:grid-cols-2 gap-6 pt-10 lg:pt-14">
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="font-display text-[16vw] lg:text-[10rem] leading-[0.85] tracking-tight">
                Zé dos<br />Dados
              </h1>
              <p className="mt-8 max-w-md text-base text-ink/70 lg:ml-auto lg:text-right">
                Bem-vindo a uma jornada visual que atravessa dados, design e código. Descubro a arte dos momentos capturados em movimento — e em números.
              </p>
            </div>


            <div className="mt-12 space-y-8">
              <div className="flex gap-2">
                {[
                  { label: "in", href: "https://www.linkedin.com/in/janyel-rodrigues-1b998a190/?skipRedirect=true" },
                  { label: "gh", href: "https://github.com/JoseSoares01" },
                  { label: "x", href: "#" },
                  { label: "ig", href: "#" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" className="w-10 h-10 rounded-full border border-ink flex items-center justify-center text-xs font-medium hover:bg-ink hover:text-cream transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-8 max-w-md">
                <div>
                  <div className="font-display text-4xl lg:text-5xl">
                    <sup className="text-2xl">+</sup>250k
                  </div>
                  <p className="text-xs text-ink/60 mt-2 leading-relaxed">
                    Linhas de código escritas em projetos que impactam usuários reais
                  </p>
                </div>
                <div>
                  <div className="font-display text-4xl lg:text-5xl">
                    <sup className="text-2xl">+</sup>800k
                  </div>
                  <p className="text-xs text-ink/60 mt-2 leading-relaxed">
                    Data points analisados em pipelines e dashboards em produção
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image card */}
          <div className="relative">
            <div
              className="relative aspect-[4/5] lg:aspect-auto lg:h-full rounded-[2.5rem] bg-accent"
              style={{ overflow: "visible" }}
            >
              <img
                src={heroPortrait.url}
                alt="Zé dos Dados"
                width={1024}
                height={1024}
                className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem]"
              />
              <div className="absolute font-script text-4xl text-cream/90 rotate-[-6deg] pointer-events-none top-10 left-8">
                data · design
              </div>

              {/* Floating globe – overlaps top-right corner */}
              <div
                className="absolute w-[76px] h-[76px] rounded-full bg-ink flex items-center justify-center z-20"
                style={{
                  top: "-32px",
                  right: "-32px",
                  border: "6px solid #fff",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                }}
              >
                <Globe className="w-7 h-7 text-cream" />
              </div>

              {/* Floating column – overlaps bottom-left corner */}
              <div
                className="absolute flex flex-col gap-4 z-20"
                style={{ bottom: "24px", left: "-32px" }}
              >
                <div
                  className="w-[76px] h-[76px] rounded-full overflow-hidden bg-white"
                  style={{ border: "6px solid #fff", boxShadow: "0 12px 35px rgba(0,0,0,0.18)" }}
                >
                  <img src={proj3} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div
                  className="w-[76px] h-[76px] rounded-full overflow-hidden bg-white"
                  style={{ border: "6px solid #fff", boxShadow: "0 12px 35px rgba(0,0,0,0.18)" }}
                >
                  <img src={proj5} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <a
                  href="#portfolio"
                  className="w-[76px] h-[76px] rounded-full bg-ink flex items-center justify-center text-cream hover:scale-105 transition-transform"
                  style={{ border: "6px solid #fff", boxShadow: "0 12px 35px rgba(0,0,0,0.18)" }}
                >
                  <ArrowUpRight className="w-7 h-7" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section id="s1" className="mt-24 -mx-4 sm:-mx-6 lg:-mx-10 bg-ink text-cream py-8 overflow-hidden">
          <div className="flex marquee-track whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-8 pr-8">
                {["sobre", "sobre", "sobre", "sobre"].map((w, j) => (
                  <span key={j} className="font-display text-[10rem] leading-none">
                    {w}<span className="text-accent">.</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>


        {/* About */}
        <section className="bg-ink text-cream -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pb-24 pt-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 grid grid-cols-2 opacity-30">
                <div className="border-r border-cream/20" />
              </div>
              <img src={aboutPortrait.url} alt="Zé dos Dados portrait" width={1024} height={1024} className="relative w-full max-w-md mx-auto" loading="lazy" />
            </div>
            <div className="max-w-lg">
              <p className="font-script text-accent text-3xl mb-4">olá, eu sou o zé</p>
              <h2 className="font-display text-5xl lg:text-6xl leading-[0.95] mb-6">
                web designer,<br />analista de dados<br />& desenvolvedor.
              </h2>
              <p className="text-cream/70 leading-relaxed mb-4">
                +6 anos construindo produtos digitais em Lisboa. Mestrado em Ciências de Dados,
                com foco em transformar dados complexos em interfaces claras e experiências memoráveis.
              </p>
              <p className="text-cream/70 leading-relaxed">
                Trabalho na interseção entre design, engenharia e análise —
                das primeiras linhas do wireframe até a última query do pipeline.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                <div><div className="font-display text-2xl text-accent">06+</div><div className="text-cream/60 mt-1">anos</div></div>
                <div><div className="font-display text-2xl text-accent">MSc</div><div className="text-cream/60 mt-1">ciência de dados</div></div>
                <div><div className="font-display text-2xl text-accent">PT</div><div className="text-cream/60 mt-1">lisboa</div></div>
              </div>
            </div>

          </div>
        </section>

        {/* Portfolio */}
        <section id="s2" className="pt-20 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <h2 className="col-span-full font-display text-[14vw] lg:text-[11rem] leading-none tracking-tight absolute inset-x-0 top-16 pointer-events-none z-10 pl-2">
              portfólio
            </h2>
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              <img src={proj1} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              <img src={proj4} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted lg:col-start-4">
              <img src={proj2} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted col-start-1">
              <img src={proj5} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted opacity-70">
              <img src={proj4} alt="" className="w-full h-full object-cover grayscale" loading="lazy" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-accent col-span-2 lg:col-span-1">
              <img src={proj3} alt="" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Projects list */}
        <section id="s3" className="mt-32">
          <h2 className="font-display text-[14vw] lg:text-[11rem] leading-none tracking-tight">
            projetos<span className="text-accent">.</span>
          </h2>


          <div className="mt-12 border-t border-ink/15">
            {projects.map((p, i) => (
              <a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group grid grid-cols-12 items-center gap-4 border-b border-ink/15 py-8 hover:bg-ink hover:text-cream transition-colors px-2"
              >
                <div className="col-span-1 font-mono text-sm opacity-60">0{i + 1}</div>
                <div className="col-span-11 md:col-span-5 font-display text-2xl md:text-4xl italic">
                  {p.title}
                </div>
                <div className="hidden md:block col-span-3 text-sm opacity-70">
                  {p.tag}
                </div>
                <div className="hidden md:block col-span-2 text-sm opacity-70">
                  {p.year}
                </div>
                <div className="col-span-12 md:col-span-1 flex justify-end">
                  <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-ink transition-all">
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section id="s4" className="mt-32 mb-16">
          <div className="rounded-[2.5rem] bg-accent p-10 lg:p-16 relative overflow-hidden">
            <p className="font-script text-3xl text-ink/70">vamos criar algo juntos?</p>
            <h2 className="font-display text-6xl lg:text-8xl leading-[0.9] mt-4 max-w-3xl">
              tem um projeto<br />em mente?
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="mailto:ola@zedosdados.pt" className="inline-flex items-center gap-3 bg-ink text-cream rounded-full px-8 py-4 font-medium hover:scale-[1.02] transition-transform">
                ola@zedosdados.pt
                <ArrowUpRight className="w-5 h-5" />
              </a>
              <span className="text-ink/70">— resposta em 24h</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-ink/15 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-ink" />
            <span className="inline-block h-3 w-3 rounded-full bg-ink -ml-1" />
            <span className="ml-2 font-medium">zé dos dados</span>
          </div>
          <nav className="flex gap-6 text-ink/70">
            {["Início", "Sobre", "Portfólio", "Projetos", "Contato"].map((l, i) => (
              <a key={l} href={`#s${i}`} className="hover:text-accent">{l}</a>
            ))}
          </nav>
          <div className="text-ink/60">© 2026 — Lisboa, PT</div>
        </footer>

      </div>
    </div>
  );
}

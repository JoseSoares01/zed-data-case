import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowUpRight, BarChart3, ChevronLeft, ChevronRight, Code2, FileText,
  Github, Linkedin, Mail, MapPin, Menu, MessageCircle, Rocket, Settings, X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroZeCartoon from "@/assets/hero-ze-new.png.asset.json";
import aboutPortrait from "@/assets/about-portrait.png.asset.json";
import { MusicPlayer } from "@/components/MusicPlayer";
import { IntroLoader } from "@/components/IntroLoader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Editable } from "@/editor/Editable";
import { TypewriterText } from "@/components/TypewriterText";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zé dos Dados — Data Analyst, Developer & Automation · Lisboa" },
      { name: "description", content: "Transformo dados, ideias e processos em soluções digitais que geram resultados reais. Data Analyst e Developer em Lisboa." },
      { property: "og:title", content: "Zé dos Dados — Data Analyst, Developer & Automation" },
      { property: "og:description", content: "Transformo dados, ideias e processos em soluções digitais que geram resultados reais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = "janyelrodrigues@hotmail.com";
const LINKEDIN = "https://www.linkedin.com/in/janyel-rodrigues-1b998a190/?skipRedirect=true";
const GITHUB = "https://github.com/JoseSoares01";

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Skills", href: "#skills" },
  { label: "Projetos", href: "#projetos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

const TECH = [
  { name: "Python", icon: "python/python-original.svg" },
  { name: "SQL", icon: "azuresqldatabase/azuresqldatabase-original.svg" },
  { name: "Power BI", icon: null },
  { name: "React", icon: "react/react-original.svg" },
  { name: "TypeScript", icon: "typescript/typescript-original.svg" },
  { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg" },
  { name: "JavaScript", icon: "javascript/javascript-original.svg" },
  { name: "Azure", icon: "azure/azure-original.svg" },
];

const TESTIMONIALS = [
  { name: "Dr. Maurício Soares", role: "Candidato a Deputado", text: "A transformação digital da minha campanha foi impressionante. Zé conseguiu traduzir dados complexos em uma narrativa visual que realmente conectou com os eleitores." },
  { name: "Dra. Joaquina Maria", role: "Deputada Estadual", text: "Profissionalismo e criatividade em cada detalhe. O site que ele desenvolveu elevou minha presença online para um nível completamente novo." },
  { name: "Prof.ª Jaqueline Soares", role: "Professora de Letras", text: "Zé tem um dom para transformar conceitos abstratos em interfaces claras e intuitivas. Meu portfólio acadêmico nunca pareceu tão profissional." },
  { name: "Dr. Joaquim Mendes", role: "Vereador", text: "A análise de dados que ele realizou mudou completamente nossa estratégia de campanha. Resultados concretos e visíveis em poucos meses." },
  { name: "Carolina Ribeiro", role: "Diretora de Marketing, TechLisboa", text: "Trabalhar com Zé é garantia de qualidade. Ele entrega não apenas design bonito, mas soluções baseadas em dados que realmente funcionam." },
  { name: "André Ferreira", role: "CEO, Startup Analytics PT", text: "O dashboard que ele construiu para nossa empresa reduziu nosso tempo de análise em 60%. Simplesmente revolucionário." },
  { name: "Mariana Costa", role: "Fundadora, EducaDigital", text: "A plataforma que Zé desenvolveu para nós é intuitiva, rápida e linda. Nossos professores adoram usar todos os dias." },
  { name: "Ricardo Almeida", role: "Consultor Político", text: "Raramente encontro alguém que combine tão bem habilidades técnicas com sensibilidade estética. Um profissional completo." },
  { name: "Sofia Martins", role: "Gerente de Produto, DataViz Co", text: "Cada projeto com Zé é uma aula de como dados e design devem coexistir. Ele eleva o padrão de tudo que toca." },
  { name: "Pedro Henrique", role: "Candidato a Prefeito", text: "Minha campanha ganhou vida digital graças ao trabalho do Zé. Engajamento triplicou em duas semanas." },
  { name: "Luísa Fernandes", role: "Diretora Criativa, Agência Porto", text: "Contratamos Zé como freelancer e acabamos querendo tê-lo em todos os projetos. É um talento raro no mercado português." },
  { name: "Tiago Sousa", role: "Fundador, PoliTech Portugal", text: "A visão analítica combinada com o design impecável faz do Zé um parceiro estratégico indispensável para nossos clientes políticos." },
];

const SKILLS = [
  { title: "Data Analytics", items: ["Python", "SQL", "Power BI", "Pandas", "NumPy", "Excel", "DAX"] },
  { title: "Development", items: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "PostgreSQL"] },
  { title: "Automation", items: ["Python", "APIs", "Excel Automation", "Process Automation"] },
];

const STEPS = [
  { icon: MessageCircle, title: "Entender", text: "Compreender o problema e os objetivos." },
  { icon: FileText, title: "Planejar", text: "Definir a melhor estratégia e tecnologia." },
  { icon: Code2, title: "Desenvolver", text: "Construir a solução com foco em qualidade." },
  { icon: Rocket, title: "Entregar", text: "Acompanhar resultados e evoluir continuamente." },
];

/* ---------- primitives ---------- */

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Dot() {
  return <span className="text-accent">.</span>;
}

function Label({ n, children, dark = false }: { n?: string; children: ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-cream/60" : "text-muted-foreground"}`}>
      {n && <span className="text-accent">{n}.</span>}
      {children}
    </p>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
const btnPrimary = `${btnBase} bg-ink text-cream hover:bg-ink/85 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5`;
const btnOutline = `${btnBase} border border-ink text-ink hover:bg-ink hover:text-cream`;
const btnOutlineDark = `${btnBase} border border-cream/40 text-cream hover:bg-cream hover:text-ink`;

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#inicio" className={`font-display leading-[0.85] text-lg ${dark ? "text-cream" : "text-ink"}`} aria-label="Zé dos Dados — início">
      ZÉ <span className="text-[0.6em] align-top">DOS</span>
      <br />
      DADOS<Dot />
    </a>
  );
}

/* ---------- page ---------- */

function Index() {
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = projects.slice(0, 6);

  return (
    <div className="min-h-screen bg-cream text-ink overflow-x-hidden w-full">
      <SmoothScroll />
      {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}
      <MusicPlayer autoStart={introDone} />

      {/* Header */}
      <Editable id="Navbar" label="Navbar">
        <header className="sticky top-0 z-50 border-b border-border/70 bg-cream/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
            <Logo />
            <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium" aria-label="Principal">
              {NAV.map((n) =>
                n.label === "Projetos" ? (
                  <Link key={n.label} to="/projetos" className="text-ink/70 hover:text-ink transition-colors">{n.label}</Link>
                ) : (
                  <a key={n.label} href={n.href} className="text-ink/70 hover:text-ink transition-colors">{n.label}</a>
                ),
              )}
            </nav>
            <div className="hidden lg:flex items-center gap-5 text-xs">
              <span className="flex items-center gap-1.5 text-ink/70"><MapPin className="h-3.5 w-3.5 text-accent" /> Lisboa, PT</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Disponível</span>
              <a href="#contato" className={`${btnPrimary} py-2.5`}>Vamos conversar <ArrowRight className="h-4 w-4" /></a>
            </div>
            <button
              className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-border"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
      </Editable>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink text-cream px-6 py-5 animate-fade-in lg:hidden">
          <div className="flex items-center justify-between">
            <Logo dark />
            <button onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-md border border-cream/20" aria-label="Fechar menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-14 flex flex-col gap-4">
            {NAV.map((n, i) =>
              n.label === "Projetos" ? (
                <Link key={n.label} to="/projetos" onClick={() => setMenuOpen(false)} className="font-display text-4xl">
                  <span className="mr-3 text-xs text-accent align-middle">0{i + 1}</span>{n.label}
                </Link>
              ) : (
                <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)} className="font-display text-4xl">
                  <span className="mr-3 text-xs text-accent align-middle">0{i + 1}</span>{n.label}
                </a>
              ),
            )}
          </nav>
          <a href="#contato" onClick={() => setMenuOpen(false)} className={`${btnBase} mt-auto bg-accent text-ink`}>
            Vamos conversar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}

      <main>
        {/* Hero */}
        <Editable id="Hero" label="Hero">
          <section id="inicio" className="relative overflow-x-clip mx-auto max-w-[1320px] px-5 pt-12 pb-16 lg:px-10 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <Reveal><Label>Data Analyst · Developer · Automation</Label></Reveal>
                <Reveal delay={100}>
                  <h1 className="mt-6 font-display text-[18vw] leading-[0.86] tracking-[-0.04em] sm:text-[7rem] lg:text-[8.5rem] xl:text-[9.5rem]">
                    Zé dos<br />Dados<Dot />
                  </h1>
                </Reveal>
                <Reveal delay={200}>
                  <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">
                    Transformo dados, ideias e processos em soluções digitais que geram resultados reais para pessoas e negócios.
                  </p>
                </Reveal>
                <Reveal delay={300}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#projetos" className={btnPrimary}>Ver projetos <ArrowRight className="h-4 w-4" /></a>
                    <a href="#sobre" className={btnOutline}>Sobre mim</a>
                  </div>
                </Reveal>
                <Reveal delay={400}>
                  <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
                    {[
                      { v: "+250k", l: "linhas de código escritas" },
                      { v: "+800k", l: "data points analisados" },
                      { v: `${projects.length}+`, l: "projetos desenvolvidos" },
                      { v: "6+", l: "anos de experiência" },
                    ].map((s) => (
                      <div key={s.l}>
                        <dt className="font-display text-3xl tracking-tight lg:text-4xl">{s.v}</dt>
                        <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>

              <Reveal delay={200} className="relative mx-auto w-full max-w-[520px]">
                <div className="relative overflow-hidden rounded-2xl aspect-[496/563]">
                  <img src={heroZeCartoon.url} alt="Zé dos Dados" width={1024} height={1024} className="h-full w-full object-contain" />
                  <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-accent ring-4 ring-paper/70" />
                </div>
                <div className="liquid-glass absolute left-4 top-4 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-ink">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <div className="leading-tight">
                    <div className="text-xs font-semibold">Lisboa, Portugal</div>
                    <div className="text-[10px] text-ink/60">GMT +1</div>
                  </div>
                </div>
                <div className="liquid-glass absolute -bottom-6 right-4 w-52 rounded-3xl p-4 sm:-right-6">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <p className="mt-3 text-sm font-semibold leading-tight">Transformar dados em decisões<Dot /></p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Esse é o meu foco.</p>
                </div>
                <p className="absolute -right-2 -top-8 hidden rotate-[8deg] font-script text-2xl leading-none text-ink/70 2xl:block">
                  Dados<br />Código<br />Soluções
                </p>
              </Reveal>
            </div>
          </section>
        </Editable>

        {/* Tech strip */}
        <Editable id="Marquee" label="Marquee">
          <section className="border-y border-border bg-paper/50">
            <div className="mx-auto flex max-w-[1320px] items-center gap-8 px-5 py-6 lg:px-10">
              <p className="hidden shrink-0 border-l-2 border-ink pl-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:block">
                Tecnologias<br />que utilizo
              </p>
              <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
                <div className="flex w-max marquee-slow">
                  {[0, 1].map((k) => (
                    <div key={k} className="flex items-center gap-12 pr-12" aria-hidden={k === 1}>
                      {TECH.map((t) => (
                        <span key={t.name} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                          {t.icon ? (
                            <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${t.icon}`} alt="" className="h-5 w-5" loading="lazy" />
                          ) : (
                            <BarChart3 className="h-5 w-5 text-accent" />
                          )}
                          {t.name}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Editable>

        {/* About */}
        <Editable id="About" label="About">
          <section id="sobre" className="bg-ink text-cream">
            <div className="mx-auto grid max-w-[1320px] lg:grid-cols-[1.1fr_1.5fr_0.55fr]">
              <div className="px-5 py-16 lg:px-10 lg:py-24">
                <Reveal><Label n="01" dark>Sobre mim</Label></Reveal>
                <Reveal delay={100}>
                  <h2 className="mt-6 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl">
                    Construir soluções é o que me move<Dot />
                  </h2>
                </Reveal>
                <Reveal delay={200}>
                  <TypewriterText
                    className="mt-8 space-y-4 text-sm leading-relaxed text-cream/70"
                    paragraphs={[
                      "Sou Analista de Dados e Desenvolvedor de Software, apaixonado por transformar dados em decisões, ideias em produtos e processos em soluções inteligentes.",
                      "Atualmente atuo na Servinform Portugal. Minha experiência combina Python, SQL, Power BI, React, TypeScript, JavaScript e Microsoft Azure, além de uma constante dedicação ao estudo de Ciência de Dados e Inteligência Artificial.",
                    ]}
                  />
                </Reveal>
                <p className="mt-8 font-script text-3xl text-cream/80">Zé Soares</p>
              </div>
              <div className="relative min-h-[420px] overflow-hidden bg-cream/5">
                <img src={aboutPortrait.url} alt="Retrato de Zé dos Dados" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
              </div>
              <div className="flex flex-col justify-center gap-2 px-5 py-16 lg:px-10">
                {[
                  { icon: BarChart3, t: "Data Analytics", d: "Dashboards, KPIs, insights e visualização de dados." },
                  { icon: Code2, t: "Desenvolvimento", d: "Web apps, sistemas e interfaces modernas." },
                  { icon: Settings, t: "Automação", d: "Processos, integrações, Python e APIs." },
                ].map((a, i) => (
                  <Reveal key={a.t} delay={i * 100}>
                    <div className="flex gap-4 border-b border-cream/10 py-6">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-cream/5 text-accent">
                        <a.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold">{a.t}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-cream/55">{a.d}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
                <a href="#skills" className={`${btnOutlineDark} mt-8 self-start`}>Mais sobre mim <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </section>
        </Editable>

        {/* Projects */}
        <Editable id="Projects" label="Projects">
          <section id="projetos" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <Reveal><Label n="02">Projetos em destaque</Label></Reveal>
                <Reveal delay={100}>
                  <h2 className="mt-6 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                    Projetos que<br />geram resultado<Dot />
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={200} className="flex flex-col gap-5 lg:items-end">
                <p className="max-w-xs text-sm text-muted-foreground lg:text-right">Soluções reais para pessoas e negócios.</p>
                <Link to="/projetos" className={`${btnOutline} self-start lg:self-end`}>Ver todos os projetos <ArrowRight className="h-4 w-4" /></Link>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <Reveal key={p.title} delay={(i % 3) * 100}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group block overflow-hidden rounded-xl border border-border bg-paper transition-all duration-500 hover:-translate-y-1 hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink text-cream transition-transform duration-500 group-hover:rotate-45">
                        <ArrowRight className="h-4 w-4 -rotate-45" />
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="flex items-center gap-1.5 text-lg font-bold transition-transform duration-500 group-hover:translate-x-1">
                          {p.title} <ArrowUpRight className="h-4 w-4 opacity-60" />
                        </h3>
                        <span className="text-xs text-muted-foreground">{p.year}</span>
                      </div>
                      <span className="mt-3 inline-flex rounded bg-accent/10 px-2 py-1 text-[11px] font-medium text-ink/80">{p.tag}</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        </Editable>

        {/* Process */}
        <section className="mx-auto max-w-[1320px] px-5 pb-20 lg:px-10 lg:pb-28">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Reveal><Label n="03">Como eu trabalho</Label></Reveal>
              <Reveal delay={100}>
                <h2 className="mt-6 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                  Do problema<br />ao resultado<Dot />
                </h2>
              </Reveal>
            </div>
            <Reveal delay={200} className="flex flex-col gap-5 lg:items-end">
              <p className="max-w-xs text-sm text-muted-foreground lg:text-right">Um processo simples e eficaz para transformar ideias em soluções.</p>
              <a href="#contato" className={`${btnOutline} self-start lg:self-end`}>Vamos conversar <ArrowRight className="h-4 w-4" /></a>
            </Reveal>
          </div>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <li className="relative">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-ink/80">
                      <s.icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-border lg:block" />}
                  </div>
                  <p className="mt-5 text-xs font-semibold text-accent">0{i + 1}</p>
                  <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 max-w-[16rem] text-sm text-muted-foreground">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section id="skills" className="border-y border-border bg-paper/50">
          <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-24">
            <Reveal><Label n="04">Competências</Label></Reveal>
            <Reveal delay={100}>
              <h2 className="mt-6 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl">
                Ferramentas do ofício<Dot />
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {SKILLS.map((g, i) => (
                <div key={g.title} className="bg-cream p-8">
                  <p className="text-xs font-semibold text-accent">0{i + 1}</p>
                  <h3 className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em]">{g.title}</h3>
                  <ul className="mt-6 space-y-2.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                        <span className="h-px w-4 bg-ink/30" />{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Editable id="Testimonials" label="Testimonials">
          <Testimonials />
        </Editable>

        {/* CTA */}
        <Editable id="Contact" label="Contact">
          <section id="contato" className="mx-auto max-w-[1320px] px-5 pb-20 lg:px-10">
            <Reveal>
              <div className="relative grid gap-8 overflow-hidden rounded-2xl bg-accent px-6 py-12 sm:px-12 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center lg:py-16">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">Vamos criar algo juntos?</p>
                  <h2 className="mt-4 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl">
                    Tem um projeto<br />em mente?
                  </h2>
                </div>
                <div>
                  <p className="max-w-sm text-sm text-ink/75">Vamos conversar sobre sua ideia e ver como transformar o conceito em algo real.</p>
                  <a href={`mailto:${EMAIL}`} className={`${btnPrimary} mt-6`}>Falar comigo <ArrowRight className="h-4 w-4" /></a>
                </div>
                <p className="hidden rotate-[-8deg] font-script text-3xl leading-none text-ink/70 lg:block">
                  Ideias<br />Processos<br />Resultados
                </p>
              </div>
            </Reveal>
          </section>
        </Editable>
      </main>

      {/* Footer */}
      <Editable id="Footer" label="Footer">
        <footer className="bg-ink text-cream">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 lg:grid-cols-3 lg:px-10">
            <div>
              <Logo dark />
              <p className="mt-5 text-xs text-cream/60">Data Analyst · Developer · Automation</p>
              <p className="mt-1 text-xs text-cream/60">Transformando dados em decisões.</p>
            </div>
            <div className="flex flex-col gap-6 lg:items-center">
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/70" aria-label="Rodapé">
                {NAV.filter((n) => n.label !== "Skills").map((n) =>
                  n.label === "Projetos" ? (
                    <Link key={n.label} to="/projetos" className="hover:text-accent transition-colors">{n.label}</Link>
                  ) : (
                    <a key={n.label} href={n.href} className="hover:text-accent transition-colors">{n.label}</a>
                  ),
                )}
              </nav>
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: LINKEDIN, label: "LinkedIn" },
                  { icon: Github, href: GITHUB, label: "GitHub" },
                  { icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition-colors hover:border-accent hover:text-accent">
                    <s.icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm text-cream/70 lg:items-end">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Lisboa, Portugal</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Disponível para novos projetos</span>
            </div>
          </div>
          <div className="border-t border-cream/10">
            <div className="mx-auto max-w-[1320px] px-5 py-5 text-xs text-cream/50 lg:px-10">
              © 2026 Zé dos Dados. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </Editable>
    </div>
  );
}

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const upd = () => setPerView(mq.matches ? 3 : 1);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);
  const max = TESTIMONIALS.length - perView;
  const safe = Math.min(idx, max);
  const shown = TESTIMONIALS.slice(safe, safe + perView);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="depoimentos" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Reveal><Label n="05">O que dizem sobre mim</Label></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              Feedbacks<br />reais<Dot />
            </h2>
          </Reveal>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tabular-nums text-muted-foreground">
            {pad(safe + 1)} / {pad(TESTIMONIALS.length)}
          </span>
          <button onClick={() => setIdx(Math.max(0, safe - 1))} disabled={safe === 0} aria-label="Anterior"
            className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-ink disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setIdx(Math.min(max, safe + 1))} disabled={safe >= max} aria-label="Próximo"
            className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-ink disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {shown.map((t) => (
          <figure key={t.name} className="flex flex-col justify-between rounded-xl border border-border bg-paper p-7 animate-fade-in">
            <blockquote>
              <span className="font-display text-3xl leading-none text-accent">“</span>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{t.text}</p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-ink/70">
                {t.name.replace(/^(Dr\.|Dra\.|Prof\.ª)\s/, "").split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{t.name}</div>
                <div className="truncate text-xs text-muted-foreground">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

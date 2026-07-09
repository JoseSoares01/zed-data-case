import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Camera, Globe, Plus, Quote, User } from "lucide-react";
import { useState } from "react";
import heroZeCartoon from "@/assets/hero-ze-new.png.asset.json";
import aboutPortrait from "@/assets/about-portrait.png.asset.json";
import logoZeDosDados from "@/assets/logo-ze-dos-dados.png.asset.json";
import { MusicPlayer } from "@/components/MusicPlayer";
import { IntroLoader } from "@/components/IntroLoader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Editable } from "@/editor/Editable";

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
  { title: "Profª. Jaqueline Soares", tag: "Professora · Letras", url: "https://jaquelinesoares-letras.lovable.app", img: proj4, year: "2025" },
  { title: "José Soares — Perfil", tag: "Portfólio Pessoal", url: "https://zedosdados-xp.vercel.app/", img: proj5, year: "2026" },
  { title: "Pause Flow", tag: "App · Produtividade", url: "https://pause-floww.lovable.app/", img: proj1, year: "2024" },
  { title: "MMBus", tag: "Mobilidade · Transporte", url: "https://mmbus.lovable.app", img: proj2, year: "2025" },
];


function Index() {
  const [introDone, setIntroDone] = useState(false);
  return (
    <div className="min-h-screen bg-cream text-ink overflow-x-hidden w-full">
      <SmoothScroll />
      {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}
      <MusicPlayer autoStart={introDone} />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-6 overflow-x-hidden">

        {/* Nav */}
        <Editable id="Navbar" label="Navbar">
          <header className="flex items-center justify-between border-b border-ink/15 pb-6">
          <a href="#" className="flex items-center">
            <img src={logoZeDosDados.url} alt="Zé dos Dados" className="h-14 md:h-20 lg:h-24 w-auto object-contain" />
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
        </Editable>

        {/* Hero */}
        <Editable id="Hero" label="Hero"><section id="s0" className="grid lg:grid-cols-2 gap-6 pt-10 lg:pt-14">
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
          <div className="relative self-start">
            <div
              className="relative aspect-[496/563] rounded-[2.5rem]"
              style={{ overflow: "visible" }}
            >
              <img
                src={heroZeCartoon.url}
                alt="Zé dos Dados"
                width={1024}
                height={1024}
                className="absolute inset-0 w-full h-full object-contain rounded-[2.5rem]"
              />

              {/* Floating globe – overlay on drawn icon (image center 90.71%, 7.91%; container-corrected 90.71%, 9.23%) */}
              <a
                href="#contato"
                className="absolute rounded-full bg-ink flex items-center justify-center z-20 hover:scale-105 transition-transform w-[44px] h-[44px] md:w-[88px] md:h-[88px] [left:calc(90.71%-22px)] [top:calc(9.23%-22px)] md:[left:calc(90.71%-44px)] md:[top:calc(9.23%-44px)]"
                style={{
                  border: "3px solid #fff",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                }}
              >
                <Globe className="w-3.5 h-3.5 md:w-7 md:h-7 text-cream" />
              </a>

              {/* Camera icon – overlay (image 4.96%, 68.39%; container-corrected 5.00%, 67.80%) */}
              <a
                href="#portfolio"
                className="absolute rounded-full bg-[#f5a623] flex items-center justify-center text-ink z-20 hover:scale-105 transition-transform w-[36px] h-[36px] md:w-[76px] md:h-[76px] [left:calc(5.00%-18px)] [top:calc(67.80%-18px)] md:[left:calc(5.00%-38px)] md:[top:calc(67.80%-38px)]"
                style={{
                  border: "3px solid #fff",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                }}
              >
                <Camera className="w-5 h-5 md:w-6 md:h-6" />
              </a>

              {/* Person icon – overlay (image 5.17%, 79.56%; container-corrected 5.17%, 78.63%) */}
              <a
                href="#sobre"
                className="absolute rounded-full bg-[#f5a623] flex items-center justify-center text-ink z-20 hover:scale-105 transition-transform w-[36px] h-[36px] md:w-[76px] md:h-[76px] [left:calc(5.17%-18px)] [top:calc(78.63%-18px)] md:[left:calc(5.17%-38px)] md:[top:calc(78.63%-38px)]"
                style={{
                  border: "3px solid #fff",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                }}
              >
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </a>

              {/* Arrow icon – overlay (image 5.02%, 92.22%; container-corrected 5.02%, 90.88%) */}
              <a
                href="#projetos"
                className="absolute rounded-full bg-ink flex items-center justify-center text-cream z-20 hover:scale-105 transition-transform w-[36px] h-[36px] md:w-[76px] md:h-[76px] [left:calc(5.02%-18px)] [top:calc(90.88%-18px)] md:[left:calc(5.02%-38px)] md:[top:calc(90.88%-38px)]"
                style={{
                  border: "3px solid #fff",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                }}
              >
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
              </a>







            </div>
          </div>
        </section></Editable>

        {/* Marquee */}
        <Editable id="Marquee" label="Marquee"><section id="s1" className="mt-24 -mx-4 sm:-mx-6 lg:-mx-10 bg-ink text-cream py-8 overflow-hidden">
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
        </section></Editable>


        {/* About */}
        <Editable id="About" label="About"><section className="relative bg-ink text-cream -mx-4 sm:-mx-6 lg:-mx-10">
          {/* Horizontal stripes — desktop only, bleed full width */}
          <div className="hidden lg:block absolute left-0 right-0 top-1/3 h-px bg-cream/15 pointer-events-none" />
          <div className="hidden lg:block absolute left-0 right-0 top-2/3 h-px bg-cream/15 pointer-events-none" />

          <div className="px-4 sm:px-6 lg:px-10 pb-24 pt-8">


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
          </div>
        </section></Editable>

        {/* Portfolio */}
        <Editable id="Portfolio" label="Portfolio"><section id="s2" className="pt-20 relative overflow-hidden">
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
        </section></Editable>

        {/* Projects list */}
        <Editable id="Projects" label="Projects"><section id="s3" className="mt-32 overflow-hidden">
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
        </section></Editable>

        {/* Contact CTA */}
        <Editable id="Contact" label="Contact"><section id="s4" className="mt-32 mb-16">
          <div className="rounded-[2.5rem] bg-accent p-10 lg:p-16 relative overflow-hidden">
            <p className="font-script text-3xl text-ink/70">vamos criar algo juntos?</p>
            <h2 className="font-display text-6xl lg:text-8xl leading-[0.9] mt-4 max-w-3xl">
              tem um projeto<br />em mente?
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="mailto:janyelrodrigues@hotmail.com" className="inline-flex items-center gap-3 bg-ink text-cream rounded-full px-8 py-4 font-medium hover:scale-[1.02] transition-transform">
                ola@zedosdados.pt
                <ArrowUpRight className="w-5 h-5" />
              </a>
              <span className="text-ink/70">— resposta em 24h</span>
            </div>
          </div>
        </section></Editable>

        {/* Testimonials */}
        <Editable id="Testimonials" label="Testimonials"><section className="mt-32 mb-16 overflow-hidden">
          <h2 className="font-display text-5xl lg:text-7xl text-center mb-16 leading-tight">
            o que dizem<br />sobre mim<span className="text-accent">.</span>
          </h2>

          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scroll-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-scroll-left {
              animation: scroll-left 40s linear infinite;
            }
            .animate-scroll-right {
              animation: scroll-right 40s linear infinite;
            }
            .animate-scroll-left:hover,
            .animate-scroll-right:hover {
              animation-play-state: paused;
            }
          `}</style>

          {[
            {
              dir: "left",
              items: [
                { name: "Dr. Maurício Soares", role: "Candidato a Deputado", text: "A transformação digital da minha campanha foi impressionante. Zé conseguiu traduzir dados complexos em uma narrativa visual que realmente conectou com os eleitores." },
                { name: "Dra. Joaquina Maria", role: "Deputada Estadual", text: "Profissionalismo e criatividade em cada detalhe. O site que ele desenvolveu elevou minha presença online para um nível completamente novo." },
                { name: "Prof.ª Jaqueline Soares", role: "Professora de Letras", text: "Zé tem um dom para transformar conceitos abstratos em interfaces claras e intuitivas. Meu portfólio acadêmico nunca pareceu tão profissional." },
                { name: "Dr. Joaquim Mendes", role: "Vereador", text: "A análise de dados que ele realizou mudou completamente nossa estratégia de campanha. Resultados concretos e visíveis em poucos meses." },
                { name: "Carolina Ribeiro", role: "Diretora de Marketing, TechLisboa", text: "Trabalhar com Zé é garantia de qualidade. Ele entrega não apenas design bonito, mas soluções baseadas em dados que realmente funcionam." },
                { name: "André Ferreira", role: "CEO, Startup Analytics PT", text: "O dashboard que ele construiu para nossa empresa reduziu nosso tempo de análise em 60%. Simplesmente revolucionário." },
              ],
            },
            {
              dir: "right",
              items: [
                { name: "Mariana Costa", role: "Fundadora, EducaDigital", text: "A plataforma que Zé desenvolveu para nós é intuitiva, rápida e linda. Nossos professores adoram usar todos os dias." },
                { name: "Ricardo Almeida", role: "Consultor Político", text: "Raramente encontro alguém que combine tão bem habilidades técnicas com sensibilidade estética. Um profissional completo." },
                { name: "Sofia Martins", role: "Gerente de Produto, DataViz Co", text: "Cada projeto com Zé é uma aula de como dados e design devem coexistir. Ele eleva o padrão de tudo que toca." },
                { name: "Pedro Henrique", role: "Candidato a Prefeito", text: "Minha campanha ganhou vida digital graças ao trabalho do Zé. Engajamento triplicou em duas semanas." },
                { name: "Luísa Fernandes", role: "Diretora Criativa, Agência Porto", text: "Contratamos Zé como freelancer e acabamos querendo tê-lo em todos os projetos. É um talento raro no mercado português." },
                { name: "Tiago Sousa", role: "Fundador, PoliTech Portugal", text: "A visão analítica combinada com o design impecável faz do Zé um parceiro estratégico indispensável para nossos clientes políticos." },
              ],
            },
          ].map((row) => (
            <div key={row.dir} className="flex mb-6">
              <div className={`flex gap-6 ${row.dir === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}>
                {[...row.items, ...row.items].map((item, i) => (
                  <div
                    key={i}
                    className="w-[400px] shrink-0 rounded-3xl bg-white border border-ink/10 p-8 flex flex-col justify-between"
                  >
                    <div>
                      <Quote className="w-8 h-8 text-accent mb-4 fill-accent/20" />
                      <p className="text-ink/80 leading-relaxed text-sm">{item.text}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <div className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center text-xs font-bold text-ink/70">
                        {item.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-ink">{item.name}</div>
                        <div className="text-xs text-ink/50">{item.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section></Editable>

        {/* Footer */}
        <Editable id="Footer" label="Footer"><footer className="border-t border-ink/15 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
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
        </footer></Editable>

      </div>
    </div>
  );
}

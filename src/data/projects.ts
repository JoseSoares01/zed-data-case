import proj1 from "@/assets/proj1.jpg";
import servinformLogo from "@/assets/servinform-logo.png.asset.json";
import mmbusLogo from "@/assets/mmbus-logo.png.asset.json";
import pauseflowLogo from "@/assets/pauseflow-logo.png.asset.json";
import joseSoaresLogo from "@/assets/jose-soares-logo.png.asset.json";
import profJaquelineLogo from "@/assets/prof-jaqueline-logo.png.asset.json";
import mauricioLogo from "@/assets/mauricio-logo.png.asset.json";
import pataAmigaLogo from "@/assets/pata-amiga-logo.png.asset.json";
import joaquimMendesLogo from "@/assets/joaquim-mendes-logo.png.asset.json";
import greenestLogo from "@/assets/greenest.png.asset.json";
import dotaworkLogo from "@/assets/dotawork.png.asset.json";
import dev2dataLogo from "@/assets/dev2data.png.asset.json";

export type Project = {
  title: string;
  tag: string;
  url: string;
  img: string;
  year: string;
};

export const projects: Project[] = [
  { title: "Pata Amiga", tag: "App · Resgate de Animais", url: "https://pata-amiga.lovable.app/auth", img: pataAmigaLogo.url, year: "2024" },
  { title: "Mauricío Soares", tag: "Político · Marca Pessoal", url: "https://mauricio-soares.vercel.app/", img: mauricioLogo.url, year: "2026" },
  { title: "Dra. Joaquina Maria", tag: "Campanha Política", url: "https://joaquina-maria-deputada.lovable.app", img: proj1, year: "2026" },
  { title: "Dr. Joaquim Mendes", tag: "Político · Site Oficial", url: "https://joaquim-magic-site.lovable.app", img: joaquimMendesLogo.url, year: "2026" },
  { title: "Profª. Jaqueline Soares", tag: "Professora · Letras", url: "https://jaquelinesoares-letras.lovable.app", img: profJaquelineLogo.url, year: "2025" },
  { title: "José Soares — Perfil", tag: "Portfólio Pessoal", url: "https://zedosdados-xp.vercel.app/", img: joseSoaresLogo.url, year: "2026" },
  { title: "Pause Flow", tag: "App · Produtividade", url: "https://pause-floww.lovable.app/", img: pauseflowLogo.url, year: "2024" },
  { title: "MMBus", tag: "Mobilidade · Transporte", url: "https://mmbus.lovable.app", img: mmbusLogo.url, year: "2025" },
  { title: "Ferramentas Servinform", tag: "Utilitários · Ferramentas", url: "https://ferramentasservinform.pt/index.html", img: servinformLogo.url, year: "2023" },
  { title: "DotaWork", tag: "Plataforma · Dota Pro Connect", url: "https://dota-pro-connect.lovable.app", img: dotaworkLogo.url, year: "2023" },
  { title: "Dev2Data", tag: "Educação · Dados", url: "https://dev2data.lovable.app", img: dev2dataLogo.url, year: "2024" },
  { title: "GreeNest One", tag: "App · Gestão", url: "https://greenest-one.lovable.app/auth", img: greenestLogo.url, year: "2022" },
];

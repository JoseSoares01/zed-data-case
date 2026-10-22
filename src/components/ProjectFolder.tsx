import GlassFolder, { type ArtPreset } from "@/components/GlassFolder";
import type { Project } from "@/data/projects";

const ARTS: ArtPreset[] = ["ember", "dusk", "aurora", "verdant", "glacier"];

export function ProjectFolder({ project, index = 0, width = 320 }: { project: Project; index?: number; width?: number }) {
  let host = project.url;
  try { host = new URL(project.url).hostname.replace(/^www\./, ""); } catch { /* keep */ }
  return (
    <div className="flex justify-center">
      <GlassFolder
        label={project.title}
        meta={`${project.tag} · ${project.year}`}
        art={ARTS[index % ARTS.length]}
        seed={index + 1}
        files={[
          { name: "Abrir projeto", meta: host, image: project.img, href: project.url },
          { name: project.tag, meta: project.year, image: project.img, href: project.url },
        ]}
        action="none"
        width={width}
        appearDelay={(index % 3) * 100}
        onFileSelect={(f) => f.href && window.open(f.href, "_blank", "noopener,noreferrer")}
      />
    </div>
  );
}

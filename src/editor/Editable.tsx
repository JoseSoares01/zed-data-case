import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useEditor } from "./EditorContext";
import type { ComponentProperties } from "./types";

function propsToStyle(p: ComponentProperties): CSSProperties {
  const s: CSSProperties = {};
  if (p.x !== undefined || p.y !== undefined) {
    s.transform = `translate(${p.x ?? 0}px, ${p.y ?? 0}px)${p.rotation ? ` rotate(${p.rotation}deg)` : ""}`;
  } else if (p.rotation !== undefined) {
    s.transform = `rotate(${p.rotation}deg)`;
  }
  if (p.width !== undefined) s.width = p.width;
  if (p.height !== undefined) s.height = p.height;
  if (p.padding !== undefined) s.padding = p.padding;
  if (p.margin !== undefined) s.margin = p.margin;
  if (p.borderRadius !== undefined) s.borderRadius = p.borderRadius;
  if (p.opacity !== undefined) s.opacity = p.opacity;
  if (p.background) s.background = p.background;
  if (p.zIndex !== undefined) s.zIndex = p.zIndex;
  return s;
}

export function Editable({
  id,
  label,
  children,
  as: Tag = "div",
  className,
}: {
  id: string;
  label?: string;
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const editor = useEditor();
  const ref = useRef<HTMLElement | null>(null);
  const props = editor.getEffectiveProps(id);
  const style = propsToStyle(props);
  const isSelected = editor.selectedId === id;

  useEffect(() => {
    editor.registerElement(id, ref.current);
    return () => editor.registerElement(id, null);
  }, [id, editor]);

  const editorClasses = editor.editorMode
    ? `outline-dashed outline-1 outline-transparent hover:outline-[#0D99FF]/50 transition-[outline-color] cursor-pointer ${
        isSelected ? "!outline-solid !outline-2 !outline-[#0D99FF]" : ""
      }`
    : "";

  return (
    // @ts-expect-error dynamic tag
    <Tag
      ref={ref}
      data-editable-id={id}
      data-editable-label={label ?? id}
      className={[className, editorClasses].filter(Boolean).join(" ")}
      style={style}
      onClick={
        editor.editorMode
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              editor.setSelectedId(id);
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

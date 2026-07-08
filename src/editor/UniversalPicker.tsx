import { useEffect, useRef, useState } from "react";
import { useEditor } from "./EditorContext";
import { autoKeyFor, isEditorUi } from "./universalPath";

// Global picker: in editor mode, hovering highlights any DOM element and
// clicking selects it (registering it under an auto-generated key so drag/
// resize/inspector work identically to <Editable> wrappers).
export function UniversalPicker() {
  const editor = useEditor();
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string>("");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editor.editorMode) {
      setHoverRect(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        if (!el || isEditorUi(el) || el === document.body || el === document.documentElement) {
          setHoverRect(null);
          return;
        }
        setHoverRect(el.getBoundingClientRect());
        const tag = el.tagName.toLowerCase();
        const explicit = el.getAttribute("data-editable-label");
        const raw = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 24);
        setHoverLabel(explicit ?? (raw ? `${tag} · ${raw}` : tag));
      });
    };
    const onLeave = () => setHoverRect(null);

    const onPointerDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || isEditorUi(el)) return;
      // Prevent the app's own click handlers / link navigation
      e.preventDefault();
      e.stopPropagation();
      // Prefer explicit Editable id when present
      const editableAncestor = el.closest("[data-editable-id]") as HTMLElement | null;
      const key = editableAncestor && editableAncestor.contains(el) && editableAncestor === el
        ? editableAncestor.getAttribute("data-editable-id")!
        : autoKeyFor(el);
      editor.registerElement(key, el);
      editor.setSelectedId(key);
    };
    const onClickCapture = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || isEditorUi(el)) return;
      // Cancel default navigation (anchor clicks etc.)
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClickCapture, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [editor.editorMode, editor]);

  if (!editor.editorMode || !hoverRect) return null;
  return (
    <div
      data-editor-ui="1"
      className="fixed pointer-events-none z-[9996] border border-[#0D99FF]/70 bg-[#0D99FF]/5 rounded-sm"
      style={{
        top: hoverRect.top,
        left: hoverRect.left,
        width: hoverRect.width,
        height: hoverRect.height,
      }}
    >
      <span className="absolute -top-5 left-0 bg-[#0D99FF] text-white text-[10px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
        {hoverLabel}
      </span>
    </div>
  );
}

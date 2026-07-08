import { useEffect, useState, useRef } from "react";
import { useEditor } from "./EditorContext";
import type { Breakpoint } from "./types";
import { saveLayoutChanges, resetLayoutForPage } from "./editor.functions";
import { UniversalPicker } from "./UniversalPicker";
import { toast } from "sonner";
import {
  Save,
  X,
  RotateCcw,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  LogOut,
  Grid3x3,
  Ruler as RulerIcon,
} from "lucide-react";

const BP_WIDTH: Record<Breakpoint, string> = {
  desktop: "100%",
  tablet: "1024px",
  mobile: "390px",
};

export function EditorRoot() {
  const editor = useEditor();
  const [saving, setSaving] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; startX: number; startY: number; baseW: number; baseH: number } | null>(null);
  const [snapLines, setSnapLines] = useState<{ v: number[]; h: number[] }>({ v: [], h: [] });

  // Force preview width when editor mode + non-desktop bp
  useEffect(() => {
    if (!editor.editorMode) {
      document.body.style.maxWidth = "";
      document.body.style.margin = "";
      document.body.style.overflowX = "";
      return;
    }
    const w = BP_WIDTH[editor.activeBreakpoint];
    if (w === "100%") {
      document.body.style.maxWidth = "";
      document.body.style.margin = "";
    } else {
      document.body.style.maxWidth = w;
      document.body.style.margin = "0 auto";
    }
  }, [editor.editorMode, editor.activeBreakpoint]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor.editorMode) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
      } else if (meta && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        editor.redo();
      } else if (e.key === "Escape") {
        editor.setSelectedId(null);
      } else if (editor.selectedId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const cur = editor.getEffectiveProps(editor.selectedId);
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        editor.updateProperty(editor.selectedId, { x: (cur.x ?? 0) + dx, y: (cur.y ?? 0) + dy });
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (editor.selectedId) {
          e.preventDefault();
          editor.updateProperty(editor.selectedId, { x: 0, y: 0 });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editor.editorMode, editor.selectedId, editor]);

  // Double-click to edit text on the selected element
  useEffect(() => {
    if (!editor.editorMode) return;
    const onDbl = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || el.closest("[data-editor-ui]")) return;
      if (!editor.selectedId) return;
      const selectedEl = editor.registry.get(editor.selectedId);
      if (!selectedEl || !selectedEl.contains(el)) return;
      e.preventDefault();
      e.stopPropagation();
      const target = selectedEl;
      target.setAttribute("contenteditable", "true");
      target.focus();
      const range = document.createRange();
      range.selectNodeContents(target);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      const onBlur = () => {
        target.removeAttribute("contenteditable");
        editor.updateProperty(editor.selectedId!, { text: target.textContent ?? "" });
        target.removeEventListener("blur", onBlur);
      };
      target.addEventListener("blur", onBlur);
    };
    document.addEventListener("dblclick", onDbl, true);
    return () => document.removeEventListener("dblclick", onDbl, true);
  }, [editor.editorMode, editor.selectedId, editor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const changes: Array<{ page: string; breakpoint: Breakpoint; component: string; properties: Record<string, unknown> }> = [];
      (["desktop", "tablet", "mobile"] as Breakpoint[]).forEach((bp) => {
        const cur = editor.currentLayouts[bp];
        for (const [component, properties] of Object.entries(cur)) {
          changes.push({ page: editor.page, breakpoint: bp, component, properties });
        }
      });
      await saveLayoutChanges({ data: { page: editor.page, changes } });
      editor.markSaved(editor.currentLayouts);
      toast.success("Layout salvo");
    } catch (e) {
      toast.error("Erro ao salvar: " + (e instanceof Error ? e.message : "desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Restaurar layout original? Isso apaga todas as personalizações desta página.")) return;
    try {
      await resetLayoutForPage({ data: { page: editor.page } });
      editor.resetAll();
      toast.success("Layout restaurado");
    } catch (e) {
      toast.error("Erro ao restaurar: " + (e instanceof Error ? e.message : "desconhecido"));
    }
  };

  // Drag handling
  const onPointerDownDrag = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const cur = editor.getEffectiveProps(id);
    setDragging({ id, startX: e.clientX, startY: e.clientY, baseX: cur.x ?? 0, baseY: cur.y ?? 0 });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerDownResize = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const el = editor.registry.get(id);
    const cur = editor.getEffectiveProps(id);
    const rect = el?.getBoundingClientRect();
    setResizing({
      id,
      startX: e.clientX,
      startY: e.clientY,
      baseW: cur.width ?? rect?.width ?? 0,
      baseH: cur.height ?? rect?.height ?? 0,
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!dragging && !resizing) {
      setSnapLines({ v: [], h: [] });
      return;
    }
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        let dx = e.clientX - dragging.startX;
        let dy = e.clientY - dragging.startY;
        // Snap to 8px grid when shift NOT held
        if (!e.shiftKey) {
          const snap = 8;
          dx = Math.round(dx / snap) * snap;
          dy = Math.round(dy / snap) * snap;
        }
        editor.applyPatch(dragging.id, { x: dragging.baseX + dx, y: dragging.baseY + dy });

        // Smart guides — snap against edges of other elements
        const draggedEl = editor.registry.get(dragging.id);
        if (draggedEl) {
          const r = draggedEl.getBoundingClientRect();
          const vLines: number[] = [];
          const hLines: number[] = [];
          editor.registry.forEach((el, otherId) => {
            if (otherId === dragging.id) return;
            const or = el.getBoundingClientRect();
            const threshold = 6;
            [or.left, or.right, or.left + or.width / 2].forEach((x) => {
              if (Math.abs(r.left - x) < threshold || Math.abs(r.right - x) < threshold) vLines.push(x);
            });
            [or.top, or.bottom, or.top + or.height / 2].forEach((y) => {
              if (Math.abs(r.top - y) < threshold || Math.abs(r.bottom - y) < threshold) hLines.push(y);
            });
          });
          setSnapLines({ v: vLines, h: hLines });
        }
      } else if (resizing) {
        let dw = e.clientX - resizing.startX;
        let dh = e.clientY - resizing.startY;
        if (!e.shiftKey) {
          const snap = 8;
          dw = Math.round(dw / snap) * snap;
          dh = Math.round(dh / snap) * snap;
        }
        editor.applyPatch(resizing.id, {
          width: Math.max(40, resizing.baseW + dw),
          height: Math.max(40, resizing.baseH + dh),
        });
      }
    };
    const onUp = () => {
      if (dragging) {
        // commit to history
        const finalProps = editor.getEffectiveProps(dragging.id);
        editor.updateProperty(dragging.id, { x: finalProps.x, y: finalProps.y });
      }
      if (resizing) {
        const finalProps = editor.getEffectiveProps(resizing.id);
        editor.updateProperty(resizing.id, { width: finalProps.width, height: finalProps.height });
      }
      setDragging(null);
      setResizing(null);
      setSnapLines({ v: [], h: [] });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, resizing, editor]);

  // Selection overlay
  const selectedEl = editor.selectedId ? editor.registry.get(editor.selectedId) : null;
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!selectedEl) {
      setRect(null);
      return;
    }
    const update = () => setRect(selectedEl.getBoundingClientRect());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(selectedEl);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const interval = setInterval(update, 100); // catch transform changes
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      clearInterval(interval);
    };
  }, [selectedEl]);

  const selectedProps = editor.selectedId ? editor.getEffectiveProps(editor.selectedId) : null;
  const selectedLabel = selectedEl?.getAttribute("data-editable-label") ?? editor.selectedId ?? "";

  return (
    <>
      {/* Universal picker (hover + click to select any element) */}
      <UniversalPicker />

      {/* Toolbar */}
      <div data-editor-ui="1" className="fixed top-3 left-1/2 -translate-x-1/2 z-[10001] flex items-center gap-1 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-black/10 shadow-2xl shadow-black/20 px-2 py-1.5">
        <ToolbarButton icon={<Save className="w-4 h-4" />} label={saving ? "Salvando..." : "Salvar"} onClick={handleSave} primary />
        <ToolbarButton icon={<X className="w-4 h-4" />} label="Cancelar" onClick={editor.cancelChanges} />
        <ToolbarButton icon={<RotateCcw className="w-4 h-4" />} label="Restaurar" onClick={handleReset} />
        <div className="w-px h-6 bg-black/10 mx-1" />
        <ToolbarButton icon={<Undo2 className="w-4 h-4" />} label="Undo" onClick={editor.undo} disabled={!editor.canUndo} />
        <ToolbarButton icon={<Redo2 className="w-4 h-4" />} label="Redo" onClick={editor.redo} disabled={!editor.canRedo} />
        <div className="w-px h-6 bg-black/10 mx-1" />
        <BpButton bp="desktop" active={editor.activeBreakpoint} onClick={editor.setActiveBreakpoint} icon={<Monitor className="w-4 h-4" />} />
        <BpButton bp="tablet" active={editor.activeBreakpoint} onClick={editor.setActiveBreakpoint} icon={<Tablet className="w-4 h-4" />} />
        <BpButton bp="mobile" active={editor.activeBreakpoint} onClick={editor.setActiveBreakpoint} icon={<Smartphone className="w-4 h-4" />} />
        <div className="w-px h-6 bg-black/10 mx-1" />
        <ToolbarButton icon={<Grid3x3 className="w-4 h-4" />} label="Grid" onClick={() => setShowGrid((v) => !v)} active={showGrid} />
        <ToolbarButton icon={<RulerIcon className="w-4 h-4" />} label="Réguas" onClick={() => setShowRulers((v) => !v)} active={showRulers} />
        <div className="w-px h-6 bg-black/10 mx-1" />
        <ToolbarButton icon={<LogOut className="w-4 h-4" />} label="Sair" onClick={() => { editor.setEditorMode(false); editor.setSelectedId(null); }} />
      </div>

      {/* Rulers */}
      {showRulers && (
        <>
          <div data-editor-ui="1" className="fixed top-0 left-6 right-0 h-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-b border-black/10 z-[9999] pointer-events-none overflow-hidden">
            <RulerMarks orientation="h" />
          </div>
          <div data-editor-ui="1" className="fixed top-0 left-0 bottom-0 w-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur border-r border-black/10 z-[9999] pointer-events-none overflow-hidden">
            <RulerMarks orientation="v" />
          </div>
        </>
      )}

      {/* Grid overlay */}
      {showGrid && (
        <div
          data-editor-ui="1"
          className="fixed inset-0 z-[9997] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(13,153,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,153,255,0.08) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        />
      )}

      {/* Snap guides */}
      {snapLines.v.map((x, i) => (
        <div key={"v" + i} data-editor-ui="1" className="fixed top-0 bottom-0 w-px bg-[#FF3B6C] z-[10000] pointer-events-none" style={{ left: x }} />
      ))}
      {snapLines.h.map((y, i) => (
        <div key={"h" + i} data-editor-ui="1" className="fixed left-0 right-0 h-px bg-[#FF3B6C] z-[10000] pointer-events-none" style={{ top: y }} />
      ))}

      {/* Selection overlay */}
      {rect && editor.selectedId && (
        <div
          data-editor-ui="1"
          className="fixed z-[10000] pointer-events-none"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        >
          {/* Label */}
          <div className="absolute -top-6 left-0 bg-[#0D99FF] text-white text-xs px-2 py-0.5 rounded font-mono pointer-events-auto">
            {selectedLabel}
          </div>
          {/* Drag handle: entire area (except resize corners) */}
          <div
            className="absolute inset-0 cursor-move pointer-events-auto"
            onPointerDown={(e) => onPointerDownDrag(e, editor.selectedId!)}
          />
          {/* Resize handle (bottom-right) */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#0D99FF] rounded-sm cursor-nwse-resize pointer-events-auto"
            onPointerDown={(e) => onPointerDownResize(e, editor.selectedId!)}
          />
          {/* Edge handles for visual */}
          {["top-left", "top-right", "bottom-left"].map((pos) => {
            const styleMap: Record<string, React.CSSProperties> = {
              "top-left": { top: -6, left: -6 },
              "top-right": { top: -6, right: -6 },
              "bottom-left": { bottom: -6, left: -6 },
            };
            return (
              <div
                key={pos}
                className="absolute w-3 h-3 bg-white border-2 border-[#0D99FF] rounded-sm"
                style={styleMap[pos]}
              />
            );
          })}
        </div>
      )}

      {/* Inspector Panel */}
      {editor.selectedId && selectedProps && (
        <div data-editor-ui="1" className="fixed top-16 right-3 z-[10001] w-72 max-h-[85vh] overflow-y-auto rounded-2xl bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-black/10 shadow-2xl shadow-black/20 p-4 text-sm">
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3 font-mono break-all">{selectedLabel}</div>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="X" value={selectedProps.x ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { x: v })} />
            <NumField label="Y" value={selectedProps.y ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { y: v })} />
            <NumField label="W" value={selectedProps.width ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { width: v })} />
            <NumField label="H" value={selectedProps.height ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { height: v })} />
            <NumField label="Pad" value={selectedProps.padding ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { padding: v })} />
            <NumField label="Radius" value={selectedProps.borderRadius ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { borderRadius: v })} />
            <NumField label="Rot" value={selectedProps.rotation ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { rotation: v })} />
            <NumField label="Z" value={selectedProps.zIndex ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { zIndex: v })} />
            <NumField label="Font" value={selectedProps.fontSize ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { fontSize: v || undefined })} />
            <NumField label="Peso" value={selectedProps.fontWeight ?? 0} onChange={(v) => editor.updateProperty(editor.selectedId!, { fontWeight: v || undefined })} />
          </div>
          <div className="mt-3">
            <label className="text-xs text-neutral-500">Opacidade</label>
            <input
              type="range" min={0} max={1} step={0.05}
              value={selectedProps.opacity ?? 1}
              onChange={(e) => editor.updateProperty(editor.selectedId!, { opacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-neutral-500">Cor texto</label>
              <input
                type="color"
                value={selectedProps.color ?? "#000000"}
                onChange={(e) => editor.updateProperty(editor.selectedId!, { color: e.target.value })}
                className="w-full h-8 mt-1 rounded border border-black/10 bg-white/70"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500">Fundo</label>
              <input
                type="text" placeholder="#f5a623"
                value={selectedProps.background ?? ""}
                onChange={(e) => editor.updateProperty(editor.selectedId!, { background: e.target.value || undefined })}
                className="w-full h-8 mt-1 px-2 rounded border border-black/10 bg-white/70 text-xs"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-neutral-500">Alinhamento</label>
            <div className="flex gap-1 mt-1">
              {(["left", "center", "right", "justify"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => editor.updateProperty(editor.selectedId!, { textAlign: a })}
                  className={`flex-1 px-2 py-1 rounded text-xs border ${selectedProps.textAlign === a ? "bg-[#0D99FF] text-white border-[#0D99FF]" : "border-black/10 hover:bg-black/5"}`}
                >{a}</button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-neutral-500">Texto (duplo-clique no elemento para editar inline)</label>
            <textarea
              rows={3}
              value={selectedProps.text ?? ""}
              onChange={(e) => editor.updateProperty(editor.selectedId!, { text: e.target.value })}
              placeholder="Deixe vazio para manter o texto original"
              className="w-full mt-1 px-2 py-1 rounded border border-black/10 bg-white/70 text-xs resize-none"
            />
          </div>
          <div className="mt-3 text-[10px] text-neutral-500 leading-tight">
            Breakpoint: <b>{editor.activeBreakpoint}</b> · setas movem · shift = 10px · ESC = deselecionar
          </div>
        </div>
      )}
    </>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  primary,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
        primary
          ? "bg-[#0D99FF] text-white hover:bg-[#0d80d9]"
          : active
            ? "bg-[#0D99FF]/15 text-[#0D99FF]"
            : "text-neutral-700 dark:text-neutral-200 hover:bg-black/5"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function BpButton({
  bp,
  active,
  onClick,
  icon,
}: {
  bp: Breakpoint;
  active: Breakpoint;
  onClick: (bp: Breakpoint) => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onClick(bp)}
      title={bp}
      className={`p-1.5 rounded-lg transition ${
        active === bp ? "bg-[#0D99FF] text-white" : "text-neutral-700 hover:bg-black/5"
      }`}
    >
      {icon}
    </button>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] text-neutral-500 uppercase">{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-2 py-1 rounded border border-black/10 bg-white/70 text-xs w-full"
      />
    </label>
  );
}

function RulerMarks({ orientation }: { orientation: "h" | "v" }) {
  const marks: number[] = [];
  for (let i = 0; i < 3000; i += 50) marks.push(i);
  return (
    <div className={orientation === "h" ? "relative h-full" : "relative w-full"}>
      {marks.map((m) => (
        <div
          key={m}
          className="absolute text-[9px] text-neutral-500 font-mono"
          style={
            orientation === "h"
              ? { left: m, top: 2, borderLeft: "1px solid rgba(0,0,0,0.2)", paddingLeft: 2, height: "100%" }
              : { top: m, left: 2, borderTop: "1px solid rgba(0,0,0,0.2)", paddingTop: 2, width: "100%" }
          }
        >
          {m}
        </div>
      ))}
    </div>
  );
}

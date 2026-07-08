import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from "react";
import type { Breakpoint, ComponentProperties, LayoutByBreakpoint, LayoutMap } from "./types";

type EditorState = {
  // Runtime
  editorMode: boolean;
  isAdmin: boolean;
  page: string;
  activeBreakpoint: Breakpoint;
  detectedBreakpoint: Breakpoint;
  // Layouts
  savedLayouts: LayoutByBreakpoint; // last persisted
  currentLayouts: LayoutByBreakpoint; // working copy
  // Selection
  selectedId: string | null;
  // Registry of editable elements
  registry: Map<string, HTMLElement>;
  // Actions
  setEditorMode: (v: boolean) => void;
  setIsAdmin: (v: boolean) => void;
  setActiveBreakpoint: (bp: Breakpoint) => void;
  setSelectedId: (id: string | null) => void;
  registerElement: (id: string, el: HTMLElement | null) => void;
  updateProperty: (id: string, patch: ComponentProperties) => void;
  applyPatch: (id: string, patch: ComponentProperties) => void; // no history
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  cancelChanges: () => void;
  markSaved: (layouts: LayoutByBreakpoint) => void;
  resetAll: () => void;
  getEffectiveProps: (id: string, bp?: Breakpoint) => ComponentProperties;
};

const EditorCtx = createContext<EditorState | null>(null);

export function useEditor() {
  const ctx = useContext(EditorCtx);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
}

const emptyLayouts = (): LayoutByBreakpoint => ({ desktop: {}, tablet: {}, mobile: {} });

function detectBp(): Breakpoint {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function EditorProvider({
  children,
  page,
  initialLayouts,
}: {
  children: ReactNode;
  page: string;
  initialLayouts: LayoutByBreakpoint;
}) {
  const [editorMode, setEditorMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [detectedBreakpoint, setDetectedBreakpoint] = useState<Breakpoint>(() => detectBp());
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>(() => detectBp());
  const [savedLayouts, setSavedLayouts] = useState<LayoutByBreakpoint>(initialLayouts);
  const [currentLayouts, setCurrentLayouts] = useState<LayoutByBreakpoint>(initialLayouts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const registryRef = useRef<Map<string, HTMLElement>>(new Map());

  // History stacks
  const [undoStack, setUndoStack] = useState<LayoutByBreakpoint[]>([]);
  const [redoStack, setRedoStack] = useState<LayoutByBreakpoint[]>([]);

  useEffect(() => {
    setSavedLayouts(initialLayouts);
    setCurrentLayouts(initialLayouts);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedId(null);
  }, [initialLayouts]);

  // Detect breakpoint from viewport (for visitors)
  useEffect(() => {
    const update = () => {
      const bp = detectBp();
      setDetectedBreakpoint(bp);
      if (!editorMode) setActiveBreakpoint(bp);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [editorMode]);

  // On leaving editor mode, sync active bp to detected
  useEffect(() => {
    if (!editorMode) setActiveBreakpoint(detectedBreakpoint);
  }, [editorMode, detectedBreakpoint]);

  const registerElement = useCallback((id: string, el: HTMLElement | null) => {
    if (el) registryRef.current.set(id, el);
    else registryRef.current.delete(id);
  }, []);

  const cloneLayouts = (l: LayoutByBreakpoint): LayoutByBreakpoint => ({
    desktop: { ...l.desktop },
    tablet: { ...l.tablet },
    mobile: { ...l.mobile },
  });

  const applyPatch = useCallback(
    (id: string, patch: ComponentProperties) => {
      setCurrentLayouts((prev) => {
        const next = cloneLayouts(prev);
        const bpMap: LayoutMap = { ...next[activeBreakpoint] };
        bpMap[id] = { ...(bpMap[id] ?? {}), ...patch };
        next[activeBreakpoint] = bpMap;
        return next;
      });
    },
    [activeBreakpoint],
  );

  const updateProperty = useCallback(
    (id: string, patch: ComponentProperties) => {
      setUndoStack((s) => [...s, cloneLayouts(currentLayouts)]);
      setRedoStack([]);
      applyPatch(id, patch);
    },
    [currentLayouts, applyPatch],
  );

  const undo = useCallback(() => {
    setUndoStack((s) => {
      if (s.length === 0) return s;
      const prev = s[s.length - 1];
      setRedoStack((r) => [...r, cloneLayouts(currentLayouts)]);
      setCurrentLayouts(prev);
      return s.slice(0, -1);
    });
  }, [currentLayouts]);

  const redo = useCallback(() => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[r.length - 1];
      setUndoStack((s) => [...s, cloneLayouts(currentLayouts)]);
      setCurrentLayouts(next);
      return r.slice(0, -1);
    });
  }, [currentLayouts]);

  const cancelChanges = useCallback(() => {
    setCurrentLayouts(savedLayouts);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedId(null);
  }, [savedLayouts]);

  const markSaved = useCallback((layouts: LayoutByBreakpoint) => {
    setSavedLayouts(layouts);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const resetAll = useCallback(() => {
    const empty = emptyLayouts();
    setCurrentLayouts(empty);
    setSavedLayouts(empty);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedId(null);
  }, []);

  const getEffectiveProps = useCallback(
    (id: string, bp?: Breakpoint): ComponentProperties => {
      const target = bp ?? activeBreakpoint;
      // Desktop/tablet layout edits can break narrow screens when inherited.
      // Mobile only uses mobile-specific overrides; otherwise it keeps the
      // responsive source layout intact.
      const desktop = currentLayouts.desktop[id] ?? {};
      const tablet = currentLayouts.tablet[id] ?? {};
      const mobile = currentLayouts.mobile[id] ?? {};
      if (target === "desktop") return desktop;
      if (target === "tablet") return { ...desktop, ...tablet };
      return mobile;
    },
    [currentLayouts, activeBreakpoint],
  );

  const value = useMemo<EditorState>(
    () => ({
      editorMode,
      isAdmin,
      page,
      activeBreakpoint,
      detectedBreakpoint,
      savedLayouts,
      currentLayouts,
      selectedId,
      registry: registryRef.current,
      setEditorMode,
      setIsAdmin,
      setActiveBreakpoint,
      setSelectedId,
      registerElement,
      updateProperty,
      applyPatch,
      undo,
      redo,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      cancelChanges,
      markSaved,
      resetAll,
      getEffectiveProps,
    }),
    [
      editorMode,
      isAdmin,
      page,
      activeBreakpoint,
      detectedBreakpoint,
      savedLayouts,
      currentLayouts,
      selectedId,
      undoStack.length,
      redoStack.length,
      registerElement,
      updateProperty,
      applyPatch,
      undo,
      redo,
      cancelChanges,
      markSaved,
      resetAll,
      getEffectiveProps,
    ],
  );

  return <EditorCtx.Provider value={value}>{children}</EditorCtx.Provider>;
}

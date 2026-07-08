import { lazy, Suspense } from "react";
import { useEditor } from "./EditorContext";
import { Pencil } from "lucide-react";

const EditorRoot = lazy(() => import("./EditorRoot").then((m) => ({ default: m.EditorRoot })));

export function FloatingToggle() {
  const editor = useEditor();
  if (!editor.isAdmin) return null;

  return (
    <>
      {!editor.editorMode && (
        <button
          onClick={() => editor.setEditorMode(true)}
          className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-[#0D99FF] text-white shadow-2xl shadow-[#0D99FF]/40 px-4 py-3 text-sm font-medium hover:scale-105 transition"
          title="Ativar modo editor"
        >
          <Pencil className="w-4 h-4" />
          <span>Editor</span>
        </button>
      )}
      {editor.editorMode && (
        <Suspense fallback={null}>
          <EditorRoot />
        </Suspense>
      )}
    </>
  );
}

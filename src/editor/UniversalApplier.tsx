import { useEffect } from "react";
import { useEditor } from "./EditorContext";
import { applyPropsToElement } from "./applyProps";
import { isAutoKey, resolveAutoKey } from "./universalPath";

// Applies stored overrides for auto-picked (non-<Editable>) elements to the
// live DOM. Runs for BOTH visitors and admins so saved layouts persist.
export function UniversalApplier() {
  const editor = useEditor();

  useEffect(() => {
    const applyAll = () => {
      const layouts = editor.currentLayouts;
      const keys = new Set<string>([
        ...Object.keys(layouts.desktop),
        ...Object.keys(layouts.tablet),
        ...Object.keys(layouts.mobile),
      ]);
      for (const key of keys) {
        if (!isAutoKey(key)) continue;
        const el = resolveAutoKey(key);
        if (!el) continue;
        applyPropsToElement(el, editor.getEffectiveProps(key));
        // Keep registry fresh so selection overlay can find it
        editor.registerElement(key, el);
      }
    };
    applyAll();
    let scheduled = false;
    const obs = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        applyAll();
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [editor.currentLayouts, editor.activeBreakpoint, editor]);

  return null;
}

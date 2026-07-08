import { useEffect } from "react";
import { useEditor } from "./EditorContext";
import { applyPropsToElement } from "./applyProps";
import { isAutoKey, resolveAutoKey } from "./universalPath";

// Applies stored overrides for auto-picked (non-<Editable>) elements to the
// live DOM. Runs for BOTH visitors and admins so saved layouts persist.
export function UniversalApplier() {
  const editor = useEditor();

  useEffect(() => {
    let obs: MutationObserver | null = null;
    let scheduled = false;

    const applyAll = () => {
      const layouts = editor.currentLayouts;
      const keys = new Set<string>([
        ...Object.keys(layouts.desktop),
        ...Object.keys(layouts.tablet),
        ...Object.keys(layouts.mobile),
      ]);
      // Temporarily disconnect so our own style writes don't retrigger the
      // observer in a loop.
      obs?.disconnect();
      for (const key of keys) {
        if (!isAutoKey(key)) continue;
        const el = resolveAutoKey(key);
        if (!el) continue;
        applyPropsToElement(el, editor.getEffectiveProps(key));
        // Keep registry fresh so selection overlay can find it
        editor.registerElement(key, el);
      }
      obs?.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        applyAll();
      });
    };

    obs = new MutationObserver(() => schedule());
    // Initial apply also wires the observer.
    applyAll();

    return () => {
      obs?.disconnect();
      obs = null;
    };
  }, [editor.currentLayouts, editor.activeBreakpoint, editor]);

  return null;
}

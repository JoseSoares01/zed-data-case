import { useEffect, useState, type ReactNode } from "react";
import { EditorProvider } from "./EditorContext";
import { EditorAdminBridge } from "./AdminBridge";
import { UniversalApplier } from "./UniversalApplier";
import { getLayoutForPage } from "./editor.functions";
import type { LayoutByBreakpoint } from "./types";

const empty = (): LayoutByBreakpoint => ({ desktop: {}, tablet: {}, mobile: {} });

export function LayoutLoader({ page, children }: { page: string; children: ReactNode }) {
  const [layouts, setLayouts] = useState<LayoutByBreakpoint>(empty());

  useEffect(() => {
    let mounted = true;
    getLayoutForPage({ data: { page } })
      .then((res) => {
        if (mounted) {
          setLayouts(res);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <EditorProvider page={page} initialLayouts={layouts} key={page}>
      <EditorAdminBridge />
      <UniversalApplier />
      {children}
    </EditorProvider>
  );
}

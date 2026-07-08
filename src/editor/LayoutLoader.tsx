import { useEffect, useState, type ReactNode } from "react";
import { EditorProvider } from "./EditorContext";
import { getLayoutForPage, checkIsAdmin } from "./editor.functions";
import { supabase } from "@/integrations/supabase/client";
import type { LayoutByBreakpoint } from "./types";

const empty = (): LayoutByBreakpoint => ({ desktop: {}, tablet: {}, mobile: {} });

export function LayoutLoader({ page, children }: { page: string; children: ReactNode }) {
  const [layouts, setLayouts] = useState<LayoutByBreakpoint>(empty());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    getLayoutForPage({ data: { page } })
      .then((res) => {
        if (mounted) {
          setLayouts(res);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <EditorProvider page={page} initialLayouts={layouts} key={loaded ? "loaded" : "loading"}>
      <AdminChecker />
      {children}
    </EditorProvider>
  );
}

function AdminChecker() {
  // Runs inside provider, so we can set admin state
  const { EditorAdminBridge } = require("./AdminBridge") as typeof import("./AdminBridge");
  return <EditorAdminBridge />;
}

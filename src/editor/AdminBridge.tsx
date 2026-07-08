import { useEffect } from "react";
import { useEditor } from "./EditorContext";
import { checkIsAdmin } from "./editor.functions";
import { supabase } from "@/integrations/supabase/client";

export function EditorAdminBridge() {
  const editor = useEditor();

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (mounted) editor.setIsAdmin(false);
        return;
      }
      try {
        const res = await checkIsAdmin();
        if (mounted) editor.setIsAdmin(!!res.isAdmin);
      } catch {
        if (mounted) editor.setIsAdmin(false);
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [editor]);

  return null;
}

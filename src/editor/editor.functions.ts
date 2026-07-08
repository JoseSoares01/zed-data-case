import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Breakpoint, ComponentProperties, LayoutByBreakpoint, SavedLayoutRow } from "./types";

// PUBLIC: read layout for a page (site visitors)
export const getLayoutForPage = createServerFn({ method: "POST" })
  .inputValidator((data: { page: string }) => z.object({ page: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data }): Promise<LayoutByBreakpoint> => {
    const emptyByBreakpoint = (): LayoutByBreakpoint => ({ desktop: {}, tablet: {}, mobile: {} });

    try {
      const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
      );
      const { data: rows, error } = await supabase
        .from("layout_editor")
        .select("breakpoint, component, properties")
        .eq("page", data.page);
      if (error) {
        console.error("[getLayoutForPage] db error", error);
        return emptyByBreakpoint();
      }
      const out = emptyByBreakpoint();
      for (const row of rows ?? []) {
        const bp = row.breakpoint as Breakpoint;
        if (!out[bp]) continue;
        const props = (row.properties ?? {}) as ComponentProperties;
        // Strip any exotic prototypes/Proxies by round-tripping through JSON.
        out[bp][row.component] = JSON.parse(JSON.stringify(props));
      }
      // Ensure a fully plain object comes back to the serializer.
      return JSON.parse(JSON.stringify(out)) as LayoutByBreakpoint;
    } catch (e) {
      console.error("[getLayoutForPage] fatal", e);
      return emptyByBreakpoint();
    }
  });


// AUTH: check if current user is admin
export const checkIsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) return { isAdmin: false };
    return { isAdmin: !!data };
  });

// ADMIN: save layout changes (upsert batch)
export const saveLayoutChanges = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { page: string; changes: SavedLayoutRow[] }) =>
    z
      .object({
        page: z.string().min(1).max(64),
        changes: z
          .array(
            z.object({
              page: z.string(),
              breakpoint: z.enum(["desktop", "tablet", "mobile"]),
              component: z.string().min(1).max(2048),
              properties: z.record(z.string(), z.any()),
            }),
          )
          .max(500),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    // Verify admin role
    const { data: role } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("Forbidden: admin only");

    if (data.changes.length === 0) return { ok: true, count: 0 };

    const rows = data.changes.map((c) => ({
      page: c.page,
      breakpoint: c.breakpoint,
      component: c.component,
      properties: c.properties,
      user_id: context.userId,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await context.supabase
      .from("layout_editor")
      .upsert(rows, { onConflict: "page,breakpoint,component" });
    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });

// ADMIN: reset layout for a page
export const resetLayoutForPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { page: string }) => z.object({ page: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw new Error("Forbidden: admin only");
    const { error } = await context.supabase.from("layout_editor").delete().eq("page", data.page);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

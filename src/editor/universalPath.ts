// Stable-ish CSS-path selector for any element, relative to <body>.
// Used as the storage key for "auto-picked" elements in the editor.
//
// IMPORTANT: indices ignore elements marked with [data-editor-ui] so that
// selectors remain stable whether the editor overlay is mounted or not.

export const AUTO_PREFIX = "auto:";

function isEditorUiEl(el: Element): boolean {
  return el.hasAttribute("data-editor-ui") || !!el.closest("[data-editor-ui]");
}

function stableChildren(parent: Element): Element[] {
  return Array.from(parent.children).filter((c) => !isEditorUiEl(c));
}

export function getSelectorPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && node.nodeType === 1) {
    const current: Element = node;
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;
    const tag = current.tagName.toLowerCase();
    const siblings = stableChildren(parent).filter(
      (c) => c.tagName === current.tagName,
    );
    const idx = siblings.indexOf(current) + 1;
    if (idx <= 0) return ""; // element is not resolvable (e.g. inside editor UI)
    parts.unshift(`${tag}:nth-child-stable(${idx})`);
    node = parent;
  }
  return "body>" + parts.join(">");
}

export function autoKeyFor(el: Element): string {
  const path = getSelectorPath(el);
  if (!path) return "";
  return AUTO_PREFIX + path;
}

// Resolve back to a live element using our own traversal that mirrors the
// index rules used at write time (ignoring [data-editor-ui]).
export function resolveAutoKey(key: string): HTMLElement | null {
  if (!key.startsWith(AUTO_PREFIX)) return null;
  const path = key.slice(AUTO_PREFIX.length);
  if (!path.startsWith("body>") && path !== "body") return null;
  const rest = path === "body" ? "" : path.slice("body>".length);
  if (!rest) return document.body;
  const segments = rest.split(">");
  let cursor: Element = document.body;
  for (const seg of segments) {
    const m = seg.match(/^([a-z0-9-]+):nth-child-stable\((\d+)\)$/i);
    if (!m) return null;
    const tag = m[1].toUpperCase();
    const idx = parseInt(m[2], 10);
    const matches = stableChildren(cursor).filter((c) => c.tagName === tag);
    const next = matches[idx - 1];
    if (!next) return null;
    cursor = next;
  }
  return cursor as HTMLElement;
}

export function isAutoKey(key: string): boolean {
  return key.startsWith(AUTO_PREFIX);
}

export function isEditorUi(el: Element | null): boolean {
  if (!el) return false;
  return !!el.closest("[data-editor-ui]");
}

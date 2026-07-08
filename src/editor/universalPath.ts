// Stable-ish CSS-path selector for any element, relative to <body>.
// Used as the storage key for "auto-picked" elements in the editor.

export const AUTO_PREFIX = "auto:";

export function getSelectorPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && node.nodeType === 1) {
    const parent = node.parentElement;
    if (!parent) break;
    const tag = node.tagName.toLowerCase();
    const siblings = Array.from(parent.children).filter(
      (c) => c.tagName === node!.tagName,
    );
    const idx = siblings.indexOf(node) + 1;
    parts.unshift(`${tag}:nth-of-type(${idx})`);
    node = parent;
  }
  return "body>" + parts.join(">");
}

export function autoKeyFor(el: Element): string {
  return AUTO_PREFIX + getSelectorPath(el);
}

export function resolveAutoKey(key: string): HTMLElement | null {
  if (!key.startsWith(AUTO_PREFIX)) return null;
  const selector = key.slice(AUTO_PREFIX.length);
  try {
    return document.querySelector(selector) as HTMLElement | null;
  } catch {
    return null;
  }
}

export function isAutoKey(key: string): boolean {
  return key.startsWith(AUTO_PREFIX);
}

export function isEditorUi(el: Element | null): boolean {
  if (!el) return false;
  return !!el.closest("[data-editor-ui]");
}

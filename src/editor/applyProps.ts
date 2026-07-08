import type { ComponentProperties } from "./types";

// Apply computed properties directly to a DOM element (used for auto-picked
// elements that live outside React trees managed by <Editable>).
export function applyPropsToElement(el: HTMLElement, p: ComponentProperties) {
  const hasTransform =
    p.x !== undefined || p.y !== undefined || p.rotation !== undefined;
  if (hasTransform) {
    const rot = p.rotation ? ` rotate(${p.rotation}deg)` : "";
    el.style.transform = `translate(${p.x ?? 0}px, ${p.y ?? 0}px)${rot}`;
  } else {
    el.style.transform = "";
  }
  el.style.width = p.width !== undefined ? `${p.width}px` : "";
  el.style.height = p.height !== undefined ? `${p.height}px` : "";
  el.style.padding = p.padding !== undefined ? `${p.padding}px` : "";
  el.style.margin = p.margin !== undefined ? `${p.margin}px` : "";
  el.style.borderRadius =
    p.borderRadius !== undefined ? `${p.borderRadius}px` : "";
  el.style.opacity = p.opacity !== undefined ? String(p.opacity) : "";
  el.style.background = p.background ?? "";
  el.style.zIndex = p.zIndex !== undefined ? String(p.zIndex) : "";
  el.style.color = p.color ?? "";
  el.style.fontSize = p.fontSize !== undefined ? `${p.fontSize}px` : "";
  el.style.fontWeight = p.fontWeight !== undefined ? String(p.fontWeight) : "";
  el.style.textAlign = p.textAlign ?? "";
  if (p.text !== undefined && !el.isContentEditable) {
    if (el.textContent !== p.text) el.textContent = p.text;
  }
}

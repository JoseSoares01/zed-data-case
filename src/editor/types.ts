export type Breakpoint = "desktop" | "tablet" | "mobile";

export type ComponentProperties = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  opacity?: number;
  background?: string;
  zIndex?: number;
};

export type LayoutMap = Record<string, ComponentProperties>;

export type LayoutByBreakpoint = Record<Breakpoint, LayoutMap>;

export type SavedLayoutRow = {
  page: string;
  breakpoint: Breakpoint;
  component: string;
  properties: ComponentProperties;
};

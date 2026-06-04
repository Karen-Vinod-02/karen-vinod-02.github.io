export interface HeadingPosition {
  id: string;
  top: number;
  element: HTMLElement;
}

export const tocState = {
  activeId: "",
  headings: [] as HeadingPosition[],
  isNavigating: false,
  progress: 0,
};
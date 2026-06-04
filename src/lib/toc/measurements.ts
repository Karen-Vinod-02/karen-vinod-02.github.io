import { tocState } from './state';

export class LayoutMeasurements {
  private container: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  constructor(containerSelector: string) {
    this.container = document.querySelector(containerSelector) as HTMLElement;
    if (!this.container) return;

    this.initObservers();
    this.calculate();
  }

  private initObservers() {
    this.resizeObserver = new ResizeObserver(() => this.calculate());
    this.resizeObserver.observe(this.container);

    this.mutationObserver = new MutationObserver(() => this.calculate());
    this.mutationObserver.observe(this.container, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  public calculate() {
    const headingElements = Array.from(
      document.querySelectorAll('.post-body-content h2, .post-body-content h3, .post-body-content h4')
    ) as HTMLElement[];

    tocState.headings = headingElements.map(heading => {
      const scrollMargin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
      return {
        id: heading.getAttribute('id') || '',
        top: heading.getBoundingClientRect().top + window.scrollY - scrollMargin,
        element: heading
      };
    });
  }

  public destroy() {
    // Important cleanup method to prevent memory leaks
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mutationObserver) this.mutationObserver.disconnect();
  }
}
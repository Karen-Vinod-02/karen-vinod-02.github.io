import { tocState } from './state';

export class ScrollSpy {
  private tocLinks: NodeListOf<HTMLElement>;
  private trackIndicator: HTMLElement | null;
  private tocList: HTMLElement | null;

  constructor() {
    this.tocLinks = document.querySelectorAll('[data-toc-link]');
    this.trackIndicator = document.getElementById('toc-indicator-line');
    this.tocList = document.querySelector('.toc-list');
  }

  public checkActiveHeading(scrollY: number) {
    if (tocState.isNavigating || tocState.headings.length === 0) return;

    const viewportMiddle = scrollY + (window.innerHeight / 2);
    let newActiveId = tocState.headings[0]?.id || "";
    let minDistance = Infinity;

    for (const heading of tocState.headings) {
      const distance = Math.abs(heading.top - viewportMiddle);
      if (distance < minDistance && heading.top <= viewportMiddle + 200) {
        minDistance = distance;
        newActiveId = heading.id;
      }
    }

    if (newActiveId !== tocState.activeId) {
      this.setActive(newActiveId);
    }
  }

  public setActive(newActiveId: string) {
    tocState.activeId = newActiveId;
    this.updateUI();
  }

  private updateUI() {
    this.tocLinks.forEach(link => {
      const anchor = link as HTMLAnchorElement;
      // RELIABLE MATCHING: anchor.hash strips out Astro's absolute URL paths
      const isActive = anchor.hash === `#${tocState.activeId}`;
      link.classList.toggle('active-toc', isActive);
    });

    const activeLink = document.querySelector('[data-toc-link].active-toc');
    if (activeLink && this.trackIndicator && this.tocList) {
      const activeLi = activeLink.closest('.toc-item') as HTMLLIElement | null;
      if (activeLi) {
        
        const listContainer = this.tocList.getBoundingClientRect();
        const itemBounds = activeLi.getBoundingClientRect();
        
        const relativeOffset = itemBounds.top - listContainer.top + this.tocList.scrollTop;

        this.trackIndicator.style.top = `${relativeOffset}px`;
        this.trackIndicator.style.height = `${itemBounds.height}px`;
        this.trackIndicator.style.opacity = "1";

        activeLi.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    } else if (this.trackIndicator) {
      this.trackIndicator.style.opacity = "0";
    }
  }
}
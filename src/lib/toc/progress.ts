import { tocState } from './state';

export class ProgressTracker {
  private progressTrack: HTMLElement | null;
  private tocList: HTMLElement | null;
  private tocContainer: HTMLElement | null;

  constructor() {
    this.progressTrack = document.getElementById('toc-progress-track');
    this.tocList = document.querySelector('.toc-list');
    this.tocContainer = document.querySelector('.toc-track-container');
    
    this.initClickTrack();
  }

  public calculateProgress(scrollY: number) {
    if (!this.progressTrack || !this.tocList || tocState.headings.length === 0) return;

    const firstTop = tocState.headings[0].top;
    const lastTop = tocState.headings[tocState.headings.length - 1].top;
    
    let progress = 0;
    if (scrollY < firstTop) progress = 0;
    else if (scrollY > lastTop) progress = 100;
    else progress = ((scrollY - firstTop) / (lastTop - firstTop)) * 100;

    const tocHeight = this.tocList.offsetHeight;
    const progressHeight = (progress / 100) * tocHeight;
    this.progressTrack.style.height = `${Math.max(0, Math.min(tocHeight, progressHeight))}px`;
  }

  private initClickTrack() {
    if (!this.tocContainer || !this.tocList) return;
    
    this.tocContainer.style.cursor = 'pointer';
    this.tocContainer.addEventListener('click', (e: MouseEvent) => {
      
      // If user clics a TOC text link, abort the progress track calculation
      if ((e.target as HTMLElement).closest('[data-toc-link]')) {
        return; 
      }

      const rect = this.tocContainer!.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const tocHeight = this.tocList!.offsetHeight;
      const clickPercent = clickY / tocHeight;
      
      if (tocState.headings.length === 0) return;
      
      const firstTop = tocState.headings[0].top;
      const lastTop = tocState.headings[tocState.headings.length - 1].top;
      const targetScroll = firstTop + (clickPercent * (lastTop - firstTop));
      
      let closestHeading = tocState.headings[0];
      let minDistance = Math.abs(targetScroll - closestHeading.top);
      
      for (const heading of tocState.headings) {
        const distance = Math.abs(targetScroll - heading.top);
        if (distance < minDistance) {
          minDistance = distance;
          closestHeading = heading;
        }
      }
      
      if (closestHeading) {
        tocState.isNavigating = true;
        window.scrollTo({ top: closestHeading.top, behavior: 'smooth' });
        history.pushState(null, '', `#${closestHeading.id}`);
        
        setTimeout(() => { tocState.isNavigating = false; }, 800);
      }
    });
  }
} 
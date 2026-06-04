import { LayoutMeasurements } from './measurements';
import { ScrollSpy } from './scrollspy';
import { ProgressTracker } from './progress';
import { tocState } from './state';

export function initializeTOC() {
  let ticking = false;

  const measurements = new LayoutMeasurements('.post-body-content');
  const scrollSpy = new ScrollSpy();
  const progressTracker = new ProgressTracker();

  document.querySelectorAll('[data-toc-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      const anchor = link as HTMLAnchorElement;
      
      // GUARDFALL: Only hijack clicks that actually contain a hash
      if (!anchor.hash) return;

      e.preventDefault();
      e.stopPropagation();

      // anchor.hash safely returns "#id" even if the href is a full URL path
      const targetId = anchor.hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        history.pushState(null, '', anchor.hash);
        tocState.isNavigating = true;

        // Immediately snap the TOC indicator to the clicked item
        scrollSpy.setActive(targetId);

        // Safely calculate dynamic header offset
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.getBoundingClientRect().height : 80;
        
        const exactTop = targetElement.getBoundingClientRect().top + window.scrollY - (headerHeight + 24);
        window.scrollTo({ top: exactTop, behavior: 'smooth' });

        setTimeout(() => { tocState.isNavigating = false; }, 800);
      }
    });
  });

  // Handle Hash on Load
  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        scrollSpy.setActive(targetId);
        
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.getBoundingClientRect().height : 80;
        
        const exactTop = targetElement.getBoundingClientRect().top + window.scrollY - (headerHeight + 24);
        window.scrollTo({ top: exactTop, behavior: 'auto' });
      }
    }, 200);
  }

  // Master Scroll Loop
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        scrollSpy.checkActiveHeading(scrollY);
        progressTracker.calculateProgress(scrollY);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial paint

  return () => {
    window.removeEventListener('scroll', onScroll);
    measurements.destroy();
  };
}
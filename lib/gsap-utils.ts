import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const revealOnScroll = (element: string | HTMLElement, delay: number = 0) => {
  gsap.from(element, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay,
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
};

export { gsap, ScrollTrigger };

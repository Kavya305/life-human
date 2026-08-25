'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A single gentle entrance, used sparingly.
 *
 * Fifteen lines of IntersectionObserver instead of an animation library. It
 * reveals once and then disconnects — nothing here should keep running while
 * someone is trying to read.
 *
 * Two failure modes are handled deliberately, because the cost of getting
 * them wrong is invisible content rather than a missing flourish:
 *
 *  1. No JavaScript. The hidden state is applied only under
 *     `html[data-reveal='on']`, which is set by an inline script in the
 *     layout. Without JS the marker never appears and everything renders
 *     plainly visible.
 *
 *  2. A document that starts hidden. Opening a link in a background tab
 *     leaves `visibilityState === 'hidden'`, and the browser delivers no
 *     IntersectionObserver callbacks at all in that state — so a naive
 *     observer would leave the whole page transparent until the reader
 *     scrolled. We wait for the document to become visible before observing.
 *
 * `prefers-reduced-motion` is handled in CSS, so it holds even if none of
 * this runs.
 */

interface RevealProps {
  children: React.ReactNode;
  /** Stagger, in milliseconds. Keep it small; this is breathing, not choreography. */
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'p';
  className?: string;
}

export function Reveal({ children, delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer?.disconnect();
          }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
      );
      observer.observe(node);
    };

    if (document.visibilityState === 'visible') {
      observe();
      return () => observer?.disconnect();
    }

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', onVisible);
      observe();
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      observer?.disconnect();
    };
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-shown={shown}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

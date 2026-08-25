'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

/**
 * Four items. Home lives on the wordmark.
 *
 * "Today I Will" is deliberately not here — it is reached from the homepage
 * and the footer. Putting it in the nav would make an intimate thing look like
 * a product feature.
 */
const nav = [
  { href: '/explore', label: 'Explore' },
  { href: '/series', label: 'Series' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /* The header dims its rule until the page has moved — on the hero, even a
     hairline is more than the first screen needs. */
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const onScroll = () => setMoved(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close on navigation, and never leave the body locked behind us. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={styles.header} data-moved={moved} data-open={open}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark} aria-label="Life.Human — home">
          <span>Life</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>Human</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <span className={styles.toggleLines} aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Mobile navigation is a full page of its own — the same generous
          typography as everything else, not a cramped drop-down. */}
      <div className={styles.sheet} id="site-menu" hidden={!open}>
        <nav aria-label="Primary, mobile">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} style={{ '--i': i } as React.CSSProperties}>
                <Link href={item.href} data-active={isActive(item.href)}>
                  <span className={styles.sheetIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.sheetFoot}>
          <Link href="/today">Today I Will</Link>
          <span className={styles.sheetQuestion}>What does it mean to be human?</span>
        </p>
      </div>
    </header>
  );
}

import Link from 'next/link';
import styles from './Footer.module.css';

const sections = [
  { href: '/explore', label: 'Explore' },
  { href: '/series', label: 'Series' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/today', label: 'Today I Will' },
];

/* The Instagram link came with QR tracking parameters attached; they are
   dropped here so the footer does not hand a reader's origin to anyone. */
const social = [
  { href: 'https://www.instagram.com/life.human26', label: 'Instagram' },
  { href: 'https://www.youtube.com/@Life-jgn', label: 'YouTube' },
  { href: 'https://www.facebook.com/share/1Dd5x8XaTc/', label: 'Facebook' },
  { href: 'https://life-jgn.blogspot.com', label: 'Blog' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.mark}>
          <p className={styles.name}>Life.Human</p>
          <p className={styles.tagline}>Question. Think. Choose Humanity.</p>
          <p className={styles.question}>What does it mean to be human?</p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <ul>
            {sections.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>{s.label}</Link>
              </li>
            ))}
          </ul>
          <ul>
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} rel="me noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.base}>
        <p>A better world begins with a better human.</p>
        <p>&copy; {new Date().getFullYear()} Life.Human</p>
      </div>
    </footer>
  );
}

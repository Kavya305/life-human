import Link from 'next/link';
import styles from './Footer.module.css';

const sections = [
  { href: '/explore', label: 'Explore' },
  { href: '/series', label: 'Series' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/today', label: 'Today I Will' },
];

const social = [
  { href: 'https://instagram.com/', label: 'Instagram' },
  { href: 'https://youtube.com/', label: 'YouTube' },
  { href: 'https://facebook.com/', label: 'Facebook' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.mark}>
          <p className={styles.name}>Life.Human</p>
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
        <p>Tuṣṭi and Puṣṭi — contentment and nourishment.</p>
        <p>&copy; {new Date().getFullYear()} Life.Human</p>
      </div>
    </footer>
  );
}

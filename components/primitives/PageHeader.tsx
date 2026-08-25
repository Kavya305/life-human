import { Eyebrow } from './Eyebrow';
import styles from './PageHeader.module.css';

/**
 * The masthead every section page opens with. Keeping it in one component is
 * what makes Explore, Series, Journal and About read as chapters of one
 * publication rather than four pages that happen to share a font.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className="shell">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={`headline ${styles.title}`}>{title}</h1>
        {lede && <p className={`lede ${styles.lede}`}>{lede}</p>}
        {children}
      </div>
    </header>
  );
}

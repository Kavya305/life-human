import Link from 'next/link';
import { Plate } from '@/components/primitives/Plate';
import styles from './Threshold.module.css';

/**
 * The first screen.
 *
 * The central question is the emotional anchor — not a welcome, not a value
 * proposition. It should read like the opening page of a book someone chose
 * to pick up.
 *
 * It is deliberately ~88vh, not 100vh: the next section peeks, so the page
 * invites rather than gates.
 */
export function Threshold() {
  return (
    <section className={styles.threshold} aria-labelledby="the-question">
      <div className={styles.plate}>
        <Plate variant="aperture" tone="quiet" />
      </div>

      <div className={styles.inner}>
        <h1 id="the-question" className={`display ${styles.question}`}>
          What does it mean
          <br />
          to be <em>human</em>?
        </h1>

        <p className={styles.support}>
          Life.Human is an exploration of life, humanity, wisdom and the ideas
          that shape the way we live.
        </p>

        <Link href="#premise" className={styles.begin}>
          <span className={styles.breath} aria-hidden="true" />
          <span className={styles.beginLabel}>Begin</span>
        </Link>
      </div>
    </section>
  );
}

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
        {/* Three sentences, stacked. Set on separate lines they read as three
            deliberate acts rather than one slogan. */}
        <h1 id="the-question" className={`display ${styles.headline}`}>
          Question.
          <br />
          Think.
          <br />
          Choose <em>humanity</em>.
        </h1>

        <p className={styles.anchor}>What does it mean to be human?</p>

        <p className={styles.support}>
          <span className={styles.creed}>
            A better world begins with a better human.
          </span>
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

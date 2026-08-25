import Link from 'next/link';
import { pillars } from '@/content/pillars';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Plate } from '@/components/primitives/Plate';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './Pillars.module.css';

/**
 * The five pillars as editorial rows rather than a card grid.
 *
 * A grid of five cards would read as a feature list — five products. Rows
 * read as a contents page: five chapters of one thing. On hover each row
 * takes its own world's ground and its pillar's accent, so you see the
 * difference between the rooms without ever leaving the house.
 *
 * They are numbered because they are an arc, not a menu: inward, outward,
 * backward, sideways, and inward again as conduct.
 */
export function Pillars() {
  return (
    <section className={`section ${styles.pillars}`} aria-labelledby="pillars-h">
      <div className="shell">
        <Reveal>
          <header className={styles.head}>
            <Eyebrow>The five</Eyebrow>
            <h2 id="pillars-h" className={`headline ${styles.title}`}>
              Five ways of asking the same question.
            </h2>
          </header>
        </Reveal>

        <ul className={styles.list}>
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.id} delay={i * 70}>
              <Link
                href={`/explore?pillar=${pillar.id}`}
                className={styles.row}
                data-world={pillar.world}
                data-pillar={pillar.id}
              >
                <span className={styles.numeral} aria-hidden="true">
                  {pillar.numeral}
                </span>

                <span className={styles.names}>
                  <span className={styles.name}>{pillar.name}</span>
                  <span className={styles.subject}>{pillar.subject}</span>
                </span>

                <span className={styles.line}>{pillar.line}</span>

                <span className={styles.plate} aria-hidden="true">
                  <Plate variant={pillar.plate} />
                </span>

                <span className={styles.arrow} aria-hidden="true">
                  &#8594;
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

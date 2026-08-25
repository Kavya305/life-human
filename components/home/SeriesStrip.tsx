import Link from 'next/link';
import { seriesWithCounts } from '@/lib/content';
import { pillarById } from '@/content/pillars';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './SeriesStrip.module.css';

/** The series, as a quiet index. Long-running enquiries, not a product range. */
export function SeriesStrip() {
  const all = seriesWithCounts();

  return (
    <section className={`section ${styles.strip}`} aria-labelledby="series-h">
      <div className="shell">
        <Reveal>
          <header className={styles.head}>
            <div>
              <Eyebrow>Long enquiries</Eyebrow>
              <h2 id="series-h" className={`headline ${styles.title}`}>
                Some questions take a series.
              </h2>
            </div>
            <Link href="/series" className={`link ${styles.all}`}>
              All series
              <span className="arrow" aria-hidden="true">
                &#8594;
              </span>
            </Link>
          </header>
        </Reveal>

        <ul className={styles.list}>
          {all.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 50}>
              <Link href={`/series/${s.slug}`} className={styles.row} data-pillar={s.pillar}>
                <span className={styles.name}>
                  {s.title}
                  {s.altTitle && <span className={styles.alt}>{s.altTitle}</span>}
                </span>
                <span className={styles.question}>{s.question}</span>
                <span className={styles.count}>
                  {pillarById(s.pillar).name}
                  <span aria-hidden="true"> · </span>
                  {s.count} {s.count === 1 ? 'piece' : 'pieces'}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

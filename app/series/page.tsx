import type { Metadata } from 'next';
import Link from 'next/link';
import { seriesWithCounts } from '@/lib/content';
import { pillarById } from '@/content/pillars';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Plate } from '@/components/primitives/Plate';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './series.module.css';

export const metadata: Metadata = {
  title: 'Series',
  description:
    'Long-running enquiries at Life.Human — the Śrīmad-Bhāgavatam, Education & Competition, Today I Will, To Serve, Life & Time, History of Bharat and Inner Beauty.',
};

/** Some questions do not fit in one piece. */
export default function SeriesIndexPage() {
  const all = seriesWithCounts();

  return (
    <>
      <PageHeader
        eyebrow="Long enquiries"
        title="Some questions take a series."
        lede="A series is a question we expect to be living with for years. Each one is meant to be followed in order, though nothing stops you starting anywhere."
      />

      <div className="shell">
        <ul className={styles.list}>
          {all.map((s, i) => {
            const pillar = pillarById(s.pillar);
            return (
              <Reveal as="li" key={s.slug} delay={(i % 2) * 80}>
                <Link href={`/series/${s.slug}`} className={styles.card} data-pillar={s.pillar}>
                  <div className={styles.plate} data-world={pillar.world} data-paint="">
                    <Plate variant={s.plate} />
                  </div>
                  <div className={styles.text}>
                    <h2 className={styles.name}>{s.title}</h2>
                    {s.altTitle && <p className={styles.alt}>{s.altTitle}</p>}
                    <p className={styles.question}>{s.question}</p>
                    <p className={styles.description}>{s.description}</p>
                    <p className={styles.meta}>
                      {pillar.name}
                      <span aria-hidden="true"> · </span>
                      {s.count} {s.count === 1 ? 'piece' : 'pieces'}
                      <span aria-hidden="true"> · </span>
                      {s.status === 'ongoing' ? 'Ongoing' : 'Planned'}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </>
  );
}

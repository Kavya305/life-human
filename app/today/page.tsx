import type { Metadata } from 'next';
import Link from 'next/link';
import { TodayIWill } from '@/components/home/TodayIWill';
import { piecesInSeries } from '@/lib/content';
import { PieceCard } from '@/components/archive/PieceCard';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './today.module.css';

export const metadata: Metadata = {
  title: 'Today I Will',
  description:
    'One small human act, offered without a streak, a score or a reminder. Philosophy turned into something you can do before this evening.',
};

/** A room of its own, kept as small as the idea it holds. */
export default function TodayPage() {
  const parts = piecesInSeries('today-i-will');

  return (
    <>
      <TodayIWill heading="h1" />

      <section className={`shell-narrow ${styles.note}`} aria-labelledby="why-h">
        <Reveal>
          <Eyebrow as="h2">
            <span id="why-h">Why this exists</span>
          </Eyebrow>
          <div className="prose">
            <p>
              Thinking that never changes how you treat someone is a kind of
              entertainment. This is the smallest possible bridge between the
              two: one sentence, one act, one day.
            </p>
            <p>
              There is deliberately nothing to complete here. No streak to
              protect, no count, nothing saved, nothing measured. The moment
              this becomes something you can score, it stops being what it is —
              and Life.Human becomes the sort of thing it exists to question.
            </p>
            <p>
              Take one. Or take none. Come back in a month. It will be here, and
              it will not have been keeping track.
            </p>
          </div>
        </Reveal>
      </section>

      {parts.length ? (
        <section className={`shell ${styles.related}`} aria-labelledby="series-h">
          <Eyebrow as="h2">
            <span id="series-h">From the series</span>
          </Eyebrow>
          <ul className={styles.grid}>
            {parts.map((p) => (
              <li key={p.slug}>
                <PieceCard piece={p} />
              </li>
            ))}
          </ul>
          <p className={styles.more}>
            <Link href="/series/today-i-will" className="link">
              The whole series
              <span className="arrow" aria-hidden="true">
                &#8594;
              </span>
            </Link>
          </p>
        </section>
      ) : null}
    </>
  );
}

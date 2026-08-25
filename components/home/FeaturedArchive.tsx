import Link from 'next/link';
import { featuredPieces } from '@/lib/content';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import { PieceCard } from '@/components/archive/PieceCard';
import styles from './FeaturedArchive.module.css';

/**
 * A glimpse of the archive — one lead piece and two beside it. Asymmetric on
 * purpose: an even grid of three implies a catalogue, and this is meant to
 * imply a publication with a front page.
 */
export function FeaturedArchive() {
  const [lead, ...rest] = featuredPieces().slice(0, 3);
  if (!lead) return null;

  return (
    <section className={`section ${styles.archive}`} aria-labelledby="archive-h">
      <div className="shell">
        <Reveal>
          <header className={styles.head}>
            <div>
              <Eyebrow>The work</Eyebrow>
              <h2 id="archive-h" className={`headline ${styles.title}`}>
                A growing archive of human questions.
              </h2>
            </div>
            <Link href="/explore" className={`link ${styles.all}`}>
              Enter the archive
              <span className="arrow" aria-hidden="true">
                &#8594;
              </span>
            </Link>
          </header>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.lead}>
            <PieceCard piece={lead} size="lead" />
          </Reveal>

          <div className={styles.side}>
            {rest.map((piece, i) => (
              <Reveal key={piece.slug} delay={100 + i * 90}>
                <PieceCard piece={piece} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

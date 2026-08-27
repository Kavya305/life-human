import Link from 'next/link';
import type { Piece } from '@/content/types';
import { pillarById } from '@/content/pillars';
import { seriesBySlug } from '@/content/series';
import { formatDate, typeLabel } from '@/lib/format';
import { Plate } from '@/components/primitives/Plate';
import styles from './PieceCard.module.css';

/**
 * One entry in the library.
 *
 * Order is deliberate: the central question comes first, above the title,
 * because the question is the unit of this archive. Then the visual, the
 * title, the short description, and only then the metadata.
 *
 * There are no engagement figures here and there never will be — a view count
 * tells a reader what other people did, which is the one thing that should not
 * influence whether they read something.
 */

export type CardSize = 'lead' | 'standard' | 'compact';

export function PieceCard({ piece, size = 'standard' }: { piece: Piece; size?: CardSize }) {
  const pillar = pillarById(piece.pillar);
  const inSeries = piece.seriesSlug ? seriesBySlug(piece.seriesSlug) : undefined;

  return (
    <article className={styles.card} data-size={size} data-pillar={piece.pillar}>
      <Link href={`/explore/${piece.slug}`} className={styles.link}>
        <div className={styles.plate} data-world={pillar.world} data-paint="">
          {piece.cover ? (
            <img
              className={styles.cover}
              src={piece.cover}
              alt={piece.coverAlt ?? ''}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Plate variant={piece.plate} />
          )}
          <span className={styles.type}>{typeLabel[piece.type]}</span>
        </div>

        <div className={styles.text}>
          {piece.question && <p className={styles.question}>{piece.question}</p>}

          <h3 className={styles.title}>{piece.title}</h3>

          {size !== 'compact' && piece.dek && <p className={styles.dek}>{piece.dek}</p>}

          <p className={styles.meta}>
            <span className={styles.pillar}>{pillar.name}</span>
            {inSeries && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {inSeries.title}
                  {piece.part ? ` ${piece.part}` : ''}
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <time dateTime={piece.date}>{formatDate(piece.date)}</time>
          </p>
        </div>
      </Link>
    </article>
  );
}

import Link from 'next/link';
import type { Piece, PieceType, PillarId } from '@/content/types';
import { pillars } from '@/content/pillars';
import { PieceCard } from './PieceCard';
import styles from './ArchiveBrowser.module.css';

/**
 * The library.
 *
 * This is a server component on purpose. An earlier version filtered in the
 * browser, which meant the archive — the most important page for anyone
 * arriving from a search engine — shipped as an empty shell and filled in
 * after hydration.
 *
 * Filters are links, not buttons. Every view of the shelf has a real address:
 * it is crawlable, linkable, survives a page refresh, works with no JavaScript
 * at all, and costs nothing in client bundle. A library's shelves should have
 * addresses.
 */

const types: { id: PieceType; label: string }[] = [
  { id: 'film', label: 'Films' },
  { id: 'essay', label: 'Essays' },
  { id: 'visual', label: 'Visual stories' },
  { id: 'short', label: 'Shorts' },
];

interface ArchiveBrowserProps {
  pieces: Piece[];
  pillar?: PillarId;
  type?: PieceType;
}

/** Builds the address of one filtered view, preserving the other axis. */
const href = (pillar?: string, type?: string) => {
  const params = new URLSearchParams();
  if (pillar) params.set('pillar', pillar);
  if (type) params.set('type', type);
  const qs = params.toString();
  return qs ? `/explore?${qs}` : '/explore';
};

export function ArchiveBrowser({ pieces, pillar, type }: ArchiveBrowserProps) {
  const shown = pieces.filter(
    (p) => (!pillar || p.pillar === pillar) && (!type || p.type === type),
  );
  const filtered = Boolean(pillar || type);

  return (
    <>
      <div className={styles.filters}>
        <nav className={styles.group} aria-label="Filter by pillar">
          <p className={styles.legend}>Pillar</p>
          <div className={styles.options}>
            <Link
              href={href(undefined, type)}
              className={styles.chip}
              data-on={!pillar}
              aria-current={!pillar ? 'true' : undefined}
            >
              All
            </Link>
            {pillars.map((p) => {
              const on = pillar === p.id;
              return (
                <Link
                  key={p.id}
                  /* Selecting the active filter again clears it. */
                  href={href(on ? undefined : p.id, type)}
                  className={styles.chip}
                  data-pillar={p.id}
                  data-on={on}
                  aria-current={on ? 'true' : undefined}
                >
                  {p.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <nav className={styles.group} aria-label="Filter by form">
          <p className={styles.legend}>Form</p>
          <div className={styles.options}>
            <Link
              href={href(pillar, undefined)}
              className={styles.chip}
              data-on={!type}
              aria-current={!type ? 'true' : undefined}
            >
              All
            </Link>
            {types.map((t) => {
              const on = type === t.id;
              return (
                <Link
                  key={t.id}
                  href={href(pillar, on ? undefined : t.id)}
                  className={styles.chip}
                  data-on={on}
                  aria-current={on ? 'true' : undefined}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* A count of what is on the shelf is navigational, not a popularity
          figure — it says how much is here, never how many people came. */}
      <p className={styles.count}>
        {shown.length} {shown.length === 1 ? 'piece' : 'pieces'}
        {filtered && (
          <Link href="/explore" className={styles.clear}>
            Clear
          </Link>
        )}
      </p>

      {shown.length ? (
        <ul className={styles.grid}>
          {shown.map((piece) => (
            <li key={piece.slug}>
              <PieceCard piece={piece} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          Nothing here yet. This part of the archive is still being written.
        </p>
      )}
    </>
  );
}

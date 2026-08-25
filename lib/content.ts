import { pieces } from '@/content/pieces';
import { series } from '@/content/series';
import { pillars, pillarById } from '@/content/pillars';
import type { Piece, PieceType, PillarId, World } from '@/content/types';

const byNewest = (a: Piece, b: Piece) => (a.date < b.date ? 1 : -1);

export const allPieces = (): Piece[] => [...pieces].sort(byNewest);

export const pieceBySlug = (slug: string): Piece | undefined =>
  pieces.find((p) => p.slug === slug);

export const featuredPieces = (): Piece[] =>
  allPieces().filter((p) => p.featured);

export const piecesByPillar = (pillar: PillarId): Piece[] =>
  allPieces().filter((p) => p.pillar === pillar);

export const piecesByType = (type: PieceType): Piece[] =>
  allPieces().filter((p) => p.type === type);

/** Series entries in reading order — a series is meant to be followed. */
export const piecesInSeries = (slug: string): Piece[] =>
  pieces
    .filter((p) => p.seriesSlug === slug)
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0));

export const resolveSlugs = (slugs: string[] = []): Piece[] =>
  slugs.map(pieceBySlug).filter((p): p is Piece => Boolean(p));

/** The world a piece lives in is inherited from its pillar. */
export const worldOf = (piece: Piece): World => pillarById(piece.pillar).world;

/**
 * Where to go next. A reader should never reach the end of a piece and find
 * nothing — so we walk outward: the next part of its series, then the next
 * piece in its pillar, then the most recent thing we have.
 */
export const nextExploration = (piece: Piece): Piece | undefined => {
  if (piece.seriesSlug && piece.part) {
    const next = piecesInSeries(piece.seriesSlug).find(
      (p) => (p.part ?? 0) > (piece.part ?? 0),
    );
    if (next) return next;
  }

  const samePillar = piecesByPillar(piece.pillar).filter(
    (p) => p.slug !== piece.slug && p.type !== 'short',
  );
  if (samePillar.length) {
    const idx = samePillar.findIndex((p) => p.date < piece.date);
    return idx >= 0 ? samePillar[idx] : samePillar[0];
  }

  return allPieces().find((p) => p.slug !== piece.slug);
};

/** Long-form only, for the Journal. */
export const journalPieces = (): Piece[] =>
  allPieces().filter((p) => p.type === 'essay' || p.type === 'visual');

export const seriesWithCounts = () =>
  series.map((s) => ({ ...s, count: piecesInSeries(s.slug).length }));

export { pillars, pillarById, series };

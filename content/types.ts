/**
 * The Life.Human content model.
 *
 * One `Piece` covers every kind of work — a film, an essay, a short, a
 * visual story. Adding new work means adding one object, never touching a
 * component. When this moves to a CMS the shapes map across unchanged.
 */

export type PillarId = 'think' | 'understand' | 'discover' | 'question' | 'become';

/** The three visual worlds. A world sets the ground; a pillar sets one accent. */
export type World = 'philosophy' | 'history' | 'wisdom';

export type PieceType = 'film' | 'essay' | 'short' | 'visual';

/** Hand-drawn SVG plates stand in for photography. See components/primitives/Plate. */
export type PlateVariant =
  | 'arch'
  | 'horizon'
  | 'manuscript'
  | 'threshold'
  | 'orbit'
  | 'river'
  | 'column'
  | 'aperture';

export interface Pillar {
  id: PillarId;
  /** The verb. THINK, UNDERSTAND … */
  name: string;
  /** The subject. "Life.Human Philosophy" … */
  subject: string;
  /** Roman numeral — the five are an arc, not a list. */
  numeral: string;
  world: World;
  /** One line, on the homepage row. */
  line: string;
  /** A paragraph, on the archive and pillar headers. */
  description: string;
  plate: PlateVariant;
}

export interface Series {
  slug: string;
  title: string;
  /** Transliterated or alternate rendering, shown small beneath the title. */
  altTitle?: string;
  pillar: PillarId;
  /** The question the whole series is circling. */
  question: string;
  description: string;
  plate: PlateVariant;
  /** Series that are announced but not yet begun still deserve a page. */
  status: 'ongoing' | 'planned';
}

/** A source, marked so a reader can judge it for themselves. */
export interface Source {
  text: string;
  detail?: string;
  href?: string;
}

/**
 * The epistemic register of a claim. Making this explicit — rather than
 * letting assertion and speculation blur — is the project's core
 * intellectual commitment, so it lives in the content model itself.
 */
export type ClaimKind = 'fact' | 'interpretation' | 'hypothesis' | 'question';

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'quote'; text: string; attribution?: string }
  /** A claim, labelled with its epistemic register. */
  | { kind: 'claim'; claim: ClaimKind; text: string }
  | { kind: 'aside'; text: string };

export interface Piece {
  slug: string;
  title: string;
  /** The central question. This, not the title, is the unit of the archive. */
  question: string;
  pillar: PillarId;
  type: PieceType;
  seriesSlug?: string;
  /** Position within its series. */
  part?: number;
  /** ISO date. */
  date: string;
  /** The short philosophical description that carries the card. */
  dek: string;
  plate: PlateVariant;
  /** YouTube id, when the film exists. Absent renders a waiting state. */
  videoId?: string;
  /** Roughly how long the written piece runs, in minutes. Never shown as a promise. */
  minutes?: number;
  essay?: Block[];
  sources?: Source[];
  /** Slugs of shorts that grew out of this piece. */
  relatedShorts?: string[];
  /** Slugs of pieces that argue with, or extend, this one. */
  relatedIdeas?: string[];
  featured?: boolean;
}

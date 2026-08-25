import type { ClaimKind } from './types';

/** Six lines. They are set almost as a poem, and they mean what they say. */
export const principles: { left: string; right: string }[] = [
  { left: 'Truth', right: 'popularity' },
  { left: 'Questioning', right: 'preaching' },
  { left: 'Evidence', right: 'ideology' },
  { left: 'Humanity', right: 'tribalism' },
  { left: 'Depth', right: 'noise' },
  { left: 'Authenticity', right: 'algorithms' },
];

/**
 * The epistemic register of a claim, made visible. This is the project's
 * central intellectual commitment, so it is documented as content rather
 * than buried in a stylesheet.
 */
export const claimKinds: {
  kind: ClaimKind;
  label: string;
  meaning: string;
}[] = [
  {
    kind: 'fact',
    label: 'Fact',
    meaning:
      'Something we believe can be checked, with a source we are willing to name. If we are wrong, you should be able to demonstrate it.',
  },
  {
    kind: 'interpretation',
    label: 'Interpretation',
    meaning:
      'A reading of the evidence. Other careful people looking at the same material may read it differently, and that disagreement is legitimate.',
  },
  {
    kind: 'hypothesis',
    label: 'Hypothesis',
    meaning:
      'A proposal that goes beyond what the evidence currently supports. We think it is worth considering. We do not think it is settled.',
  },
  {
    kind: 'question',
    label: 'Question',
    meaning:
      'Something genuinely open, which we are not going to close for you. Most of the real work of this project happens here.',
  },
];

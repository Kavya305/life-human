import Link from 'next/link';

/** Even the 404 should sound like the rest of the publication. */
export default function NotFound() {
  return (
    <section className="shell" style={{ paddingBlock: 'clamp(6rem, 18vw, 12rem)' }}>
      <p className="eyebrow">Not here</p>
      <h1
        className="headline"
        style={{ marginBlockStart: '1.5rem', maxWidth: '16ch', color: 'var(--ink)' }}
      >
        This page does not exist.
      </h1>
      <p
        className="lede"
        style={{ marginBlockStart: '1.75rem', maxWidth: '38ch', fontStyle: 'italic' }}
      >
        Which is its own small lesson about looking for things where you expect
        them to be.
      </p>
      <p style={{ marginBlockStart: '2.5rem' }}>
        <Link href="/explore" className="link">
          Enter the archive
          <span className="arrow" aria-hidden="true">
            &#8594;
          </span>
        </Link>
      </p>
    </section>
  );
}

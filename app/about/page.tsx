import type { Metadata } from 'next';
import { aboutSections, aboutStatement, approachIntro, claimIntro } from '@/content/about';
import { principles, claimKinds } from '@/content/principles';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Prose } from '@/components/primitives/Prose';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why Life.Human exists, what we are trying to understand, what we believe about human beings, and what Tuṣṭi and Puṣṭi mean for this project.',
};

/**
 * Not "Our Mission / Our Vision / Our Team". Four questions a thoughtful
 * reader would actually ask, answered in the order they would ask them —
 * then the commitments, and how we mark a claim.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Life.Human is an idea before it is anything else." />

      {/* The central statement, standing alone. */}
      <section className={styles.statementWrap} aria-label="What we are trying to do">
        <Reveal>
          <div className="shell">
            <p className={styles.statement}>{aboutStatement}</p>
          </div>
        </Reveal>
      </section>

      <div className={`shell-narrow ${styles.sections}`}>
        {aboutSections.map((section) => (
          <Reveal as="section" key={section.id} className={styles.section}>
            <h2 className={styles.question} id={section.id}>
              {section.question}
            </h2>
            <Prose blocks={section.body} />
          </Reveal>
        ))}
      </div>

      {/* ── The six commitments ──────────────────────────────────────── */}
      <section
        className={styles.approach}
        data-world="history"
        data-paint=""
        aria-labelledby="approach-h"
      >
        <div className="shell">
          <Reveal>
            <Eyebrow>Our approach</Eyebrow>
            <h2 id="approach-h" className={styles.approachTitle}>
              Editorial principles
            </h2>
            <p className={styles.approachIntro}>{approachIntro}</p>
          </Reveal>

          <ul className={styles.principles}>
            {principles.map((p, i) => (
              <Reveal as="li" key={p.left} delay={i * 70}>
                <span className={styles.left}>{p.left}</span>
                <span className={styles.over}>over</span>
                <span className={styles.right}>{p.right}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The epistemic markers ────────────────────────────────────── */}
      <section className={`shell ${styles.claims}`} aria-labelledby="claims-h">
        <Reveal>
          <Eyebrow>How we mark a claim</Eyebrow>
          <h2 id="claims-h" className={styles.claimsTitle}>
            Fact, interpretation, hypothesis, question.
          </h2>
          <p className={styles.claimsIntro}>{claimIntro}</p>
        </Reveal>

        <dl className={styles.kinds}>
          {claimKinds.map((k, i) => (
            <Reveal key={k.kind} delay={i * 70}>
              <div className={styles.kind} data-kind={k.kind}>
                <dt>
                  <span className={styles.dot} aria-hidden="true" />
                  {k.label}
                </dt>
                <dd>{k.meaning}</dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <p className={styles.claimsNote}>
          We will get things wrong. When we do, we would rather it be visible
          which kind of wrong it was.
        </p>
      </section>
    </>
  );
}

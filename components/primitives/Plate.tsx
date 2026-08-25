import type { PlateVariant } from '@/content/types';
import styles from './Plate.module.css';

/**
 * Plate — the imagery layer.
 *
 * Life.Human's visual direction calls for cinematic photography. Until that
 * photography exists, these hand-drawn plates hold its place: quiet,
 * architectural, tonal, and weightless. They take their colour from whichever
 * world and pillar they sit inside, so they can never look bolted on.
 *
 * They are also the seam. When real photography arrives, this component takes
 * an `image` prop and renders <Image> instead; no caller changes.
 *
 * Shapes use `currentColor` at stepped opacities rather than gradients — it
 * reads as printed ink rather than screen glow, and it keeps every plate
 * world-aware without a single hard-coded hex.
 */

export type PlateTone = 'quiet' | 'present';

interface PlateProps {
  variant: PlateVariant;
  /** `present` lets the plate carry a section; `quiet` keeps it subliminal. */
  tone?: PlateTone;
  className?: string;
}

const shapes: Record<PlateVariant, React.ReactNode> = {
  /* Concentric apertures — the eye, the lens, the question that narrows. */
  aperture: (
    <>
      <circle cx="500" cy="470" r="360" fill="currentColor" opacity="0.05" />
      <circle cx="500" cy="470" r="268" fill="currentColor" opacity="0.06" />
      <circle cx="500" cy="470" r="182" fill="currentColor" opacity="0.08" />
      <circle cx="500" cy="470" r="104" fill="currentColor" opacity="0.13" />
      <circle cx="500" cy="470" r="360" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.32" />
      <circle cx="500" cy="470" r="182" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <path d="M60 470h880" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </>
  ),

  /* An arch — the doorway every ancient architecture arrived at. */
  arch: (
    <>
      <path
        d="M250 940V450a250 250 0 0 1 500 0v490Z"
        fill="currentColor"
        opacity="0.09"
      />
      <path
        d="M330 940V455a170 170 0 0 1 340 0v485Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M250 940V450a250 250 0 0 1 500 0v490"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.4"
      />
      <path d="M120 940h760" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M120 878h760" stroke="currentColor" strokeWidth="1" opacity="0.14" />
    </>
  ),

  /* Layered land. Distance as tone. */
  horizon: (
    <>
      <circle cx="640" cy="352" r="86" fill="currentColor" opacity="0.14" />
      <path d="M0 470h1000" stroke="currentColor" strokeWidth="1" opacity="0.26" />
      <path d="M0 560q250-70 500-16t500-34v490H0Z" fill="currentColor" opacity="0.06" />
      <path d="M0 662q210-58 430-14t570-52v404H0Z" fill="currentColor" opacity="0.08" />
      <path d="M0 772q300-76 520-24t480-40v292H0Z" fill="currentColor" opacity="0.11" />
      <path d="M0 880q260-56 500-18t500-30v168H0Z" fill="currentColor" opacity="0.16" />
    </>
  ),

  /* Ruled lines and a marked opening — a page before it is read. */
  manuscript: (
    <>
      <rect x="150" y="150" width="700" height="740" fill="currentColor" opacity="0.05" />
      <rect x="150" y="150" width="700" height="740" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      <path d="M258 150v740" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <rect x="298" y="228" width="96" height="96" fill="currentColor" opacity="0.2" />
      {[228, 276, 324].map((y) => (
        <path key={y} d={`M420 ${y}h${y === 324 ? 260 : 380}`} stroke="currentColor" strokeWidth="1" opacity="0.24" />
      ))}
      {[400, 442, 484, 526, 568, 610, 652, 694, 736].map((y, i) => (
        <path
          key={y}
          d={`M298 ${y}h${[500, 502, 470, 502, 418, 500, 486, 502, 300][i]}`}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
        />
      ))}
    </>
  ),

  /* A door with light behind it. */
  threshold: (
    <>
      <rect x="120" y="120" width="760" height="820" fill="currentColor" opacity="0.05" />
      <rect x="330" y="230" width="340" height="710" fill="currentColor" opacity="0.07" />
      <rect x="374" y="274" width="252" height="666" fill="currentColor" opacity="0.09" />
      <rect x="418" y="318" width="164" height="622" fill="currentColor" opacity="0.12" />
      <rect x="330" y="230" width="340" height="710" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
      <path d="M120 940h760" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </>
  ),

  /* Systems, revolving. Tilted rings with bodies on them. */
  orbit: (
    <g transform="rotate(-16 500 500)">
      <ellipse cx="500" cy="500" rx="400" ry="150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <ellipse cx="500" cy="500" rx="300" ry="112" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.26" />
      <ellipse cx="500" cy="500" rx="200" ry="75" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <ellipse cx="500" cy="500" rx="100" ry="37" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      <circle cx="500" cy="500" r="46" fill="currentColor" opacity="0.16" />
      <circle cx="900" cy="500" r="9" fill="currentColor" opacity="0.5" />
      <circle cx="288" cy="446" r="7" fill="currentColor" opacity="0.42" />
      <circle cx="612" cy="571" r="6" fill="currentColor" opacity="0.36" />
    </g>
  ),

  /* Flow. Nothing here is a straight line. */
  river: (
    <>
      {[
        'M-40 300q300 130 520 40t560 30',
        'M-40 400q280 150 520 46t560 40',
        'M-40 512q260 168 520 52t560 46',
        'M-40 632q240 176 520 56t560 50',
        'M-40 760q220 180 520 58t560 52',
      ].map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={i === 2 ? 1.5 : 1}
          opacity={0.16 + i * 0.06}
        />
      ))}
      <path d="M-40 512q260 168 520 52t560 46v450H-40Z" fill="currentColor" opacity="0.045" />
    </>
  ),

  /* Fluting and a capital — the institution, standing. */
  column: (
    <>
      <rect x="200" y="250" width="600" height="34" fill="currentColor" opacity="0.16" />
      <rect x="240" y="284" width="520" height="18" fill="currentColor" opacity="0.1" />
      {Array.from({ length: 9 }, (_, i) => 268 + i * 58).map((x, i) => (
        <rect
          key={x}
          x={x}
          y="302"
          width="30"
          height="600"
          fill="currentColor"
          opacity={i % 2 === 0 ? 0.11 : 0.06}
        />
      ))}
      <rect x="200" y="902" width="600" height="38" fill="currentColor" opacity="0.16" />
      <path d="M120 940h760" stroke="currentColor" strokeWidth="1" opacity="0.32" />
    </>
  ),
};

export function Plate({ variant, tone = 'present', className }: PlateProps) {
  return (
    <div
      className={[styles.plate, className].filter(Boolean).join(' ')}
      data-tone={tone}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        focusable="false"
      >
        {shapes[variant]}
      </svg>
      <span className={styles.grain} />
    </div>
  );
}

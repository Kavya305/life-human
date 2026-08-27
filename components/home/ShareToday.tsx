'use client';

import { useRef, useState } from 'react';
import styles from './ShareToday.module.css';

/**
 * Turns the day's line into a picture that can be posted to Instagram or
 * Facebook.
 *
 * Deliberately not an API integration. Posting on someone's behalf needs a
 * Meta app, business verification and app review, and even then Instagram
 * refuses text-only posts and YouTube has no API for this kind of post at
 * all. Drawing the card here and handing it to the phone's own share sheet
 * does the same job today, with nothing to approve and no access tokens to
 * keep safe.
 *
 * The card is drawn rather than photographed so it carries the publication's
 * own typography — the same serif, the same ivory, the same restraint.
 */

const W = 1080;
const H = 1350; // Instagram's portrait frame; fits Facebook and Stories too.

interface ShareTodayProps {
  line: string;
}

export function ShareToday({ line }: ShareTodayProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<'idle' | 'working' | 'saved' | 'error'>('idle');

  /** Wraps text to a width, in the font already set on the context. */
  const wrap = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  async function draw(): Promise<Blob | null> {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    /* Borrow the fonts the page is already using, rather than naming them
       again — next/font mangles the family name at build time. */
    const measured = measureRef.current
      ? getComputedStyle(measureRef.current)
      : null;
    const serif = measured?.fontFamily ?? 'Georgia, serif';
    const sans = 'Inter, system-ui, sans-serif';

    try {
      await Promise.all([
        document.fonts.load(`italic 300 84px ${serif}`),
        document.fonts.load(`500 26px ${sans}`),
      ]);
    } catch {
      /* Fall back to whatever is available rather than failing the share. */
    }

    /* Ground */
    ctx.fillStyle = '#ede7d9';
    ctx.fillRect(0, 0, W, H);

    /* A hairline frame, the one piece of ornament the system allows. */
    ctx.strokeStyle = '#b08d4f';
    ctx.lineWidth = 2;
    ctx.strokeRect(64, 64, W - 128, H - 128);

    /* Eyebrow */
    ctx.fillStyle = '#7d5f28';
    ctx.font = `500 26px ${sans}`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('TODAY I WILL', W / 2, 300);
    ctx.letterSpacing = '0px';

    /* The line itself */
    ctx.fillStyle = '#221e17';
    const size = line.length > 64 ? 72 : line.length > 42 ? 84 : 96;
    ctx.font = `italic 300 ${size}px ${serif}`;
    const lines = wrap(ctx, line, W - 280);
    const leading = size * 1.24;
    let y = H / 2 - ((lines.length - 1) * leading) / 2 - 20;
    for (const l of lines) {
      ctx.fillText(l, W / 2, y);
      y += leading;
    }

    /* Mark */
    ctx.fillStyle = '#6d6555';
    ctx.font = `500 24px ${sans}`;
    ctx.letterSpacing = '8px';
    ctx.fillText('LIFE.HUMAN', W / 2, H - 240);
    ctx.letterSpacing = '3px';
    ctx.font = `500 20px ${sans}`;
    ctx.fillText('QUESTION. THINK. CHOOSE HUMANITY.', W / 2, H - 190);
    ctx.letterSpacing = '0px';

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  }

  async function onShare() {
    setState('working');
    try {
      const blob = await draw();
      if (!blob) throw new Error('could not draw');

      const file = new File([blob], 'today-i-will.png', { type: 'image/png' });
      const caption = `Today I will ${line}`;

      /* On a phone this opens the system sheet, Instagram and Facebook
         included. Everywhere else we fall back to saving the picture. */
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: caption });
        setState('idle');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'today-i-will.png';
      a.click();
      URL.revokeObjectURL(url);

      try {
        await navigator.clipboard.writeText(caption);
      } catch {
        /* Clipboard is a convenience; the picture is the point. */
      }
      setState('saved');
    } catch (err) {
      /* Dismissing the share sheet throws AbortError — not a failure. */
      if ((err as Error)?.name === 'AbortError') setState('idle');
      else setState('error');
    }
  }

  return (
    <div className={styles.wrap}>
      {/* Never rendered visibly — it exists so the canvas can read the real
          font family the page resolved. */}
      <span ref={measureRef} className={styles.measure} aria-hidden="true">
        .
      </span>

      <button type="button" className={styles.button} onClick={onShare} disabled={state === 'working'}>
        {state === 'working' ? 'Making the card…' : 'Make a card to share'}
      </button>

      <p className={styles.note} role="status">
        {state === 'saved'
          ? 'Saved to your downloads, and the words are on your clipboard.'
          : state === 'error'
            ? 'That did not work. Try again, or take a screenshot instead.'
            : 'On a phone this opens Instagram, Facebook and the rest. On a computer it saves the picture.'}
      </p>
    </div>
  );
}

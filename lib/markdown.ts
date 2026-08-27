import type { Block, ClaimKind } from '@/content/types';

/**
 * A small, dependency-free reader for the essay body.
 *
 * The body is written as plain markdown so the CMS can offer a normal writing
 * experience, but it is parsed into the structured `Block[]` model before it
 * reaches a component — so the rendering layer never handles raw HTML and the
 * epistemic markers stay first-class rather than becoming decoration.
 *
 * Supported syntax, deliberately small:
 *
 *   ## A heading
 *   A paragraph, separated by a blank line.
 *   > A pulled quote.
 *   > — Attribution            (an em-dash line closes the quote)
 *
 *   :::fact
 *   Something checkable, with a source we will name.
 *   :::
 *
 * `:::interpretation`, `:::hypothesis`, `:::question` and `:::note` work the
 * same way; `note` becomes an editorial aside.
 */

const claimKinds: ClaimKind[] = ['fact', 'interpretation', 'hypothesis', 'question'];

const isClaim = (name: string): name is ClaimKind =>
  (claimKinds as string[]).includes(name);

export function parseEssay(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    /* ::: container — a claim, or an editorial note */
    const open = line.trim().match(/^:::\s*([a-z]+)\s*$/i);
    if (open) {
      const name = open[1].toLowerCase();
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i].trim())) {
        body.push(lines[i]);
        i++;
      }
      i++; // consume the closing :::

      const text = body.join(' ').replace(/\s+/g, ' ').trim();
      if (text) {
        if (isClaim(name)) blocks.push({ kind: 'claim', claim: name, text });
        else blocks.push({ kind: 'aside', text });
      }
      continue;
    }

    /* ## heading */
    if (/^#{2,3}\s+/.test(line)) {
      blocks.push({ kind: 'h', text: line.replace(/^#{2,3}\s+/, '').trim() });
      i++;
      continue;
    }

    /* > quote, optionally closed by an attribution line */
    if (/^>\s?/.test(line)) {
      const quoted: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      let attribution: string | undefined;
      const last = quoted[quoted.length - 1]?.trim() ?? '';
      if (/^[—–-]\s*\S/.test(last)) {
        attribution = last.replace(/^[—–-]\s*/, '').trim();
        quoted.pop();
      }
      const text = quoted.join(' ').replace(/\s+/g, ' ').trim();
      if (text) blocks.push({ kind: 'quote', text, ...(attribution ? { attribution } : {}) });
      continue;
    }

    /* paragraph — runs until a blank line or the start of another block */
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^:::/.test(lines[i].trim()) &&
      !/^#{2,3}\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    const text = para.join(' ').replace(/\s+/g, ' ').trim();
    if (text) blocks.push({ kind: 'p', text });
  }

  return blocks;
}

/** Turns `Block[]` back into the markdown above. Used by the migration. */
export function serializeEssay(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.kind) {
        case 'h':
          return `## ${b.text}`;
        case 'quote':
          return b.attribution ? `> ${b.text}\n> — ${b.attribution}` : `> ${b.text}`;
        case 'claim':
          return `:::${b.claim}\n${b.text}\n:::`;
        case 'aside':
          return `:::note\n${b.text}\n:::`;
        default:
          return b.text;
      }
    })
    .join('\n\n');
}

/**
 * Minimal YAML front matter — only the shapes this project writes: strings,
 * numbers, booleans and flat string lists. A full YAML parser would be a
 * dependency for no gain, but it does mean the CMS config must stay within
 * these types.
 */
export function parseFrontMatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };

  const data: Record<string, unknown> = {};
  const lines = match[1].split('\n');

  const scalar = (v: string): unknown => {
    const s = v.trim();
    if (!s) return '';
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    const quoted = s.match(/^(['"])([\s\S]*)\1$/);
    if (quoted) return quoted[2].replace(/\\"/g, '"');
    return s;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;

    /* inline list: [a, b] */
    if (/^\[.*\]$/.test(rest.trim())) {
      const inner = rest.trim().slice(1, -1).trim();
      data[key] = inner ? inner.split(',').map((s) => scalar(s)) : [];
      continue;
    }

    /* block list, or a nested list of objects (sources) */
    if (!rest.trim() && /^\s*-\s/.test(lines[i + 1] ?? '')) {
      const items: unknown[] = [];
      let current: Record<string, unknown> | null = null;

      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1] ?? '')) {
        const item = lines[++i];
        const start = item.match(/^\s*-\s*(.*)$/);
        if (start) {
          const first = start[1];
          const pair = first.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
          if (pair) {
            current = { [pair[1]]: scalar(pair[2]) };
            items.push(current);
          } else {
            current = null;
            items.push(scalar(first));
          }
        } else if (current) {
          const pair = item.match(/^\s*([A-Za-z0-9_]+):\s*(.*)$/);
          if (pair) current[pair[1]] = scalar(pair[2]);
        }
      }
      data[key] = items;
      continue;
    }

    data[key] = scalar(rest);
  }

  return { data, body: match[2] };
}

/** Writes the front matter this project uses. Skips empty values entirely. */
export function toFrontMatter(data: Record<string, unknown>): string {
  const q = (v: unknown) =>
    typeof v === 'string' ? `"${v.replace(/"/g, '\\"')}"` : String(v);

  const lines: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      if (!value.length) continue;
      if (typeof value[0] === 'object') {
        lines.push(`${key}:`);
        for (const item of value as Record<string, unknown>[]) {
          const entries = Object.entries(item).filter(([, v]) => v !== undefined && v !== '');
          entries.forEach(([k, v], idx) => {
            lines.push(`${idx === 0 ? '  - ' : '    '}${k}: ${q(v)}`);
          });
        }
      } else {
        lines.push(`${key}: [${(value as unknown[]).map(q).join(', ')}]`);
      }
      continue;
    }

    lines.push(`${key}: ${q(value)}`);
  }
  return lines.join('\n');
}

/** One date format across the whole publication: 14 July 2026. */
export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const formatYear = (iso: string): string => iso.slice(0, 4);

export const typeLabel: Record<string, string> = {
  film: 'Film',
  essay: 'Essay',
  short: 'Short',
  visual: 'Visual story',
};

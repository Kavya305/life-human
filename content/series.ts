import type { Series } from './types';

/**
 * Only the series that genuinely exist. The structure takes new ones by
 * appending an object — nothing is invented here to fill the page.
 */
export const series: Series[] = [
  {
    slug: 'srimad-bhagavatam',
    title: 'Śrīmad-Bhāgavatam',
    altTitle: 'A slow reading',
    pillar: 'discover',
    question: 'What does an ancient text ask of a reader who comes to it honestly?',
    description:
      'A close, unhurried reading of one of the great texts of the Indian tradition — its stories, its arguments, its strange beauty, and the places where it resists the reader. We read it as literature, as philosophy and as history, without requiring belief and without withholding respect.',
    plate: 'manuscript',
    status: 'ongoing',
  },
  {
    slug: 'education-and-competition',
    title: 'Education & Competition',
    pillar: 'question',
    question: 'What is school actually measuring?',
    description:
      'An examination of the system that shapes almost every childhood: what it was designed to produce, what it now selects for, and what happens to a young person who spends fifteen years being ranked.',
    plate: 'orbit',
    status: 'ongoing',
  },
  {
    slug: 'today-i-will',
    title: 'Today I Will',
    pillar: 'become',
    question: 'Can philosophy survive contact with an ordinary Tuesday?',
    description:
      'The smallest series. One sentence, one act, one day. Not habits, not targets, not a streak to protect — just a single human thing, offered, and yours to take or leave.',
    plate: 'horizon',
    status: 'ongoing',
  },
  {
    slug: 'to-serve',
    title: 'To Serve',
    pillar: 'become',
    question: 'What does service do to the one who serves?',
    description:
      'Almost every tradition places service near the centre of a good life, and almost every modern account of success leaves it out. We want to understand why — and what is actually happening inside a person who gives their time to someone who cannot repay them.',
    plate: 'river',
    status: 'ongoing',
  },
  {
    slug: 'life-and-time',
    title: 'Life & Time',
    pillar: 'think',
    question: 'What does time do to a person who is paying attention?',
    description:
      'On duration, patience, ageing, urgency and waste. Why the hours we remember are so rarely the hours we optimised, and what it might mean to be unhurried in a century built on speed.',
    plate: 'aperture',
    status: 'ongoing',
  },
  {
    slug: 'history-of-bharat',
    title: 'History of Bharat',
    pillar: 'understand',
    question: 'What was here before there was a name for it?',
    description:
      'A long, careful history of the subcontinent — its cities, texts, trade, empires, arguments and ruptures. Told with evidence where we have it, marked as interpretation where we do not, and without the flattening that both nostalgia and contempt impose.',
    plate: 'column',
    status: 'ongoing',
  },
  {
    slug: 'inner-beauty',
    title: 'Inner Beauty',
    pillar: 'think',
    question: 'What part of a person is visible only to other people?',
    description:
      'On character as something that shows. What we are actually responding to when we call someone beautiful in a way that has nothing to do with their face — and whether that quality can be cultivated or only revealed.',
    plate: 'threshold',
    status: 'ongoing',
  },
];

export const seriesBySlug = (slug: string): Series | undefined =>
  series.find((s) => s.slug === slug);

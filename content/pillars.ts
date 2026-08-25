import type { Pillar, PillarId } from './types';

/**
 * The five are a circle, not a list: inward, outward to the world, backward
 * in time, sideways at the present, and inward again — this time as conduct.
 */
export const pillars: Pillar[] = [
  {
    id: 'think',
    name: 'Think',
    subject: 'Life.Human Philosophy',
    numeral: 'I',
    world: 'philosophy',
    line: 'Questions about existence, purpose, character and time.',
    description:
      'The questions that do not resolve. What a life is for, what we owe each other, what happiness is when it is not pleasure, and what time does to a person who is paying attention. We are not looking for answers to hand over. We are looking for questions worth carrying.',
    plate: 'aperture',
  },
  {
    id: 'understand',
    name: 'Understand',
    subject: 'History & Society',
    numeral: 'II',
    world: 'history',
    line: 'How societies, institutions and power actually came to be.',
    description:
      'Almost everything that feels permanent was invented, recently, by people with interests. Borders, examinations, the working day, the market, the nation. Understanding how they were built is the beginning of being able to see them at all.',
    plate: 'column',
  },
  {
    id: 'discover',
    name: 'Discover',
    subject: 'Ancient Wisdom',
    numeral: 'III',
    world: 'wisdom',
    line: 'Ancient texts and worldviews, read with curiosity and honesty.',
    description:
      'Old books were written by people trying to work out how to live, in conditions we no longer share. We read them closely — for what they saw that we have forgotten, and for where they argue with themselves. Neither reverence nor dismissal is a form of reading.',
    plate: 'manuscript',
  },
  {
    id: 'question',
    name: 'Question',
    subject: 'Modern Systems',
    numeral: 'IV',
    world: 'history',
    line: 'The systems shaping how we live, and who they were built for.',
    description:
      'Education, competition, consumption, technology, medicine, work. Systems so ordinary that they have stopped looking like choices. We are not against them. We want to know what they are for, who designed them, and what they quietly cost.',
    plate: 'orbit',
  },
  {
    id: 'become',
    name: 'Become',
    subject: 'Human Development',
    numeral: 'V',
    world: 'philosophy',
    line: 'Reflection returning as conduct — character, service, practice.',
    description:
      'Thinking that never changes how you treat someone is a kind of entertainment. This is where reflection comes back down: attention, patience, honesty, service, the discipline of small things. Not self-improvement. Becoming a person others are glad to live near.',
    plate: 'horizon',
  },
];

export const pillarById = (id: PillarId): Pillar =>
  pillars.find((p) => p.id === id) ?? pillars[0];

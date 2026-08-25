import type { Block } from './types';

/**
 * The About page answers four questions, in the order a thoughtful reader
 * would ask them. It is deliberately not "Our Mission / Our Vision / Our Team".
 */

export const aboutStatement =
  'We do not want to simply help people achieve more. We want to understand what makes life worth living.';

export interface AboutSection {
  id: string;
  question: string;
  body: Block[];
}

export const aboutSections: AboutSection[] = [
  {
    id: 'why',
    question: 'Why does Life.Human exist?',
    body: [
      {
        kind: 'p',
        text: 'Because there is a great deal of information available about how to live and remarkably little help with the question of what living is for. We are told, constantly and from every direction, how to be more productive, more successful, more visible, more optimised. We are told very little about how to be content, or how to be good, or what to do with the fact that this is finite.',
      },
      {
        kind: 'p',
        text: 'Life.Human is a long-term attempt to take that second set of questions seriously. Not as inspiration, not as advice, and not as a product — as genuine enquiry, carried out slowly and in public, over years.',
      },
      {
        kind: 'p',
        text: 'It is an idea before it is anything else. If it turns out that thinking carefully about being human is worth doing, then this will have been worth building.',
      },
    ],
  },
  {
    id: 'understand',
    question: 'What are we trying to understand?',
    body: [
      {
        kind: 'p',
        text: 'One question, approached from five directions: what does it mean to be human?',
      },
      {
        kind: 'p',
        text: 'That means the inward questions — purpose, character, relationships, contentment, time. It means the outward ones — how societies, institutions, economies and power actually came to be the way they are. It means going backward, into the texts and worldviews that earlier people built to answer the same problem. It means looking sideways, at the modern systems that shape us so thoroughly that they have stopped looking like choices. And it means coming back down to the ground, where reflection either changes how you treat someone or it does not.',
      },
      {
        kind: 'p',
        text: 'These are not five subjects. They are five rooms of one house.',
      },
    ],
  },
  {
    id: 'belief',
    question: 'What do we believe about human beings?',
    body: [
      {
        kind: 'p',
        text: 'That people are more capable of depth than they are usually given credit for. Almost every system that competes for human attention assumes the opposite — that we want things shorter, louder, easier and more flattering. We think that assumption is both wrong and self-fulfilling, and we would rather find out by testing it than by repeating it.',
      },
      {
        kind: 'p',
        text: 'That most people are trying. That the person who disagrees with you usually arrived at their position through a life, not through stupidity. That this is true even when it is inconvenient, and especially when the subject is history, religion or politics.',
      },
      {
        kind: 'p',
        text: 'And that a human being is not a problem to be solved or a resource to be developed. Something in us resists that framing, and the resistance is worth listening to.',
      },
    ],
  },
  {
    id: 'tusti-pusti',
    question: 'What do Tuṣṭi and Puṣṭi mean for this project?',
    body: [
      {
        kind: 'p',
        text: 'Tuṣṭi is contentment — the capacity to be at rest in a life rather than perpetually en route to a better one. Puṣṭi is nourishment — what actually feeds a person, in the sense that a person can be well-fed and still be starving.',
      },
      {
        kind: 'p',
        text: 'They are a pair, and they need each other. Contentment without nourishment is stagnation dressed up as peace. Nourishment without contentment is appetite that never closes — more input, more input, and no point at which it is enough.',
      },
      {
        kind: 'p',
        text: 'This matters to us practically, because almost everything that competes for attention runs on the exact opposite pair: dissatisfaction and depletion. A feed works by leaving you slightly unsatisfied and slightly emptier, so that you come back. It is an efficient design, and it is why so much time can pass without anything having been fed.',
      },
      {
        kind: 'quote',
        text: 'The test we hold ourselves to: does this nourish, without creating hunger?',
      },
      {
        kind: 'p',
        text: 'That is why there are no view counts on this site, no streaks, no notifications, no infinite scroll and nothing designed to make leaving feel like a loss. If a piece of work here is worth your time, it should be able to say so by being good, and then let you go.',
      },
    ],
  },
  {
    id: 'create',
    question: 'Why do we create?',
    body: [
      {
        kind: 'p',
        text: 'Because thinking that stays private tends to stay lazy. Putting something into a form that another person can examine is the only reliable way we know of finding out whether it was ever any good.',
      },
      {
        kind: 'p',
        text: 'And because these questions are better with company. Almost nobody works out what a life is for alone. It happens in conversation, over long periods, usually with people who are willing to disagree with you carefully.',
      },
      {
        kind: 'p',
        text: 'The work is meant to accumulate. Films, essays, shorts, series — not as output, but as a body of thinking that gets more useful the longer it runs. A growing archive of human questions.',
      },
    ],
  },
];

export const approachIntro =
  'Six commitments. They are easy to write down and difficult to keep, and we would rather be held to them in public.';

export const claimIntro =
  'When we make a claim, we say what kind of claim it is. Assertion and speculation look identical on a page unless someone marks the difference — and the subjects we work on are exactly the ones where that blurring does the most damage.';

import { Threshold } from '@/components/home/Threshold';
import { Premise } from '@/components/home/Premise';
import { Pillars } from '@/components/home/Pillars';
import { FeaturedArchive } from '@/components/home/FeaturedArchive';
import { TodayIWill } from '@/components/home/TodayIWill';
import { SeriesStrip } from '@/components/home/SeriesStrip';
import { Principles } from '@/components/home/Principles';

/**
 * The homepage moves the way the project does: a question, the reason for the
 * question, the five directions it is asked from, the work itself, one small
 * thing to do today, the long enquiries, and finally what we will not do.
 */
export default function HomePage() {
  return (
    <>
      <Threshold />
      <Premise />
      <Pillars />
      <FeaturedArchive />
      <TodayIWill />
      <SeriesStrip />
      <Principles />
    </>
  );
}

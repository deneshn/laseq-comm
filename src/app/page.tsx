import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Technology from '@/components/Technology';
import DLID from '@/components/DLID';
import Marquee from '@/components/Marquee';
import DasScene from '@/components/DasScene';
import Applications from '@/components/Applications';
import WhyUs from '@/components/WhyUs';
import Team from '@/components/Team';
import Closing from '@/components/Closing';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DLID />
        <Problem />
        <Marquee />
        <Technology />
        <DasScene />
        <Applications />
        <WhyUs />
        <Team />
        <Closing />
      </main>
    </>
  );
}

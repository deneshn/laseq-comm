'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const founders = [
  {
    name: 'Dr Sarvesh Kumar',
    role: 'Co-Founder',
    initials: 'SK',
    photo: '/sarvesh.jpg.jpeg',
    linkedin: 'https://www.linkedin.com/in/sarveshkumarphd/',
    bio: 'PhD (Universidade NOVA de Lisboa) and former Postdoctoral Fellow at Lawrence Berkeley National Laboratory (LBNL), specializing in ultrafast photonics and precision optical systems. He drives LaseQ Systems\' scientific vision, translating advanced research into scalable sensing and quantum-enabled technologies.',
  },
  {
    name: 'Denesh Nallur Narasimman',
    role: 'Co-Founder',
    initials: 'DN',
    photo: '/denesh.png',
    linkedin: 'https://www.linkedin.com/in/deneshn',
    bio: 'MEng in Robotics (University of Maryland) and hardware engineer with a track record of taking unsolved sensing and systems problems from first principles to working prototypes. At LaseQ Systems, he leads commercial strategy, investor relations, and product development — bridging deep-tech R&D with real-world deployment.',
  },
  {
    name: 'Dr Tanwee Das De',
    role: 'Non-Executive Director',
    initials: 'TD',
    photo: null,
    linkedin: 'https://www.linkedin.com/in/tanwee-das-de-29b42b230/',
    bio: 'DST-Inspire Faculty at ICMR-National Institute of Virology with over 11 years of research experience. Leads LaseQ Systems\' Bio-Sensing vertical — applying distributed acoustic sensing to biological and physiological monitoring applications.',
  },
];

const advisors = [
  {
    name: 'Dr Subhadeep De',
    role: 'Technical Advisor',
    initials: 'SD',
    photo: null,
    linkedin: 'https://www.linkedin.com/in/subhadeep-de-00718b15',
    bio: 'Professor at IUCAA, Pune, with a doctorate from the University of Groningen and postdoctoral research at the Joint Quantum Institute, University of Maryland. Specialises in ultra-stable narrow-linewidth lasers and photonic quantum sensors.',
  },
];

type Member = typeof founders[0];

function TeamDisplay({ members }: { members: Member[] }) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const person = members[active];

  useEffect(() => {
    if (members.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) {
        setActive(prev => (prev + 1) % members.length);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [members.length]);

  return (
    <div
      className="relative min-h-[520px] flex flex-col"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row items-stretch flex-1 relative overflow-hidden rounded-2xl bg-[#040e1c] min-h-[480px]"
        >
          {/* Left — text */}
          <div className="relative z-10 flex flex-col justify-center px-10 py-12 md:w-1/2">
            <p className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-6">
              — {person.role}
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
              {person.name}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              {person.bio}
            </p>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-xs w-fit"
            >
              <ExternalLink size={13} />
              LinkedIn
            </a>
          </div>

          {/* Right — photo */}
          <div className="md:w-1/2 relative flex items-end justify-center md:justify-end overflow-hidden">
            {person.photo ? (
              <>
                <Image
                  src={person.photo}
                  alt={person.name}
                  width={500}
                  height={520}
                  className="object-cover object-top w-full h-full grayscale opacity-80"
                  style={{ maxHeight: '520px' }}
                />
                {/* Gradient fade from left */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#040e1c] via-[#040e1c]/40 to-transparent" />
                {/* Gradient fade from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040e1c] via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10">
                <span className="text-[180px] font-black text-cyan-400 leading-none select-none">
                  {person.initials}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails */}
      {members.length > 1 && (
        <div className="flex gap-3 mt-5">
          {members.map((m, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); paused.current = false; }}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                i === active
                  ? 'border-cyan-400 opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover grayscale"
                />
              ) : (
                <div className="w-full h-full bg-[#061428] flex items-center justify-center">
                  <span className="text-cyan-400 text-sm font-bold">{m.initials}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Founding Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            The Team
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Founding Team
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-24"
        >
          <TeamDisplay members={founders} />
        </motion.div>

        {/* Advisors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
            Advisors
          </h2>
          <p className="text-slate-400 text-base max-w-lg">
            We are assembling a world-class advisory board spanning photonics,
            defense, infrastructure, and deep tech investment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <TeamDisplay members={advisors} />
        </motion.div>

      </div>
    </section>
  );
}

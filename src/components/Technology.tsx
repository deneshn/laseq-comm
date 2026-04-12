'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
  {
    num: '01',
    title: 'Laser Pulse Injection',
    body:
      'Ultra-short coherent laser pulses are launched into a standard fiber optic cable. No hardware modifications to the cable are needed.',
  },
  {
    num: '02',
    title: 'Rayleigh Backscattering',
    body:
      'As the pulse travels, natural impurities scatter a tiny fraction of light back toward the source. This backscatter is our data — a continuous acoustic fingerprint.',
  },
  {
    num: '03',
    title: 'Phase-Sensitive Detection',
    body:
      'Our interrogation unit measures phase shifts in the returning light with picosecond precision — detecting disturbances as small as nanometer-scale fiber vibrations.',
  },
  {
    num: '04',
    title: 'AI-Powered Classification',
    body:
      'Proprietary signal processing and machine learning models classify events in real time: pipeline leaks, vehicle crossings, seismic activity, and more — with sub-meter accuracy.',
  },
];

export default function Technology() {
  return (
    <section id="technology" className="relative py-28 grid-bg">
      <div className="absolute inset-0 bg-[#020b18]/80 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Distributed Acoustic Sensing
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            DAS turns a passive fiber optic cable into thousands of virtual microphones,
            each separated by less than one meter, all monitoring simultaneously.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="gradient-border rounded-2xl bg-[#061428] p-8 flex gap-6"
            >
              <span className="text-4xl font-black text-cyan-500/20 leading-none select-none">
                {s.num}
              </span>
              <div>
                <h3 className="text-white font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sensitivity spectrum */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="gradient-border rounded-2xl bg-[#061428] p-8 mb-6"
        >
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-6">
            DAS Sensitivity Spectrum
          </p>
          <div className="relative w-full rounded-xl overflow-hidden">
            <Image
              src="/das-sensitivity.png.jpeg"
              alt="DAS sensitivity spectrum showing detectable events from Earth tides to military aircraft across frequency ranges"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-center text-xs text-slate-300 mt-4">
            Demonstrated DAS noise floor mapped against real-world acoustic event frequency ranges.
            Red-highlighted bands indicate defense-specific detection capabilities.
          </p>
        </motion.div>

        {/* Fiber diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="gradient-border rounded-2xl bg-[#061428] p-10"
        >
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-8">
            System Architecture
          </p>
          <div className="flex items-start justify-between gap-0 overflow-x-auto pb-2">
            {[
              { label: 'Interrogator Unit', sub: 'Laser + detector' },
              { label: 'Fiber Optic Cable', sub: 'Existing infrastructure' },
              { label: 'Sensing Zone', sub: '< 1m resolution' },
              { label: 'AI Processing', sub: 'Real-time classification' },
              { label: 'Dashboard', sub: 'Alerts & insights' },
            ].map((node, i, arr) => (
              <div key={node.label} className={`flex items-start min-w-0 ${i < arr.length - 1 ? 'flex-1' : 'flex-none'}`}>
                {/* Node */}
                <div className="flex flex-col items-center flex-shrink-0 w-28">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/30 border border-cyan-400/60" />
                  </div>
                  <p className="text-white text-xs font-medium leading-tight text-center">{node.label}</p>
                  <p className="text-slate-500 text-[10px] text-center mt-0.5">{node.sub}</p>
                </div>
                {/* Arrow */}
                {i < arr.length - 1 && (
                  <div className="flex-1 flex items-center mt-7 min-w-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/40 to-cyan-500/20" />
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
                      <path d="M0 5H8M8 5L4 1M8 5L4 9" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

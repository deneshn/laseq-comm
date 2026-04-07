'use client';

import { motion } from 'framer-motion';

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
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {[
              { label: 'Interrogator Unit', sub: 'Laser + detector' },
              { label: 'Fiber Optic Cable', sub: 'Existing infrastructure' },
              { label: 'Sensing Zone', sub: '< 1m resolution' },
              { label: 'AI Processing', sub: 'Real-time classification' },
              { label: 'Dashboard', sub: 'Alerts & insights' },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-2 min-w-0 flex-shrink-0">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/30 border border-cyan-400/60" />
                  </div>
                  <p className="text-white text-xs font-medium leading-tight">{node.label}</p>
                  <p className="text-slate-500 text-[10px]">{node.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex-1 flex items-center min-w-[24px]">
                    <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-cyan-500/10" />
                    <span className="text-cyan-500/40 text-xs">▶</span>
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

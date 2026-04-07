'use client';

import { motion } from 'framer-motion';
import { Cpu, FlaskConical, Globe, ShieldCheck } from 'lucide-react';

const differentiators = [
  {
    icon: FlaskConical,
    title: 'Proprietary Interrogation Hardware',
    body: 'Our interrogator unit achieves phase sensitivity and dynamic range beyond commercially available alternatives — the result of years of photonics R&D.',
  },
  {
    icon: Cpu,
    title: 'Real-Time AI Classification',
    body: 'On-edge ML models classify acoustic events with sub-second latency, distinguishing between dozens of event types without cloud round-trips.',
  },
  {
    icon: Globe,
    title: 'No New Infrastructure Required',
    body: 'LaseQ Comm works with standard single-mode fiber already in the ground. Deployment is a connection, not a construction project.',
  },
  {
    icon: ShieldCheck,
    title: 'Proven in Harsh Environments',
    body: 'Validated across temperature extremes, high-EMI zones, and subsea conditions — where conventional sensor systems fail.',
  },
];

const metrics = [
  { value: '4×', label: 'longer range than nearest competitor' },
  { value: '10×', label: 'lower deployment cost vs. point sensors' },
  { value: '<500ms', label: 'event-to-alert latency' },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,40,70,0.4),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            Our Edge
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Why LaseQ Comm
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            DAS is not new. Our technology is. We've rebuilt the stack from the
            photonics layer up to deliver performance no off-the-shelf system can match.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {differentiators.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="gradient-border rounded-2xl bg-[#061428] p-8 flex gap-6 hover:bg-[#071830] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <d.icon size={22} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-2">{d.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="gradient-border rounded-2xl bg-[#061428] px-10 py-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cyan-500/10"
        >
          {metrics.map((m) => (
            <div key={m.label} className="text-center py-4 md:py-0 md:px-8">
              <p className="text-3xl font-black text-cyan-400 mb-1">{m.value}</p>
              <p className="text-slate-400 text-sm">{m.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

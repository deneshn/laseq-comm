'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Eye, Wifi } from 'lucide-react';

const problems = [
  {
    icon: AlertTriangle,
    title: 'Critical Infrastructure is Blind',
    body:
      'Pipelines, railways, and power corridors span thousands of kilometers with little to no real-time sensing. Failures go undetected for hours — causing catastrophic damage.',
  },
  {
    icon: Eye,
    title: 'Conventional Sensors Fall Short',
    body:
      'Point sensors require enormous deployment costs, frequent maintenance, and leave massive gaps in coverage. They simply cannot scale to the size of modern infrastructure.',
  },
  {
    icon: Wifi,
    title: 'The Network Already Exists',
    body:
      'Billions of kilometers of fiber optic cable are already buried worldwide — yet they carry only light, not intelligence. The sensing network of the future is already in the ground.',
  },
];

export default function Problem() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* subtle gradient top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020b18] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            The Challenge
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            The World's Infrastructure<br />Needs Better Eyes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="gradient-border rounded-2xl bg-[#061428] p-8 hover:bg-[#071830] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <p.icon size={22} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Divider quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <p className="text-xl md:text-2xl text-slate-300 italic leading-relaxed">
            &ldquo;What if every fiber optic cable could hear a footstep, detect a leak,
            or sense a tremor — automatically?&rdquo;
          </p>
          <span className="block mt-4 text-sm text-cyan-500 font-medium tracking-wide">
            — The LaseQ Comm Vision
          </span>
        </motion.blockquote>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const apps = [
  {
    title: 'Pipeline Integrity',
    description:
      'Detect leaks, third-party intrusions, and corrosion events along oil, gas, and water pipelines — before they become disasters.',
    tag: 'Energy & Utilities',
    gradient: 'from-cyan-500/10 to-blue-600/5',
  },
  {
    title: 'Railway Monitoring',
    description:
      'Monitor track defects, unauthorized access, and structural anomalies across entire rail networks in real time.',
    tag: 'Transportation',
    gradient: 'from-blue-500/10 to-indigo-600/5',
  },
  {
    title: 'Border & Perimeter Security',
    description:
      'Deploy invisible acoustic fences across vast borders. Detect footsteps, vehicles, and tunneling activity with AI classification.',
    tag: 'Defense & Security',
    gradient: 'from-indigo-500/10 to-violet-600/5',
  },
  {
    title: 'Seismic Monitoring',
    description:
      'Turn urban fiber networks into dense seismograph arrays, providing unprecedented earthquake early warning and geological research data.',
    tag: 'Geoscience',
    gradient: 'from-violet-500/10 to-purple-600/5',
  },
  {
    title: 'Data Center Cooling',
    description:
      'Acoustic monitoring of cooling infrastructure within hyperscale data centers — detect pump failures, vibration anomalies, and inefficiencies.',
    tag: 'Cloud Infrastructure',
    gradient: 'from-purple-500/10 to-pink-600/5',
  },
  {
    title: 'Smart City Infrastructure',
    description:
      'Monitor bridges, tunnels, and underground utilities using the city\'s existing fiber network as a city-wide structural health sensor.',
    tag: 'Urban Infrastructure',
    gradient: 'from-pink-500/10 to-rose-600/5',
  },
  {
    title: 'ISR: Intelligence, Surveillance & Reconnaissance',
    description:
      'Enable persistent, wide-area acoustic intelligence across strategic corridors — detecting troop movements, vehicle convoys, and subsurface activity without deploying additional hardware.',
    tag: 'Defense & Intelligence',
    gradient: 'from-blue-500/10 to-cyan-600/5',
    center: true,
  },
];

export default function Applications() {
  return (
    <section id="applications" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            Use Cases
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            One Platform.<br />Endless Applications.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Our DAS technology addresses multi-billion dollar markets across energy,
            defense, transport, and smart city sectors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {apps.map((app, i) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`gradient-border rounded-2xl bg-gradient-to-br ${app.gradient} bg-[#061428] p-7 group hover:scale-[1.02] transition-transform duration-300 ${'center' in app && app.center ? 'md:col-start-1 lg:col-start-2' : ''}`}
            >
              <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-medium tracking-widests uppercase mb-5">
                {app.tag}
              </span>
              <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-cyan-400 transition-colors">
                {app.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{app.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

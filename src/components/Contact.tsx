'use client';

import { motion } from 'framer-motion';
import { Mail, User } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 grid-bg">
      <div className="absolute inset-0 bg-[#020b18]/85 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Investor & Partner Enquiries
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            We're currently raising our seed round and partnering with infrastructure
            operators for pilot deployments. Reach out to start the conversation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="gradient-border rounded-2xl bg-[#061428] p-8 md:p-10 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Contact</p>
              <p className="text-white font-semibold">Denesh Narasimman</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-12 bg-cyan-500/10" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Email</p>
              <a
                href="mailto:denesh2898@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                denesh2898@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

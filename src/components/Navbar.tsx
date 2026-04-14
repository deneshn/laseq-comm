'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const links = [
  { label: 'DLID', href: '#dlid' },
  { label: 'Technology', href: '#technology' },
  { label: 'Applications', href: '#applications' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#closing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#020b18]/90 backdrop-blur-md border-b border-cyan-500/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center group">
          <Image
            src="/LaseQ_Systems_Logo.png"
            alt="LaseQ Systems"
            width={200}
            height={68}
            className="h-11 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(160deg)' }}
            priority
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors tracking-wide"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#closing"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-all"
        >
          Investor Enquiry
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020b18]/95 backdrop-blur-md border-b border-cyan-500/10 overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-slate-300 hover:text-cyan-400 text-sm transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#closing"
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium border border-cyan-500/40 text-cyan-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Investor Enquiry
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

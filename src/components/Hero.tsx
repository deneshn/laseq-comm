'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function WaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const numWaves = 5;
      for (let wi = 0; wi < numWaves; wi++) {
        ctx.beginPath();
        const alpha = 0.06 + (wi / numWaves) * 0.12;
        const freq = 0.008 + wi * 0.002;
        const amp = 15 + wi * 8;
        const speed = 0.6 + wi * 0.2;
        const yOffset = h * 0.5 + (wi - numWaves / 2) * 18;

        for (let x = 0; x <= w; x += 2) {
          // DAS-like: multiple overlapping disturbances
          const y =
            yOffset +
            Math.sin(x * freq + time * speed) * amp +
            Math.sin(x * freq * 1.7 + time * (speed * 0.6) + wi) * (amp * 0.4) +
            Math.sin(x * freq * 3.1 + time * (speed * 1.3)) * (amp * 0.15);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, `rgba(0,212,255,0)`);
        gradient.addColorStop(0.2, `rgba(0,212,255,${alpha})`);
        gradient.addColorStop(0.5, `rgba(0,212,255,${alpha * 1.8})`);
        gradient.addColorStop(0.8, `rgba(0,212,255,${alpha})`);
        gradient.addColorStop(1, `rgba(0,212,255,0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = wi === numWaves - 1 ? 2 : 1;
        ctx.stroke();
      }

      // Event pulse at center
      const pulseX = w * 0.5 + Math.sin(time * 0.3) * w * 0.15;
      const pulseY = h * 0.5;
      const pulseR = 4 + Math.sin(time * 2) * 2;

      ctx.beginPath();
      ctx.arc(pulseX, pulseY, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.9)';
      ctx.fill();

      // Ripple around pulse
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, pulseR + r * 12 * (1 + Math.sin(time * 2 + r)), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,212,255,${0.15 / r})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      time += 0.025;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-70"
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Deep radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,40,70,0.6),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_80%,rgba(0,212,255,0.05),transparent)]" />

      {/* Animated waveform */}
      <div className="absolute inset-0">
        <WaveformCanvas />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-medium tracking-widest uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Deep Tech · Sensing Technology
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6"
        >
          Every Fiber{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Listens
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          LaseQ Comm transforms existing fiber optic cables into ultra-sensitive acoustic
          sensing networks — detecting threats, failures, and anomalies across hundreds of
          kilometers in real time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full bg-cyan-500 text-[#020b18] font-semibold text-sm hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)]"
          >
            Talk to Our Team
          </a>
          <a
            href="#technology"
            className="px-8 py-3.5 rounded-full border border-slate-600 text-slate-300 font-medium text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
          >
            Explore Technology →
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '100+', label: 'km sensing range' },
            { value: '<1m', label: 'spatial resolution' },
            { value: '24/7', label: 'real-time monitoring' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-slate-600 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-cyan-500/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { Mail, User } from 'lucide-react';

/**
 * FiberWeavePulseCanvas — Option 1
 *
 * A single fiber cable weaves through the "LaseQ" text.
 * A laser pulse travels along this winding path, illuminating
 * nearby text pixels as it passes — leaving a decaying glow trail.
 */
function FiberWeavePulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    type Pixel = { x: number; y: number; brightness: number };
    let textPixels: Pixel[] = [];

    // Pulse progress 0 → 1 across the canvas
    let progress = 0;
    const SPEED = 0.0025;
    const GLOW_RADIUS = 55; // px — how far the pulse illuminates

    // The fiber path: a gentle sine wave that weaves through the text zone
    const fiberY = (x: number, W: number, textCY: number) => {
      const amp   = 48;                       // weave amplitude in px
      const freq  = (4 * Math.PI) / W;        // 2 full cycles across canvas
      const phase = -Math.PI * 0.25;          // slight phase offset so it enters mid-height
      return textCY + amp * Math.sin(freq * x + phase);
    };

    // Pre-sample the path so trail rendering is cheap
    const PATH_N = 600;
    let path: { x: number; y: number }[] = [];

    const buildPath = (W: number, textCY: number) => {
      path = Array.from({ length: PATH_N }, (_, i) => {
        const x = (i / (PATH_N - 1)) * W;
        return { x, y: fiberY(x, W, textCY) };
      });
    };

    const setup = (W: number, H: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const textCY = H * 0.40;
      const fs     = Math.min(W * 0.21, H * 0.52);

      buildPath(W, textCY);

      // Extract filled text pixels for illumination
      const off  = document.createElement('canvas');
      off.width  = W;
      off.height = H;
      const oc   = off.getContext('2d')!;
      oc.font          = `900 ${fs}px Inter, system-ui, sans-serif`;
      oc.textAlign     = 'center';
      oc.textBaseline  = 'middle';
      oc.fillStyle     = '#ffffff';
      oc.fillText('LaseQ', W / 2, textCY);

      const { data } = oc.getImageData(0, 0, W, H);
      textPixels = [];
      const step = 4;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 80) {
            textPixels.push({ x, y, brightness: 0 });
          }
        }
      }

      progress = 0;
    };

    setup(canvas.offsetWidth, canvas.offsetHeight);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const textCY = H * 0.40;

      // Advance pulse
      progress += SPEED;
      if (progress > 1) progress = 0;

      // Pulse position on the path
      const pathIdx = Math.min(Math.floor(progress * PATH_N), PATH_N - 1);
      const pulseX  = path[pathIdx].x;
      const pulseY  = path[pathIdx].y;

      // Update text pixel brightnesses
      for (const p of textPixels) {
        const dx   = p.x - pulseX;
        const dy   = p.y - pulseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < GLOW_RADIUS) {
          p.brightness = Math.max(p.brightness, 1 - dist / GLOW_RADIUS);
        } else {
          p.brightness *= 0.975;
        }
      }

      // ── GHOST TEXT ───────────────────────────────────────────────
      const fs = Math.min(W * 0.21, H * 0.52);
      ctx.save();
      ctx.font         = `900 ${fs}px Inter, system-ui, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = 'rgba(0, 180, 220, 0.055)';
      ctx.fillText('LaseQ', W / 2, textCY);
      ctx.restore();

      // ── ILLUMINATED TEXT — outer glow ────────────────────────────
      ctx.save();
      ctx.shadowColor = 'rgba(0, 212, 255, 1)';
      ctx.shadowBlur  = 20;
      ctx.fillStyle   = 'rgba(0, 200, 255, 0.55)';
      for (const p of textPixels) {
        if (p.brightness < 0.025) continue;
        ctx.globalAlpha = p.brightness * 0.55;
        ctx.fillRect(p.x - 1, p.y - 1, 4, 4);
      }
      ctx.restore();

      // ── ILLUMINATED TEXT — bright core ───────────────────────────
      ctx.save();
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = 5;
      ctx.fillStyle   = '#00eaff';
      for (const p of textPixels) {
        if (p.brightness < 0.025) continue;
        ctx.globalAlpha = p.brightness;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      ctx.restore();

      // ── FIBER CABLE ──────────────────────────────────────────────
      ctx.save();
      // Soft ambient fiber
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.22)';
      ctx.lineWidth   = 2;
      ctx.shadowColor = 'rgba(0, 212, 255, 0.4)';
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      path.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
      ctx.restore();

      // Lit section of fiber behind the pulse (excited by the pulse)
      const TRAIL_FRAC = 0.12; // fraction of path that stays lit behind pulse
      const trailStart = Math.max(0, pathIdx - Math.floor(TRAIL_FRAC * PATH_N));
      if (pathIdx > trailStart) {
        ctx.save();
        const trailLen = pathIdx - trailStart;
        // Build gradient along the trail
        const t0 = path[trailStart];
        const t1 = path[pathIdx];
        const tg  = ctx.createLinearGradient(t0.x, t0.y, t1.x, t1.y);
        tg.addColorStop(0,   'rgba(0, 212, 255, 0)');
        tg.addColorStop(0.7, 'rgba(0, 212, 255, 0.5)');
        tg.addColorStop(1,   'rgba(180, 245, 255, 0.9)');
        ctx.strokeStyle = tg;
        ctx.lineWidth   = 2.5;
        ctx.shadowColor = 'rgba(0, 212, 255, 0.8)';
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        for (let i = trailStart; i <= pathIdx; i++) {
          i === trailStart ? ctx.moveTo(path[i].x, path[i].y) : ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // ── PULSE HEAD ───────────────────────────────────────────────
      ctx.save();
      const pg = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 16);
      pg.addColorStop(0,    'rgba(255, 255, 255, 1)');
      pg.addColorStop(0.2,  'rgba(140, 248, 255, 0.9)');
      pg.addColorStop(1,    'rgba(0, 212, 255, 0)');
      ctx.fillStyle   = pg;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = 26;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const onResize = () => {
      cancelAnimationFrame(animId);
      setup(canvas.offsetWidth, canvas.offsetHeight);
      animId = requestAnimationFrame(draw);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />;
}

export default function Closing() {
  return (
    <section id="closing" className="relative bg-[#010810] overflow-hidden">

      {/* Top — Let's Talk */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 border-b border-white/5">
        <p className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4">
          Get In Touch
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 leading-tight">
          Let&apos;s Talk
        </h2>

        <div className="flex flex-col sm:flex-row gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Contact</p>
              <p className="text-white font-medium">Denesh Narasimman</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Email</p>
              <a
                href="mailto:denesh2898@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                denesh2898@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — Fiber weave pulse animation */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <FiberWeavePulseCanvas />

        {/* Bottom nav + copyright */}
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-7xl mx-auto px-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            &copy; 2026 LaseQ Systems. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-600">
            <a href="#technology"   className="hover:text-cyan-400 transition-colors">Technology</a>
            <a href="#applications" className="hover:text-cyan-400 transition-colors">Applications</a>
            <a href="#team"         className="hover:text-cyan-400 transition-colors">Team</a>
            <a href="#closing"      className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>

    </section>
  );
}

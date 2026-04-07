'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Pt { x: number; y: number; }

function polyLen(pts: Pt[]) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

function ptAtDist(pts: Pt[], d: number): Pt {
  let rem = d;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (rem <= seg) {
      const t = rem / seg;
      return { x: pts[i - 1].x + dx * t, y: pts[i - 1].y + dy * t };
    }
    rem -= seg;
  }
  return pts[pts.length - 1];
}

// Pre-seeded window grid so it doesn't flicker
function buildWindows(buildings: { bx: number; bw: number; bh: number }[], seed = 42) {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  return buildings.map(b => {
    const cols = Math.max(1, Math.floor(b.bw / 7));
    const rows = Math.max(1, Math.floor(b.bh / 9));
    const grid: boolean[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => rand() > 0.45)
    );
    return grid;
  });
}

export default function DasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let bladeAngle = 0;

    // Pre-generate building layouts (ratios, resolved each frame)
    const buildingDefs = [
      { xr: 0.03, wr: 0.036, hr: 0.22 },
      { xr: 0.075, wr: 0.028, hr: 0.30 },
      { xr: 0.108, wr: 0.042, hr: 0.17 },
      { xr: 0.155, wr: 0.030, hr: 0.24 },
      { xr: 0.19, wr: 0.038, hr: 0.13 },
      { xr: 0.225, wr: 0.025, hr: 0.19 },
    ];

    // Pre-seeded windows
    const windowGrids = buildWindows(
      buildingDefs.map(b => ({ bx: 0, bw: b.wr * 1000, bh: b.hr * 400 }))
    );

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      const groundY = H * 0.56;
      const seaY = H * 0.46;
      const bedY = H * 0.82;
      const coastX = W * 0.34;

      // Fiber path waypoints
      const fiber: Pt[] = [
        { x: 0,          y: groundY - 12 },
        { x: W * 0.13,   y: groundY - 12 },  // event A
        { x: coastX - W * 0.02, y: groundY - 12 },
        { x: coastX + W * 0.04, y: seaY + H * 0.10 },
        { x: W * 0.52,   y: bedY - 8 },
        { x: W * 0.70,   y: bedY - 8 },      // event B
        { x: W * 0.81,   y: bedY - 8 },      // event C (turbine)
        { x: W,          y: bedY - 8 },
      ];

      const totalLen = polyLen(fiber);

      ctx.clearRect(0, 0, W, H);

      // ── SKY ──────────────────────────────────────────────────────────
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#010810');
      skyGrad.addColorStop(1, '#051220');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, groundY);

      // Stars
      ctx.fillStyle = 'rgba(200,220,255,0.6)';
      // Use fixed positions based on canvas size to avoid flicker
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % W);
        const sy = ((i * 97.3) % groundY * 0.7);
        const pulse = 0.3 + 0.3 * Math.sin(t * 0.5 + i);
        ctx.globalAlpha = pulse;
        ctx.fillRect(sx, sy, 1, 1);
      }
      ctx.globalAlpha = 1;

      // ── GROUND ───────────────────────────────────────────────────────
      const gGrad = ctx.createLinearGradient(0, groundY, 0, H);
      gGrad.addColorStop(0, '#0b1a10');
      gGrad.addColorStop(1, '#040c06');
      ctx.fillStyle = gGrad;
      ctx.fillRect(0, groundY, coastX, H - groundY);

      // Ground surface line glow
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(coastX, groundY);
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // ── COAST SLOPE ──────────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(coastX - W * 0.04, groundY);
      ctx.lineTo(coastX + W * 0.01, seaY);
      ctx.lineTo(coastX + W * 0.01, H);
      ctx.lineTo(coastX - W * 0.04, H);
      ctx.closePath();
      const coastGrad = ctx.createLinearGradient(coastX - W * 0.04, groundY, coastX + W * 0.01, seaY);
      coastGrad.addColorStop(0, '#0b1a10');
      coastGrad.addColorStop(1, '#031828');
      ctx.fillStyle = coastGrad;
      ctx.fill();

      // ── OCEAN ────────────────────────────────────────────────────────
      // Water body
      ctx.beginPath();
      ctx.moveTo(coastX, seaY);
      for (let x = coastX; x <= W; x += 4) {
        const wy = seaY + Math.sin(x * 0.025 + t * 1.8) * 2.5 + Math.sin(x * 0.04 + t * 1.1) * 1.5;
        ctx.lineTo(x, wy);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(coastX, H);
      ctx.closePath();
      const oceanGrad = ctx.createLinearGradient(0, seaY, 0, bedY);
      oceanGrad.addColorStop(0, '#031e3a');
      oceanGrad.addColorStop(0.6, '#021528');
      oceanGrad.addColorStop(1, '#010d1c');
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Ocean surface shimmer
      ctx.beginPath();
      ctx.moveTo(coastX, seaY);
      for (let x = coastX; x <= W; x += 4) {
        const wy = seaY + Math.sin(x * 0.025 + t * 1.8) * 2.5 + Math.sin(x * 0.04 + t * 1.1) * 1.5;
        ctx.lineTo(x, wy);
      }
      ctx.strokeStyle = 'rgba(0,180,220,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── SEABED ───────────────────────────────────────────────────────
      ctx.fillStyle = '#060f1a';
      ctx.fillRect(coastX, bedY, W - coastX, H - bedY);
      ctx.beginPath();
      ctx.moveTo(coastX, bedY);
      ctx.lineTo(W, bedY);
      ctx.strokeStyle = 'rgba(0,100,140,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── BUILDINGS ────────────────────────────────────────────────────
      buildingDefs.forEach((b, bi) => {
        const bx = W * b.xr;
        const bw = W * b.wr;
        const bh = H * b.hr;
        const by = groundY - bh;

        // Body
        const bGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
        bGrad.addColorStop(0, '#0c2030');
        bGrad.addColorStop(1, '#081525');
        ctx.fillStyle = bGrad;
        ctx.fillRect(bx, by, bw, bh);

        // Edge highlight
        ctx.fillStyle = 'rgba(0,212,255,0.06)';
        ctx.fillRect(bx, by, 1, bh);

        // Windows
        const grid = windowGrids[bi];
        const cols = grid[0].length;
        const rows = grid.length;
        const ww = Math.max(2, (bw - 4) / cols - 1);
        const wh = Math.max(2, (bh - 8) / rows - 2);
        grid.forEach((row, ri) => {
          row.forEach((lit, ci) => {
            if (!lit) return;
            const wx = bx + 2 + ci * ((bw - 4) / cols);
            const wy = by + 4 + ri * ((bh - 8) / rows);
            // Subtle flicker
            const brightness = 0.15 + 0.1 * Math.sin(t * 0.3 + bi * 2 + ri + ci);
            ctx.fillStyle = `rgba(0,212,255,${brightness})`;
            ctx.fillRect(wx, wy, ww, wh);
          });
        });
      });

      // ── POWER TOWER (between buildings and coast) ─────────────────
      const towerX = W * 0.27;
      const towerBase = groundY;
      const towerTop = groundY - H * 0.14;
      const towerW = W * 0.012;
      ctx.strokeStyle = 'rgba(40,80,120,0.7)';
      ctx.lineWidth = 1.5;
      // Main mast
      ctx.beginPath();
      ctx.moveTo(towerX, towerBase);
      ctx.lineTo(towerX, towerTop);
      ctx.stroke();
      // Cross arms
      [-1, -0.6, -0.3].forEach(frac => {
        const ay = towerBase + (towerTop - towerBase) * (1 + frac);
        const aw = towerW * (3 + Math.abs(frac) * 4);
        ctx.beginPath();
        ctx.moveTo(towerX - aw, ay);
        ctx.lineTo(towerX + aw, ay);
        ctx.stroke();
      });
      // Wires to buildings
      ctx.beginPath();
      ctx.moveTo(towerX - towerW * 8, towerTop + H * 0.01);
      ctx.quadraticCurveTo(towerX - towerW * 4, towerTop + H * 0.03, towerX, towerTop);
      ctx.strokeStyle = 'rgba(0,212,255,0.1)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // ── WIND TURBINES ────────────────────────────────────────────────
      bladeAngle += 0.007;
      [{ x: W * 0.79 }, { x: W * 0.90 }].forEach((tb, ti) => {
        const mastH = H * 0.42;
        const hubY = seaY - mastH * 0.75;
        const bladeR = H * 0.13;

        // Underwater section
        ctx.beginPath();
        ctx.moveTo(tb.x, seaY);
        ctx.lineTo(tb.x, bedY);
        ctx.strokeStyle = 'rgba(20,60,100,0.6)';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Above-water mast
        ctx.beginPath();
        ctx.moveTo(tb.x, seaY);
        ctx.lineTo(tb.x, hubY);
        ctx.strokeStyle = '#162e48';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Blades
        for (let b = 0; b < 3; b++) {
          const angle = bladeAngle * (ti % 2 === 0 ? 1 : -1) + (b * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.moveTo(tb.x, hubY);
          ctx.lineTo(tb.x + Math.cos(angle) * bladeR, hubY + Math.sin(angle) * bladeR);
          ctx.strokeStyle = 'rgba(20,55,90,0.85)';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        // Hub
        ctx.beginPath();
        ctx.arc(tb.x, hubY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#1e5080';
        ctx.fill();

        // Nacelle
        ctx.fillStyle = '#162e48';
        ctx.fillRect(tb.x - 6, hubY - 4, 12, 6);
      });

      // ── SHIPS ────────────────────────────────────────────────────────
      const shipDefs = [
        { xr: 0.47, aisOff: true,  label: 'AIS Off' },
        { xr: 0.63, aisOff: false, label: 'AIS Active' },
      ];
      shipDefs.forEach(ship => {
        const sx = W * ship.xr;
        const bob = Math.sin(sx * 0.01 + t * 0.9) * 2;
        const sy = seaY + bob;
        const sw = W * 0.07;
        const sh = H * 0.05;

        // Hull
        ctx.beginPath();
        ctx.moveTo(sx - sw * 0.5, sy + sh * 0.2);
        ctx.lineTo(sx - sw * 0.42, sy + sh);
        ctx.lineTo(sx + sw * 0.42, sy + sh);
        ctx.lineTo(sx + sw * 0.5, sy + sh * 0.2);
        ctx.closePath();
        ctx.fillStyle = ship.aisOff ? '#182030' : '#1a3050';
        ctx.fill();
        ctx.strokeStyle = ship.aisOff ? '#252e3a' : '#243f60';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Superstructure
        ctx.fillStyle = ship.aisOff ? '#202c3a' : '#1e3558';
        ctx.fillRect(sx - sw * 0.14, sy - sh * 0.65, sw * 0.28, sh * 0.85);

        // Funnel / mast
        ctx.beginPath();
        ctx.moveTo(sx + sw * 0.05, sy - sh * 0.65);
        ctx.lineTo(sx + sw * 0.05, sy - sh * 1.2);
        ctx.strokeStyle = ship.aisOff ? '#2a3545' : '#2a4060';
        ctx.lineWidth = 2;
        ctx.stroke();

        // AIS indicator light
        const indicatorColor = ship.aisOff ? '#ff4444' : '#44ff88';
        const glowColor = ship.aisOff ? 'rgba(255,68,68,' : 'rgba(68,255,136,';
        const blink = ship.aisOff ? 0.5 + 0.5 * Math.sin(t * 2.5) : 1;
        ctx.globalAlpha = blink;
        ctx.beginPath();
        ctx.arc(sx + sw * 0.05, sy - sh * 1.25, 3, 0, Math.PI * 2);
        ctx.fillStyle = indicatorColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx + sw * 0.05, sy - sh * 1.25, 8 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${glowColor}0.15)`;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ── ANCHOR (ship 1) ───────────────────────────────────────────
      const anch1X = W * 0.47 - W * 0.02;
      const anch1TopY = seaY + H * 0.06;
      const anch1BotY = bedY - H * 0.05;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(anch1X, anch1TopY);
      ctx.lineTo(anch1X, anch1BotY);
      ctx.strokeStyle = 'rgba(150,150,150,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      // Anchor symbol
      ctx.beginPath();
      ctx.arc(anch1X, anch1BotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150,150,150,0.5)';
      ctx.fill();

      // ── SATELLITE (top right) ────────────────────────────────────
      const satX = W * 0.88;
      const satY = H * 0.07;
      ctx.fillStyle = 'rgba(0,212,255,0.5)';
      ctx.fillRect(satX - 6, satY - 2, 12, 4);
      ctx.fillRect(satX - 2, satY - 6, 4, 12);
      ctx.beginPath();
      ctx.arc(satX, satY, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.8)';
      ctx.fill();
      // Dashed line from satellite to AIS-active ship
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(W * 0.635, seaY - H * 0.06);
      ctx.strokeStyle = 'rgba(68,255,136,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // ── FIBER CABLE ───────────────────────────────────────────────
      // Outer glow
      ctx.beginPath();
      ctx.moveTo(fiber[0].x, fiber[0].y);
      for (let i = 1; i < fiber.length; i++) ctx.lineTo(fiber[i].x, fiber[i].y);
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';
      ctx.stroke();
      // Mid glow
      ctx.strokeStyle = 'rgba(0,212,255,0.18)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Core
      ctx.strokeStyle = 'rgba(0,212,255,0.65)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── PULSE ─────────────────────────────────────────────────────
      const speed = totalLen * 0.16;
      const dist = (t * speed) % totalLen;
      const pPos = ptAtDist(fiber, dist);

      // Trail
      for (let i = 1; i <= 10; i++) {
        const td = Math.max(0, dist - i * 16);
        const tp = ptAtDist(fiber, td);
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${0.35 - i * 0.032})`;
        ctx.fill();
      }
      // Glow
      const pGrad = ctx.createRadialGradient(pPos.x, pPos.y, 0, pPos.x, pPos.y, 14);
      pGrad.addColorStop(0, 'rgba(0,212,255,0.7)');
      pGrad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(pPos.x, pPos.y, 14, 0, Math.PI * 2);
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(pPos.x, pPos.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // ── EVENT RIPPLES ─────────────────────────────────────────────
      const eventPts = [fiber[1], fiber[5], fiber[6]];
      eventPts.forEach((ep, ei) => {
        const phase = (t * 1.0 + ei * 1.2) % 1;
        for (let r = 0; r < 3; r++) {
          const rp = (phase + r * 0.33) % 1;
          const radius = rp * 24;
          const alpha = (1 - rp) * 0.45;
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        // Dot
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.2)';
        ctx.fill();
      });

      // ── INTERROGATOR BOX ──────────────────────────────────────────
      const bw = Math.max(44, W * 0.055);
      const bh = Math.max(30, H * 0.10);
      const bx = 4;
      const by2 = groundY - 12 - bh - 4;
      ctx.fillStyle = '#061428';
      ctx.strokeStyle = 'rgba(0,212,255,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by2, bw, bh, 5);
      ctx.fill();
      ctx.stroke();
      // Blinking LED
      ctx.beginPath();
      ctx.arc(bx + bw - 8, by2 + 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${0.5 + 0.5 * Math.sin(t * 4)})`;
      ctx.fill();
      // Label
      ctx.fillStyle = 'rgba(0,212,255,0.85)';
      ctx.font = `bold ${Math.max(8, W * 0.009)}px Inter,sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('IQ UNIT', bx + bw / 2, by2 + bh * 0.48);
      ctx.fillStyle = 'rgba(0,212,255,0.45)';
      ctx.font = `${Math.max(6, W * 0.007)}px Inter,sans-serif`;
      ctx.fillText('Interrogator', bx + bw / 2, by2 + bh * 0.75);
      ctx.textAlign = 'left';

      t += 0.014;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-400 mb-4 block">
            Live Monitoring
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            From City to Seabed —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              One Fiber Network
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base mt-4">
            A single continuous fiber cable becomes a live sensing network across
            terrestrial, coastal, and offshore environments simultaneously.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative gradient-border rounded-2xl overflow-hidden"
          style={{ aspectRatio: '16 / 5' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            aria-label="Animated DAS monitoring cross-section: terrestrial infrastructure, ocean, and offshore wind"
          />

          {/* Zone labels */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-3 left-[4%] text-[10px] text-slate-500 uppercase tracking-widest">
              Terrestrial
            </div>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 uppercase tracking-widest">
              Subsea
            </div>
            <div className="absolute top-3 right-[3%] text-[10px] text-slate-500 uppercase tracking-widest">
              Offshore
            </div>

            {/* Event callouts */}
            <div className="absolute text-[9px] leading-tight" style={{ left: '10%', top: '50%' }}>
              <span className="text-cyan-400/80 font-medium">Third-party intrusion</span>
            </div>
            <div className="absolute text-[9px] leading-tight text-center" style={{ left: '66%', bottom: '14%' }}>
              <span className="text-cyan-400/80 font-medium">Anchor drag</span>
            </div>
            <div className="absolute text-[9px] leading-tight text-center" style={{ left: '78%', bottom: '14%' }}>
              <span className="text-cyan-400/80 font-medium">Cable strumming</span>
            </div>

            {/* Ship labels */}
            <div className="absolute text-[8px] text-red-400/70 font-medium" style={{ left: '42%', top: '28%' }}>
              AIS Off
            </div>
            <div className="absolute text-[8px] text-green-400/70 font-medium" style={{ left: '61%', top: '28%' }}>
              AIS Active
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-px bg-cyan-400/65" />
            <span>Fiber optic cable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
            <span>Laser pulse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Detection event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span>Vessel — AIS off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span>Vessel — AIS active</span>
          </div>
        </div>
      </div>
    </section>
  );
}

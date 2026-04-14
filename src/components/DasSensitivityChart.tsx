'use client';

import { useEffect, useRef, useState } from 'react';

// SVG coordinate → frequency (Hz)
// x in [0, 780], viewBox x-axis maps log10(f) from -4 to +3
const xToFreq = (x: number) => Math.pow(10, -4 + (x / 780) * 7);

// SVG coordinate → noise floor (Hz/√Hz)
// y in [200, 500], maps log10(n) from -1 to -3
const yToNoise = (y: number) => Math.pow(10, -1 - ((y - 200) / 300) * 2);

function formatSci(val: number) {
  const exp = Math.floor(Math.log10(val));
  const coeff = val / Math.pow(10, exp);
  return `${coeff.toFixed(2)}×10${exp < 0 ? '⁻' : ''}${String(Math.abs(exp)).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('')}`;
}

export default function DasSensitivityChart() {
  const svgRef    = useRef<SVGSVGElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered]   = useState(false);
  const [cursor, setCursor]     = useState<{ svgX: number; svgY: number } | null>(null);

  // Band / label tooltips
  useEffect(() => {
    const tip = document.getElementById('das-tip');
    if (!tip || !svgRef.current) return;
    const els = svgRef.current.querySelectorAll<SVGElement>('.lbl, .band');
    const onEnter = (e: Event) => {
      const el = e.currentTarget as SVGElement;
      tip.innerHTML = `<b>${el.dataset.n}</b><br/>${el.dataset.f}`;
      tip.classList.add('on');
    };
    const onMove  = (e: Event) => {
      const me = e as MouseEvent;
      tip.style.left = me.clientX + 14 + 'px';
      tip.style.top  = me.clientY - 12 + 'px';
    };
    const onLeave = () => tip.classList.remove('on');
    els.forEach(el => {
      el.style.cursor = 'crosshair';
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mousemove',  onMove);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => els.forEach(el => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseleave', onLeave);
    });
  }, []);

  // Mouse tracking for crosshair + value overlay
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg  = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // Convert to SVG viewBox coordinates (viewBox = 0 0 1000 620)
    const svgX = ((e.clientX - rect.left) / rect.width)  * 1000;
    const svgY = ((e.clientY - rect.top)  / rect.height) * 620;
    // Only show crosshair inside the chart plot area
    if (svgX >= 0 && svgX <= 780 && svgY >= 200 && svgY <= 500) {
      setCursor({ svgX, svgY });
    } else {
      setCursor(null);
    }
  };

  const freq  = cursor ? xToFreq(cursor.svgX)  : null;
  const noise = cursor ? yToNoise(cursor.svgY) : null;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCursor(null); }}
      style={{
        background: '#0A1628',
        padding: '36px 24px 44px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        transition: 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1)',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        transformOrigin: 'top center',
        cursor: 'crosshair',
      }}
    >
      {/* Tooltip for band labels */}
      <div id="das-tip" style={{
        position: 'fixed', background: '#0D1E3A',
        border: '1px solid #00C9B1', padding: '7px 11px',
        borderRadius: '3px', fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px', color: '#E8E6E0', pointerEvents: 'none',
        opacity: 0, transition: 'opacity .12s', zIndex: 999,
        whiteSpace: 'nowrap', lineHeight: 1.7,
      }} className="das-tip" />
      <style>{`#das-tip.on { opacity: 1 !important; } #das-tip b { color: #00C9B1; }`}</style>

      {/* Eyebrow */}
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#00C9B1', marginBottom: '6px' }}>
        DAS Sensitivity Spectrum
      </div>
      <div style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 600, color: '#E8E6E0', marginBottom: '4px' }}>
        Sensing any other sound waves
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(232,230,224,0.45)', marginBottom: '36px', letterSpacing: '0.5px' }}>
        Demonstrated DAS noise floor · ΔL ∝ f⁻¹
      </div>

      {/* Defence note */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '1px',
        color: 'rgba(255,100,100,0.85)', background: 'rgba(255,60,60,0.08)',
        border: '1px solid rgba(255,60,60,0.2)', padding: '5px 12px',
        borderRadius: '2px', marginBottom: '28px',
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(255,60,60,0.8)', flexShrink: 0, display: 'inline-block' }} />
        &quot;RED&quot; highlighted are specific to the Defense applications
      </div>

      {/* Value readout — only when hovering over plot area */}
      {cursor && freq !== null && noise !== null && (
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
          color: '#00C9B1', marginBottom: '8px', letterSpacing: '0.5px',
          minHeight: '18px',
        }}>
          f = {formatSci(freq)} Hz &nbsp;·&nbsp; noise = {formatSci(noise)} Hz/√Hz
        </div>
      )}
      {!cursor && (
        <div style={{ minHeight: '18px', marginBottom: '8px' }} />
      )}

      {/* Chart */}
      <div style={{ background: '#0D1E3A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '20px 20px 30px 68px', position: 'relative', overflow: 'visible' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 1000 620"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursor(null)}
        >
          <defs>
            <clipPath id="cp"><rect x="0" y="200" width="780" height="300"/></clipPath>
            <clipPath id="cpFull"><rect x="0" y="0" width="780" height="500"/></clipPath>
            <filter id="glow" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(180,100,255,0.38)"/>
              <stop offset="100%" stopColor="rgba(140,60,220,0.22)"/>
            </linearGradient>
            <linearGradient id="gPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,80,160,0.35)"/>
              <stop offset="100%" stopColor="rgba(200,50,120,0.20)"/>
            </linearGradient>
            <linearGradient id="gAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,180,30,0.38)"/>
              <stop offset="100%" stopColor="rgba(220,130,20,0.22)"/>
            </linearGradient>
            <linearGradient id="gLime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(150,240,80,0.35)"/>
              <stop offset="100%" stopColor="rgba(100,200,50,0.20)"/>
            </linearGradient>
            <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(40,220,200,0.35)"/>
              <stop offset="100%" stopColor="rgba(20,180,160,0.20)"/>
            </linearGradient>
            <linearGradient id="gDef" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,70,70,0.42)"/>
              <stop offset="100%" stopColor="rgba(200,40,40,0.22)"/>
            </linearGradient>
          </defs>

          {/* Background frequency bands */}
          <rect x="0" y="200" width="223" height="300" fill="url(#gPurple)" className="band" data-n="Earth Tide" data-f="0.0001–0.01 Hz" clipPath="url(#cp)"/>
          <rect x="162" y="200" width="88" height="300" fill="url(#gPink)" className="band" data-n="Tsunami / Ocean Wave" data-f="0.005–0.3 Hz" clipPath="url(#cp)"/>
          <rect x="223" y="200" width="334" height="300" fill="url(#gAmber)" className="band" data-n="Micro Seismic / Volcanic Tremor" data-f="0.05–10 Hz" clipPath="url(#cp)"/>
          <rect x="385" y="200" width="217" height="300" fill="url(#gLime)" className="band" data-n="Traffic Noise / Micro Earthquakes" data-f="0.6–37 Hz" clipPath="url(#cp)"/>
          <rect x="557" y="200" width="223" height="300" fill="url(#gCyan)" className="band" data-n="Hydraulic Fracture / High Frequency" data-f="10–1000 Hz" clipPath="url(#cp)"/>

          {/* Grid */}
          <g stroke="rgba(255,255,255,0.07)" strokeWidth="0.7">
            <line x1="0" y1="200" x2="780" y2="200"/><line x1="0" y1="350" x2="780" y2="350"/><line x1="0" y1="500" x2="780" y2="500"/>
          </g>
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5">
            <line x1="0" y1="247" x2="780" y2="247"/><line x1="0" y1="295" x2="780" y2="295"/><line x1="0" y1="397" x2="780" y2="397"/><line x1="0" y1="447" x2="780" y2="447"/>
          </g>
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.6">
            <line x1="111" y1="0" x2="111" y2="500"/><line x1="223" y1="0" x2="223" y2="500"/><line x1="334" y1="0" x2="334" y2="500"/><line x1="446" y1="0" x2="446" y2="500"/><line x1="557" y1="0" x2="557" y2="500"/><line x1="669" y1="0" x2="669" y2="500"/><line x1="780" y1="0" x2="780" y2="500"/>
          </g>
          <rect x="0" y="200" width="780" height="300" fill="none" stroke="rgba(0,201,177,0.25)" strokeWidth="1" rx="1"/>

          {/* Band label bars */}
          <rect x="557" y="8" width="223" height="20" rx="2" fill="url(#gDef)" stroke="rgba(255,80,80,0.6)" strokeWidth="0.8" className="lbl" data-n="Military Aircraft" data-f="10–2000 Hz"/>
          <text x="668" y="22" fontFamily="IBM Plex Mono,monospace" fontSize="9" fill="rgba(255,160,160,0.95)" textAnchor="middle">Military Aircraft (10-2000 Hz)</text>
          <rect x="223" y="32" width="502" height="20" rx="2" fill="url(#gDef)" stroke="rgba(255,80,80,0.55)" strokeWidth="0.8" className="lbl" data-n="Nuclear Test" data-f="0.01–100 Hz"/>
          <text x="474" y="46" fontFamily="IBM Plex Mono,monospace" fontSize="9" fill="rgba(255,160,160,0.95)" textAnchor="middle">Nuclear Test (0.01-100 Hz)</text>
          <rect x="334" y="56" width="402" height="20" rx="2" fill="url(#gDef)" stroke="rgba(255,80,80,0.55)" strokeWidth="0.8" className="lbl" data-n="Supersonic Aircraft" data-f="0.1–200 Hz"/>
          <text x="535" y="70" fontFamily="IBM Plex Mono,monospace" fontSize="9" fill="rgba(255,160,160,0.95)" textAnchor="middle">Supersonic Aircraft (0.1-200 Hz)</text>
          <rect x="446" y="80" width="334" height="20" rx="2" fill="url(#gDef)" stroke="rgba(255,80,80,0.60)" strokeWidth="0.8" className="lbl" data-n="Submarine" data-f="1–2000 Hz"/>
          <text x="613" y="94" fontFamily="IBM Plex Mono,monospace" fontSize="9" fill="rgba(255,160,160,0.95)" textAnchor="middle">Submarine (1-2000 Hz)</text>
          <rect x="273" y="104" width="112" height="20" rx="2" fill="rgba(255,180,30,0.28)" stroke="rgba(255,200,60,0.5)" strokeWidth="0.8" className="lbl" data-n="Micro Seismic" data-f="0.05–0.5 Hz"/>
          <text x="329" y="118" fontFamily="IBM Plex Mono,monospace" fontSize="8.5" fill="rgba(255,220,100,0.9)" textAnchor="middle">Micro Seismic (0.05-0.5 Hz)</text>
          <rect x="397" y="104" width="206" height="20" rx="2" fill="rgba(120,220,80,0.28)" stroke="rgba(160,240,80,0.5)" strokeWidth="0.8" className="lbl" data-n="Traffic Noise" data-f="0.6–37 Hz"/>
          <text x="500" y="118" fontFamily="IBM Plex Mono,monospace" fontSize="8.5" fill="rgba(180,255,120,0.9)" textAnchor="middle">Traffic Noise (0.6-37 Hz)</text>
          <rect x="334" y="128" width="223" height="20" rx="2" fill="rgba(255,120,40,0.28)" stroke="rgba(255,150,60,0.5)" strokeWidth="0.8" className="lbl" data-n="Volcanic Tremor" data-f="0.1–10 Hz"/>
          <text x="445" y="142" fontFamily="IBM Plex Mono,monospace" fontSize="8.5" fill="rgba(255,180,100,0.9)" textAnchor="middle">Volcanic Tremor (0.1-10 Hz)</text>
          <rect x="557" y="128" width="223" height="20" rx="2" fill="rgba(40,210,180,0.28)" stroke="rgba(60,230,200,0.5)" strokeWidth="0.8" className="lbl" data-n="Hydraulic Fracture" data-f="10–1000 Hz"/>
          <text x="668" y="142" fontFamily="IBM Plex Mono,monospace" fontSize="8.5" fill="rgba(100,240,220,0.9)" textAnchor="middle">Hydraulic Fracture (10-1000 Hz)</text>
          <rect x="162" y="152" width="62" height="20" rx="2" fill="rgba(80,160,255,0.28)" stroke="rgba(100,180,255,0.5)" strokeWidth="0.8" className="lbl" data-n="Tsunami" data-f="0.005–0.03 Hz"/>
          <text x="193" y="166" fontFamily="IBM Plex Mono,monospace" fontSize="7.5" fill="rgba(140,200,255,0.9)" textAnchor="middle">Tsunami (0.005-0.03Hz)</text>
          <rect x="273" y="152" width="84" height="20" rx="2" fill="rgba(60,180,255,0.28)" stroke="rgba(80,200,255,0.5)" strokeWidth="0.8" className="lbl" data-n="Ocean Wave" data-f="0.05–0.3 Hz"/>
          <text x="315" y="166" fontFamily="IBM Plex Mono,monospace" fontSize="7.5" fill="rgba(120,210,255,0.9)" textAnchor="middle">Ocean wave (0.05-0.3Hz)</text>
          <rect x="446" y="152" width="134" height="20" rx="2" fill="url(#gDef)" stroke="rgba(255,80,80,0.6)" strokeWidth="0.8" className="lbl" data-n="Micro Earth Quakes" data-f="1–20 Hz"/>
          <text x="513" y="166" fontFamily="IBM Plex Mono,monospace" fontSize="7.5" fill="rgba(255,160,160,0.95)" textAnchor="middle">Micro Earth Quakes (1-20 Hz)</text>
          <rect x="810" y="152" width="60" height="20" rx="2" fill="url(#gDef)" stroke="rgba(255,80,80,0.65)" strokeWidth="0.8" className="lbl" data-n="Military Tanks" data-f="14–16 Hz"/>
          <text x="840" y="166" fontFamily="IBM Plex Mono,monospace" fontSize="7.5" fill="rgba(255,160,160,0.95)" textAnchor="middle">Military Tanks (14-16 Hz)</text>
          <rect x="0" y="176" width="223" height="20" rx="2" fill="rgba(160,80,240,0.28)" stroke="rgba(180,100,255,0.45)" strokeWidth="0.8" className="lbl" data-n="Earth Tide" data-f="0.0001–0.01 Hz"/>
          <text x="111" y="190" fontFamily="IBM Plex Mono,monospace" fontSize="8.5" fill="rgba(200,150,255,0.9)" textAnchor="middle">Earth Tide (0.0001-0.01 Hz)</text>
          <rect x="223" y="176" width="334" height="20" rx="2" fill="rgba(80,200,120,0.25)" stroke="rgba(100,220,140,0.45)" strokeWidth="0.8" className="lbl" data-n="Large Earth Quakes" data-f="0.01–10 Hz"/>
          <text x="390" y="190" fontFamily="IBM Plex Mono,monospace" fontSize="8.5" fill="rgba(140,240,180,0.9)" textAnchor="middle">Large Earth Quakes (0.01-10 Hz)</text>

          {/* DAS noise floor curve — glow */}
          <path d="M 0,212 C 10,213 20,214 30,216 C 40,218 50,220 60,223 C 70,226 80,230 90,240 C 105,258 115,278 130,300 C 145,320 158,338 172,355 C 186,370 200,383 216,394 C 230,403 244,410 260,416 C 276,421 292,424 310,427 C 328,429 346,430 365,431 C 384,432 402,432 420,432 C 436,432 448,432 460,430 C 472,429 478,427 484,424 C 490,421 494,419 498,420 C 504,421 510,424 516,426 C 522,428 530,430 540,431 C 552,432 562,432 575,432 C 590,433 610,433 630,434 C 652,435 672,435 694,436 C 716,436 740,437 760,437 C 770,437 776,437 780,437"
            fill="none" stroke="rgba(0,201,177,0.22)" strokeWidth="10" strokeLinecap="round" filter="url(#glow)" clipPath="url(#cp)"/>
          {/* Main curve */}
          <path d="M 0,212 C 10,213 20,214 30,216 C 40,218 50,220 60,223 C 70,226 80,230 90,240 C 105,258 115,278 130,300 C 145,320 158,338 172,355 C 186,370 200,383 216,394 C 230,403 244,410 260,416 C 276,421 292,424 310,427 C 328,429 346,430 365,431 C 384,432 402,432 420,432 C 436,432 448,432 460,430 C 472,429 478,427 484,424 C 490,421 494,419 498,420 C 504,421 510,424 516,426 C 522,428 530,430 540,431 C 552,432 562,432 575,432 C 590,433 610,433 630,434 C 652,435 672,435 694,436 C 716,436 740,437 760,437 C 770,437 776,437 780,437"
            fill="none" stroke="#00C9B1" strokeWidth="2.4" strokeLinecap="round" clipPath="url(#cp)"/>

          {/* Annotation — inline label with background pill */}
          <rect x="198" y="452" width="384" height="32" rx="4"
            fill="rgba(10,22,40,0.82)" stroke="rgba(0,201,177,0.25)" strokeWidth="0.8"/>
          <text x="390" y="473" textAnchor="middle" clipPath="url(#cp)">
            <tspan fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="500" fill="rgba(232,230,224,0.8)">Demonstrated </tspan>
            <tspan fontFamily="IBM Plex Mono, monospace" fontSize="13" fontWeight="700" fill="#00C9B1">DAS</tspan>
            <tspan fontFamily="IBM Plex Sans, sans-serif" fontSize="13" fontWeight="400" fill="rgba(232,230,224,0.8)"> sensitivity  </tspan>
            <tspan fontFamily="IBM Plex Mono, monospace" fontSize="13" fontStyle="italic" fill="rgba(232,230,224,0.55)">ΔL ∝ f</tspan>
            <tspan fontFamily="IBM Plex Mono, monospace" fontSize="9" dy="-5" fill="rgba(232,230,224,0.55)">−1</tspan>
          </text>

          {/* Crosshair — only when cursor is in plot area */}
          {cursor && (
            <>
              <line x1={cursor.svgX} y1="200" x2={cursor.svgX} y2="500"
                stroke="rgba(0,201,177,0.5)" strokeWidth="0.8" strokeDasharray="4 3"/>
              <line x1="0" y1={cursor.svgY} x2="780" y2={cursor.svgY}
                stroke="rgba(0,201,177,0.5)" strokeWidth="0.8" strokeDasharray="4 3"/>
              <circle cx={cursor.svgX} cy={cursor.svgY} r="4"
                fill="#00C9B1" opacity="0.9"/>
              <circle cx={cursor.svgX} cy={cursor.svgY} r="8"
                fill="none" stroke="#00C9B1" strokeWidth="1" opacity="0.4"/>
            </>
          )}

          {/* Y axis */}
          <g fontFamily="IBM Plex Mono,monospace" fontSize="11" fill="rgba(232,230,224,0.55)" textAnchor="end">
            <text x="-8" y="204">10⁻¹</text>
            <text x="-8" y="354">10⁻²</text>
            <text x="-8" y="504">10⁻³</text>
          </g>
          <text x="-46" y="350" fontFamily="IBM Plex Mono,monospace" fontSize="10" fill="rgba(232,230,224,0.35)" textAnchor="middle" transform="rotate(-90,-46,350)">Noise Floor [Hz/√Hz]</text>
          <g stroke="rgba(232,230,224,0.2)" strokeWidth="1">
            <line x1="-8" y1="200" x2="0" y2="200"/><line x1="-8" y1="350" x2="0" y2="350"/><line x1="-8" y1="500" x2="0" y2="500"/>
          </g>

          {/* X axis */}
          <g fontFamily="IBM Plex Mono,monospace" fontSize="11" fill="rgba(232,230,224,0.55)" textAnchor="middle">
            <text x="0"   y="520">10⁻⁴</text><text x="111" y="520">10⁻³</text><text x="223" y="520">10⁻²</text>
            <text x="334" y="520">10⁻¹</text><text x="446" y="520">10⁰</text><text x="557" y="520">10¹</text>
            <text x="669" y="520">10²</text><text x="780" y="520">10³</text>
          </g>
          <text x="390" y="545" fontFamily="IBM Plex Mono,monospace" fontSize="11" fill="rgba(232,230,224,0.4)" textAnchor="middle">Frequency [Hz]</text>
          <g stroke="rgba(232,230,224,0.2)" strokeWidth="1">
            <line x1="0"   y1="500" x2="0"   y2="508"/><line x1="111" y1="500" x2="111" y2="508"/>
            <line x1="223" y1="500" x2="223" y2="508"/><line x1="334" y1="500" x2="334" y2="508"/>
            <line x1="446" y1="500" x2="446" y2="508"/><line x1="557" y1="500" x2="557" y2="508"/>
            <line x1="669" y1="500" x2="669" y2="508"/><line x1="780" y1="500" x2="780" y2="508"/>
          </g>
        </svg>
      </div>

      {/* Caption */}
      <p style={{ marginTop: '18px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', color: 'rgba(232,230,224,0.45)', textAlign: 'center', lineHeight: 1.7, letterSpacing: '0.3px' }}>
        Demonstrated DAS noise floor mapped against real-world acoustic event frequency ranges.<br/>
        <span style={{ color: 'rgba(255,90,90,0.85)' }}>&quot;RED&quot; highlighted bands indicate defense-specific detection capabilities.</span>
      </p>
    </div>
  );
}

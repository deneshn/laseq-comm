export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#020b18]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 text-xs font-bold">LQ</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            LaseQ <span className="text-cyan-400">Comm</span>
          </span>
        </div>

        <p className="text-slate-500 text-xs text-center">
          &copy; {new Date().getFullYear()} LaseQ Comm. All rights reserved.
        </p>

        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#technology" className="hover:text-cyan-400 transition-colors">Technology</a>
          <a href="#applications" className="hover:text-cyan-400 transition-colors">Applications</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

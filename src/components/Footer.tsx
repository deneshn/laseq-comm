import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-[#020b18]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Image
            src="/LaseQ_Systems_Logo.png"
            alt="LaseQ Systems"
            width={100}
            height={34}
            className="h-8 w-auto object-contain mix-blend-screen"
          />
        </div>

        <p className="text-slate-500 text-xs text-center">
          &copy; 2026 LaseQ Systems. All rights reserved.
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

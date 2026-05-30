import React from "react";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer id="global-footer" className="border-t border-slate-800/80 bg-[#070709]/70 pt-16 pb-12 mt-auto transition-colors relative z-10 w-full min-h-[25vh] flex flex-col justify-between text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 pb-10 border-b border-slate-800/50">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-900 shadow-md">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
            </div>
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              MelAgent
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
            The premier hyper-connected software workspace for independent software talent and autonomous buyer connections.
          </p>
        </div>

        {/* Directory Listings Col */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Solutions Hub
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-semibold">
            <a href="#" className="hover:text-white transition">Agent Escrows</a>
            <a href="#" className="hover:text-white transition">Autonomous Contracts</a>
            <a href="#" className="hover:text-white transition">Talent Directories</a>
          </div>
        </div>

        {/* Guidelines Col */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-505">
            Platform Rules
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-semibold">
            <a href="#" className="hover:text-white transition">Privacy Guideline</a>
            <a href="#" className="hover:text-white transition">Arbitration Escrow</a>
            <a href="#" className="hover:text-white transition">Security Controls</a>
          </div>
        </div>

        {/* Contact Col */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Inquire Support
          </h4>
          <div className="flex flex-col gap-2 text-xs text-slate-400 font-medium">
            <span className="text-xs text-slate-500">Direct Contact Mail:</span>
            <a 
              href="mailto:mcbandara000@gmail.com" 
              className="text-indigo-400 font-bold hover:underline transition truncate"
            >
              mcbandara000@gmail.com
            </a>
            <span className="text-[10px] text-slate-500">Response turnaround &lt; 24h</span>
          </div>
        </div>

      </div>

      {/* Bottom row: copyright & credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center md:justify-start">
          <span>© 2026 MelAgents. All Rights Reserved.</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-800" />
          <span className="text-white">Creation by Melagents AI Solutions</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300">Terms</a>
          <a href="#" className="hover:text-slate-300">Privacy</a>
          <a href="#" className="hover:text-slate-300">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

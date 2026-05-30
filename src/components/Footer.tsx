import React from "react";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer 
      id="global-footer" 
      className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#09090b] pt-16 pb-12 mt-auto transition-all duration-200 relative z-10 w-full min-h-[25vh] flex flex-col justify-between text-slate-600 dark:text-slate-350"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 pb-10 border-b border-slate-200/50 dark:border-slate-800/50">
        
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-md">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              MelAgent
            </span>
          </div>
        </div>

        {/* Directory Listings Col */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            Solutions Hub
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Agent Escrows</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Autonomous Contracts</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Talent Directories</a>
          </div>
        </div>

        {/* Platform Rules Col */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            Platform Rules
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Guideline</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Arbitration Escrow</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Security Controls</a>
          </div>
        </div>

        {/* Contact Col */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            Inquire Support
          </h4>
          <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <span className="text-xs text-slate-400 dark:text-slate-500">Direct Contact Mail:</span>
            <a 
              href="mailto:mcbandara000@gmail.com" 
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition truncate"
            >
              mcbandara000@gmail.com
            </a>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Response turnaround &lt; 24h</span>
          </div>
        </div>

      </div>

      {/* Bottom row: copyright & credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center md:justify-start">
          <span>© 2026 MelAgents. All Rights Reserved.</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
          <span className="text-slate-900 dark:text-slate-200">Creation by Melagents AI Solutions</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, ShieldAlert, Sparkles, ArrowRight, Eye, EyeOff, Bot, LockKeyhole } from "lucide-react";
import { motion } from "motion/react";

export function AdminAuthScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !password.trim()) {
      setErrorMsg("All credentials are required.");
      setLoading(false);
      return;
    }

    try {
      // Execute login passing true for isAdminForm
      const result = await login(cleanEmail, password, true);
      if (!result.success) {
        setErrorMsg(result.message || "Invalid administrator credentials.");
      } else {
        // Redirect or state update triggers automatically
        window.location.hash = ""; // Clean hash if any
      }
    } catch (err) {
      setErrorMsg("An unexpected connection issue occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-[#07070a] text-[#f8fafc] font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Immersive Cosmic background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

      {/* Glassmorphic border container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
        className="w-full max-w-[460px] px-4"
      >
        <div className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl relative">
          
          {/* Subtle Accent Glow Border top */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent rounded-t-3xl" />

          {/* Secure Logo Shield */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-400">
              <LockKeyhole className="w-6 h-6 animate-pulse" />
            </div>
            
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-display">
              Administrative Control Hub
            </h1>
            <p className="text-xs text-slate-400 mt-2 font-medium font-mono tracking-wider uppercase">
              Secure Terminal &bull; Layer v2
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin Email field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 font-mono uppercase tracking-widest">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@melagents.com"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 text-white py-3 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none placeholder:text-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Admin Password field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 font-mono uppercase tracking-widest">
                Secure Password Key
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 text-white py-3 pl-10 pr-10 text-sm transition-all focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none placeholder:text-slate-600 disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error messaging panel */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-rose-400 text-xs font-semibold bg-rose-950/20 rounded-xl p-3 border border-rose-900/40 flex items-start gap-2.5"
              >
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-450" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Submit Control Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white hover:bg-slate-200 py-3.5 text-center text-sm font-extrabold text-[#09090b] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? "Decrypting Node..." : "Verify Administrator Credentials"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Secure notice info */}
          <div className="mt-6 flex items-center justify-center gap-1 text-[11px] text-slate-500 font-mono">
            <span>&bull;</span>
            <span>RESTRICTED FOR AUTHORIZED REPRESENTATIVES ONLY</span>
            <span>&bull;</span>
          </div>
        </div>

        {/* Back Link to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200"
          >
            &larr; Return to main marketplace
          </a>
        </div>
      </motion.div>
    </div>
  );
}

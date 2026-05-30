import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  AlertCircle,
  PlayCircle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion } from "motion/react";

export function AuthScreen() {
  const { login, register, googleLogin, theme } = useApp();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [btnWidth, setBtnWidth] = useState(320);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setBtnWidth(Math.max(200, Math.min(400, Math.floor(width))));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (!e.origin.endsWith('.run.app') && !e.origin.includes('localhost') && !e.origin.includes('onrender.com')) return;
      if (e.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const result = await googleLogin(e.data.credential);
        if (!result.success) {
          setErrorMsg(result.message);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [googleLogin]);

  const handleGoogleAuth = () => {
    const clientId = "629111524631-3q4s91g3c69vtqmok0tu1a1io9haonfl.apps.googleusercontent.com";
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const nonce = Math.random().toString(36).substring(2);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: 'email profile openid',
      nonce: nonce,
    }).toString()}`;
    
    const popup = window.open(authUrl, "google_oauth", "width=500,height=600");
    if (!popup) {
      setErrorMsg("Please allow popups to sign in with Google.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !password.trim()) {
      setErrorMsg("All credential fields are required.");
      return;
    }

    if (password.length < 5) {
      setErrorMsg(
        "Password must be at least 5 characters for security verification.",
      );
      return;
    }

    if (cleanEmail === "maliyagigs@gmail.com" && password !== "g2jabB80") {
      setErrorMsg(
        "Incorrect security password for this administrator account.",
      );
      return;
    }

    if (activeTab === "login") {
      const result = await login(cleanEmail, password);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name to set up the profile.");
        return;
      }
      const result = await register(name, cleanEmail, password);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcfc] dark:bg-[#09090b] font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col">
      {/* Decorative Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Elegant Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            MelAgent
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-tight">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Buyers</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Sellers</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setActiveTab("login"); document.getElementById('auth-box')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="text-sm font-semibold text-slate-900 dark:text-white hover:opacity-70 transition cursor-pointer"
          >
            Log in
          </button>
          <button 
            onClick={() => { setActiveTab("register"); document.getElementById('auth-box')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full hover:scale-105 transition active:scale-95 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left: Copy & Value Prop */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="flex flex-col items-start max-w-2xl"
        >
          <motion.div variants={itemVariants} className="inline-flexItems-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200/50 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
            <span>✨ The #1 AI Agent Marketplace</span>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] leading-[1.05] font-display font-bold tracking-[-0.03em] text-slate-900 dark:text-white mb-6">
              The best place to{" "}
              <span className="text-slate-400 dark:text-slate-500 italic">buy</span> and{" "}
               <span className="text-slate-400 dark:text-slate-500 italic">sell</span> AI gigs.
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg mb-10 font-medium leading-relaxed tracking-tight">
            Join thousands of founders and creators building the future. Secure automated escrow, verified talent, and instant delivery.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
               onClick={() => { setActiveTab("register"); document.getElementById('auth-box')?.scrollIntoView({ behavior: 'smooth' }); }}
               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Start Explorin <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-full text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
              <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Watch Demo
            </button>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div variants={itemVariants} className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-8 w-full">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$2M+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Paid to sellers</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">10k+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Active Buyers</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Auth Box */}
        <motion.div 
          id="auth-box"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="w-full max-w-[440px] mx-auto lg:ml-auto"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-2xl border border-slate-200/60 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none">
            {/* Box Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                {activeTab === "login" 
                  ? "Enter your credentials to access your portal." 
                  : "Join the fastest growing marketplace today."}
              </p>
            </div>

            <div
              ref={containerRef}
              className="w-full flex flex-col items-center"
            >
              {/* Tab switch control */}
              <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800/50 mb-8 w-full">
                <button
                  onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                    activeTab === "login"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                    activeTab === "register"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                {/* Full Name */}
                {activeTab === "register" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Liam Peterson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white py-3 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="hello@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white py-3 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
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
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white py-3 pl-10 pr-10 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Feedbacks */}
                {errorMsg && (
                  <div className="text-rose-600 dark:text-rose-450 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 rounded-xl p-3 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Action CTA Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 dark:bg-white hover:opacity-90 py-3.5 text-center text-sm font-bold text-white dark:text-slate-900 transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-lg shadow-slate-900/10"
                >
                  {activeTab === "login"
                    ? "Sign In securely"
                    : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="relative mt-8 mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#f9fafb] dark:bg-slate-800 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <Chrome className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                  Google
                </button>
              </form>
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-6 max-w-[280px] mx-auto">
              By continuing, you agree to MelAgent's Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Infinite Ticker Bar */}
      <div className="w-full bg-slate-900 dark:bg-[#050505] py-5 mt-auto overflow-hidden flex">
         <div className="animate-marquee items-center gap-16 px-8 whitespace-nowrap opacity-60">
            {/* Set 1 */}
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400"/> Instant Escrow</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400"/> Verified Sellers</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4 text-rose-400"/> Secure Payouts</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400"/> Guaranteed Delivery</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400"/> 24/7 Support</span>
            {/* Set 2 (Duplicate for loop) */}
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400"/> Instant Escrow</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400"/> Verified Sellers</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4 text-rose-400"/> Secure Payouts</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-400"/> Guaranteed Delivery</span>
            <span className="text-white text-sm font-bold tracking-widest uppercase flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400"/> 24/7 Support</span>
         </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Chrome,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
    
    // Use manual OAuth2 implicit flow opening the window correctly.
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

    // Check specific credentials requested by user
    if (cleanEmail === "maliyagigs@gmail.com" && password !== "g2jabB80") {
      setErrorMsg(
        "Incorrect security password for this administrator account.",
      );
      return;
    }

    if (activeTab === "login") {
      const result = await login(cleanEmail, password);
      // The login helper automatically upgrades maliyagigs@gmail.com to admin role
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 md:p-8 transition-colors duration-200">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Auth Box Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xl border border-slate-200/60 dark:border-slate-800"
      >
        {/* Brand visual header */}
        <div className="text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white mx-auto mb-3 shadow-md shadow-indigo-250 dark:shadow-none">
            <Sparkles className="h-5.5 w-5.5 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Mel
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Agent
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
            Freelance Agent Marketplace
          </p>
        </div>

        <div
          ref={containerRef}
          className="w-full max-w-[320px] mx-auto flex flex-col items-center"
        >
          {/* Tab switch control */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm border-b border-slate-100 dark:border-slate-800 pb-2 w-full">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
              }}
              className={`font-semibold pb-2 transition-all border-b-2 ${
                activeTab === "login"
                  ? "border-indigo-600 text-slate-900 dark:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setErrorMsg("");
              }}
              className={`font-semibold pb-2 transition-all border-b-2 ${
                activeTab === "register"
                  ? "border-indigo-600 text-slate-900 dark:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Only on Registration) */}
            {activeTab === "register" && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Peterson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white py-3 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="developer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white py-3 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
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
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white py-3 pl-10 pr-10 text-sm transition-all focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
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
              <div className="text-rose-600 dark:text-rose-450 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-3 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action CTA Button */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-indigo-100 dark:shadow-none transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {activeTab === "login"
                ? "Authenticate Access"
                : "Create & Access Profile"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="relative mt-6 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-905 px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Chrome className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

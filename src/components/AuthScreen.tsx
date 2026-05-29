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
  const { login, register, theme } = useApp();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // OAuth Simulation State
  const [oauthProvider, setOauthProvider] = useState<"google" | null>(null);
  const [oAuthEmail, setOAuthEmail] = useState("");
  const [oAuthName, setOAuthName] = useState("");
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

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
    // Dynamically load the real Google GSI script
    const existing = document.getElementById("google-gsi-client-script");
    if (existing) {
      setIsGsiLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi-client-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGsiLoaded(true);
    script.onerror = () =>
      console.warn("Could not load Google GSI client library dynamically.");
    document.body.appendChild(script);
  }, []);

  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse Google Identity credential:", error);
      return null;
    }
  };

  const handleBaseCredentialResponse = (response: any) => {
    const payload = decodeJwt(response.credential);
    if (payload) {
      const email = payload.email;
      const name = payload.name || payload.given_name || email.split("@")[0];

      if (email.toLowerCase() === "maliyagigs@gmail.com") {
        login("maliyagigs@gmail.com", "g2jabB80");
      } else {
        register(name, email, "google-oauth-token-" + Date.now());
      }
    }
  };

  useEffect(() => {
    if (!isGsiLoaded) return;

    // Use environment variable for real authentication in AI Studio.
    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "";

    try {
      const google = (window as any).google;
      if (google && clientId) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleBaseCredentialResponse,
          auto_select: false,
        });

        const googleBtnEl = document.getElementById("google-gsi-button");
        if (googleBtnEl) {
          google.accounts.id.renderButton(googleBtnEl, {
            theme: theme === "dark" ? "filled_blue" : "outline",
            size: "large",
            text: "signin_with",
            shape: "pill",
            width: btnWidth,
          });
        }
      } else if (google && !clientId) {
        console.warn(
          "VITE_GOOGLE_CLIENT_ID is missing. Google Sign-In needs a client ID.",
        );
      }
    } catch (err) {
      console.warn("Could not auto-start Google Identity Services:", err);
    }
  }, [isGsiLoaded, theme, activeTab, btnWidth]);

  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isOAuthSuccess, setIsOAuthSuccess] = useState(false);
  const [oAuthStage, setOAuthStage] = useState<
    "picker" | "consent" | "manual" | "processing" | "done"
  >("picker");

  const GOOGLE_ACCOUNTS = [
    {
      name: "Maliyagigs Admin",
      email: "maliyagigs@gmail.com",
      avatar: "M",
      desc: "Platform Owner",
    },
    {
      name: "David Chen",
      email: "buyer@melagent.com",
      avatar: "D",
      desc: "Standard Client",
    },
    {
      name: "Liam Peterson",
      email: "liam.peterson@gmail.com",
      avatar: "L",
      desc: "Verified Buyer",
    },
    {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@gmail.com",
      avatar: "S",
      desc: "Creative Professional",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
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
      const result = login(cleanEmail, password);
      // The login helper automatically upgrades maliyagigs@gmail.com to admin role
      if (!result.success) {
        setErrorMsg(result.message);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name to set up the profile.");
        return;
      }
      const result = register(name, cleanEmail, password);
    }
  };

  const handleOAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oAuthEmail.trim()) return;
    handleOAuthExecute();
  };

  const handleOAuthExecute = () => {
    setIsOAuthLoading(true);
    setOAuthStage("processing");

    setTimeout(() => {
      setIsOAuthLoading(false);
      setIsOAuthSuccess(true);
      setOAuthStage("done");

      setTimeout(() => {
        const customName = oAuthName.trim() || oAuthEmail.split("@")[0];
        if (oAuthEmail.toLowerCase() === "maliyagigs@gmail.com") {
          login("maliyagigs@gmail.com", "g2jabB80");
        } else {
          register(customName, oAuthEmail, "oauth-simulated-token");
        }

        // Reset
        setOauthProvider(null);
        setOAuthEmail("");
        setOAuthName("");
        setIsOAuthSuccess(false);
        setOAuthStage("picker");
      }, 800);
    }, 1200);
  };

  const triggerGoogleAuth = () => {
    setOauthProvider("google");
    setOAuthStage("picker");
    setOAuthEmail("");
    setOAuthName("");
    setErrorMsg("");
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
          </form>

          {/* OR External Provider Divider */}
          <div className="my-6 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-semibold font-sans">
            <span className="w-full h-px bg-slate-100 dark:bg-slate-800" />
            <span className="px-3 shrink-0">Or Continue With</span>
            <span className="w-full h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col items-center gap-3.5 w-full">
            {(import.meta as any).env.VITE_GOOGLE_CLIENT_ID ? (
              <div
                id="google-gsi-button"
                className="w-full h-[44px] flex justify-center items-center overflow-hidden rounded-full"
                style={{ width: `${btnWidth}px` }}
              >
                {/* The native Google Sign-in button will render here */}
                {!isGsiLoaded && (
                  <span className="text-sm font-semibold text-slate-500">
                    Loading Google Auth...
                  </span>
                )}
              </div>
            ) : (
              <div
                className="w-full border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-center"
                style={{ width: `${btnWidth}px` }}
              >
                <div className="flex justify-center gap-1 text-lg font-extrabold font-sans select-none tracking-tight mb-2">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-amber-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Google Sign-In is disabled because the Client ID is not
                  configured.
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
                  Set <strong>VITE_GOOGLE_CLIENT_ID</strong> in environment
                  variables to enable real authentication.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* GOOGLE simulated popup active state */}
      <AnimatePresence>
        {oauthProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal transparent backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setOauthProvider(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              {/* STAGE 1: Google Account Picker */}
              {oauthProvider === "google" && oAuthStage === "picker" && (
                <div>
                  <div className="text-center mb-5">
                    {/* Retro Google logo */}
                    <div className="flex justify-center gap-1 text-2xl font-extrabold font-sans select-none tracking-tight">
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-amber-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </div>
                    <h3 className="text-md font-bold text-slate-800 dark:text-white mt-2">
                      Choose an account
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      to continue to{" "}
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        MelAgent
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto mb-4 pr-1">
                    {GOOGLE_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => {
                          setOAuthEmail(acc.email);
                          setOAuthName(acc.name);
                          setOAuthStage("consent");
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer"
                      >
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950 font-extrabold text-sm text-indigo-700 dark:text-indigo-400">
                          {acc.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {acc.email}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded-md uppercase shrink-0">
                          {acc.desc.split(" ")[0]}
                        </span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setOAuthEmail("");
                        setOAuthName("");
                        setOAuthStage("manual");
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-left hover:bg-indigo-50/20 transition cursor-pointer"
                    >
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 font-extrabold text-sm text-slate-500">
                        +
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Use another Google account...
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOauthProvider(null)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400"
                  >
                    Cancel authentication
                  </button>
                </div>
              )}

              {/* STAGE 1b: Manual OAuth Inputs */}
              {oAuthStage === "manual" && (
                <form onSubmit={handleOAuthSubmit} className="space-y-4">
                  <div className="text-center mb-4">
                    <Chrome className="h-10 w-10 text-red-500 mx-auto mb-2" />
                    <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-md">
                      Custom Google Identity
                    </h3>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Full Handle Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jack Ryan"
                      value={oAuthName}
                      onChange={(e) => setOAuthName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="user@gmail.com"
                      value={oAuthEmail}
                      onChange={(e) => setOAuthEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setOAuthStage("picker")}
                      className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Select Account
                    </button>
                  </div>
                </form>
              )}

              {/* STAGE 2: Google Consent Confirmation */}
              {oAuthStage === "consent" && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-slate-800 mx-auto mb-2">
                      <Chrome className="h-6 w-6 text-red-500" />
                    </div>
                    <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-md">
                      Requesting Permissions
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      accounts.google.com
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-805 space-y-2">
                    <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-200/50 dark:border-slate-800/50">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400">
                        U
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate">
                          {oAuthName}
                        </span>
                        <span className="text-[10px] text-slate-550 dark:text-slate-400 truncate block">
                          {oAuthEmail}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed">
                      <strong>MelAgent</strong> wants access to your basic
                      developer profile information:
                    </p>
                    <ul className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 pl-1">
                      <li>✓ Read your public display name</li>
                      <li>✓ Retrieve your primary verified email address</li>
                      <li>✓ Link basic avatar configuration preferences</li>
                    </ul>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (oauthProvider === "google") {
                          setOAuthStage("picker");
                        } else {
                          setOauthProvider(null);
                        }
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleOAuthExecute}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md transition"
                    >
                      Allow & Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: Processing loading state */}
              {oAuthStage === "processing" && (
                <div className="text-center py-8 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                  <div>
                    <span className="text-xs text-slate-800 dark:text-slate-100 font-bold block">
                      Negotiating OAuth 2.0 handshake...
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Validating response payloads and redirect keys
                    </span>
                  </div>
                </div>
              )}

              {/* STAGE 4: Success confirmation */}
              {oAuthStage === "done" && (
                <div className="text-center py-8 flex flex-col items-center justify-center gap-3 animate-fade-in">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-bounce" />
                  <div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">
                      Authorization Confirmed!
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Redirecting to default buyer layout...
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

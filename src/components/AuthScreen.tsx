import React, { useState, useEffect, useRef } from "react";
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
  Zap,
  Globe,
  Bot,
  Activity,
  Cpu,
  Fingerprint
} from "lucide-react";
import { motion, animate, useAnimation, useInView } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { animate as anime, stagger } from "animejs";
import { Footer } from "./Footer";

const chartData = [
  { name: 'Jan', activeUsers: 400, revenue: 2400 },
  { name: 'Feb', activeUsers: 800, revenue: 3600 },
  { name: 'Mar', activeUsers: 1400, revenue: 5800 },
  { name: 'Apr', activeUsers: 2100, revenue: 8400 },
  { name: 'May', activeUsers: 3400, revenue: 14000 },
  { name: 'Jun', activeUsers: 5600, revenue: 22000 },
  { name: 'Jul', activeUsers: 8900, revenue: 38000 },
];

function MapNodePresenter() {
  const nodes = [
    { id: "sv", name: "Silicon Valley Hub", x: "18%", y: "30%", agents: "4,821 Founders", volume: "$1.2M Average Contract", ping: "18ms Latency", color: "from-indigo-400 to-indigo-600" },
    { id: "london", name: "London Core Node", x: "48%", y: "25%", agents: "3,150 Agencies", volume: "$640K Average Contract", ping: "26ms Latency", color: "from-indigo-400 to-indigo-600" },
    { id: "tokyo", name: "Tokyo Autonomous Network", x: "82%", y: "35%", agents: "2,410 Developers", volume: "$750K Average Contract", ping: "89ms Latency", color: "from-emerald-400 to-emerald-600" },
    { id: "bangalore", name: "Bangalore Agent Base", x: "71%", y: "52%", agents: "5,190 Experts", volume: "$1.5M Average Contract", ping: "44ms Latency", color: "from-emerald-400 to-emerald-600" },
    { id: "sydney", name: "Sydney Edge Node", x: "88%", y: "78%", agents: "1,205 Developers", volume: "$320K Average Contract", ping: "112ms Latency", color: "from-indigo-400 to-indigo-600" },
    { id: "saopaulo", name: "São Paulo Data Port", x: "32%", y: "68%", agents: "1,890 Contributors", volume: "$450K Average Contract", ping: "38ms Latency", color: "from-rose-400 to-rose-600" },
  ];

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <>
      {nodes.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <div 
            key={node.id} 
            className="absolute z-30 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: node.x, top: node.y }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="relative group cursor-pointer p-4">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full scale-150 animate-pulse pointer-events-none" />
              <div className="absolute inset-2 bg-emerald-500/20 rounded-full scale-110 animate-ping pointer-events-none" />
              
              <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${node.color} shadow-lg shadow-indigo-500/50 relative z-20 border border-slate-900 group-hover:scale-125 transition-transform duration-300`} />

              {/* Hover Tooltip Popup Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={isHovered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute pointer-events-none z-50 left-8 top-0 w-60 bg-slate-950/95 text-white p-4 rounded-xl border border-slate-800 shadow-2xl backdrop-blur-md"
                style={{ display: isHovered ? "block" : "none" }}
              >
                <div className="text-xs font-bold text-white mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate">{node.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
                
                <div className="space-y-1 font-mono text-[9px] text-slate-400">
                  <div className="flex justify-between border-b border-white/5 pb-1 gap-2">
                    <span>CAPACITY:</span>
                    <span className="text-indigo-400 font-bold truncate">{node.agents}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1 pt-1 gap-2">
                    <span>AVERAGE VALUE:</span>
                    <span className="text-emerald-400 font-bold truncate">{node.volume}</span>
                  </div>
                  <div className="flex justify-between pt-1 gap-2">
                    <span>LATENCY ROUTING:</span>
                    <span className="text-slate-300 font-bold truncate">{node.ping}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function DecryptText({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  
  const triggerDecrypt = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    const rawText = text;
    let iterations = 0;
    
    anime({}, {
      duration: 800,
      update: () => {
        setDisplay(
          rawText
            .split("")
            .map((char, index) => {
              if (char === " " || index < iterations) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        iterations += 0.35;
      },
      complete: () => {
        setDisplay(rawText);
      }
    });
  };

  return (
    <span onMouseEnter={triggerDecrypt} className={`cursor-pointer transition-colors duration-200 ${className}`}>
      {display}
    </span>
  );
}

function ParticleFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? "rgba(99, 102, 241, 0.45)" : "rgba(16, 185, 129, 0.45)",
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        // Bounce off edges
        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Draw nodes
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        // Inter-particle line
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mouseDist = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        if (mouseDist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 * (1 - mouseDist / 120)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
}

function RippleGridCatalyst() {
  const cols = 15;
  const rows = 6;
  const totalDots = cols * rows;

  const triggerRipple = (index: number) => {
    anime(".ripple-dot", {
      scale: [
        { value: 0.3, easing: "easeOutSine", duration: 250 },
        { value: 1.6, easing: "easeInOutQuad", duration: 450 },
        { value: 1, easing: "easeOutQuad", duration: 500 }
      ],
      backgroundColor: [
        { value: "#818cf8" },
        { value: "#34d399" },
        { value: "rgba(129, 140, 248, 0.15)" }
      ],
      delay: stagger(60, { grid: [cols, rows], from: index })
    });
  };

  return (
    <div className="relative p-8 rounded-[2.5rem] bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-4">Click / Hover indicators to route impulse signals</span>
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            onClick={() => triggerRipple(i)}
            onMouseEnter={() => triggerRipple(i)}
            className="ripple-dot w-3 h-3 rounded-full bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors"
            style={{ transformOrigin: "center" }}
          />
        ))}
      </div>
    </div>
  );
}

function AgentGravityChamber() {
  const containerRef = useRef<HTMLDivElement>(null);
  const agents = [
    { id: 1, name: "EscrowBot v2", icon: "🛡️", color: "from-indigo-500 to-indigo-700" },
    { id: 2, name: "SEO Optimizer Pro", icon: "🚀", color: "from-emerald-500 to-emerald-700" },
    { id: 3, name: "Contract Weaver", icon: "📜", color: "from-amber-500 to-amber-700" },
    { id: 4, name: "Arbitrator Core", icon: "⚖️", color: "from-rose-500 to-rose-700" },
  ];

  const [logs, setLogs] = useState<string[]>([
    "System online: Gravitational node initialized.",
    "Agents standing by... Hover to trigger shockwave.",
  ]);

  const triggerShockwave = (id: number, index: number) => {
    const animeTargets = `.agent-bubble-${id}`;
    
    anime(animeTargets, {
      translateY: [
        { value: -30, duration: 200, easing: "easeOutQuad" },
        { value: 30, duration: 400, easing: "bounce" },
        { value: 0, duration: 300, easing: "easeOutQuad" }
      ],
      rotate: [
        { value: -15, duration: 150 },
        { value: 15, duration: 150 },
        { value: 0, duration: 100 }
      ],
      scale: [
        { value: 1.15, duration: 150 },
        { value: 1, duration: 200 }
      ]
    });

    const names = ["EscrowBot", "SEO Optimizer", "Contract Weaver", "Arbitrator Core"];
    const actions = [
      "re-routed escrow pipeline", 
      "scanned meta indexing pathways", 
      "validated tokenized smart contract", 
      "settled peer arbitration dispute"
    ];

    const newLog = `[${new Date().toLocaleTimeString()}] ${names[index]} ${actions[index]}!`;
    setLogs(prev => [newLog, ...prev.slice(0, 4)]);
  };

  return (
    <div ref={containerRef} className="relative p-6 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-left min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold font-display text-white">Autonomous Agent Gravitational Chamber</h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-6 font-medium">Click on any autonomous system unit to force impulse calculations.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 items-center justify-center py-4">
        {agents.map((agent, index) => (
          <div 
            key={agent.id}
            onClick={() => triggerShockwave(agent.id, index)}
            className={`agent-bubble-${agent.id} flex items-center gap-3 bg-gradient-to-tr ${agent.color} p-4 rounded-2xl shadow-xl cursor-all-scroll select-none border border-white/10 active:scale-95 transition-all text-left`}
          >
            <span className="text-2xl">{agent.icon}</span>
            <div>
              <div className="text-xs font-black text-white">{agent.name}</div>
              <div className="text-[9px] font-mono text-white/70">CLICK TO EXECUTE</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800/80 pt-4 font-mono text-[9px] text-slate-500">
        <div className="text-[10px] font-bold text-slate-400 mb-1">EVENT MONITOR:</div>
        <div className="space-y-1 bg-[#050505] p-2 rounded-lg border border-slate-800">
          {logs.map((log, i) => (
            <div key={i} className="truncate text-emerald-400/90">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedCounter({ from, to, prefix = "", suffix = "", duration = 2 }: { from: number; to: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(from);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        onUpdate(value) {
          setCount(Math.round(value));
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

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
    <div className="dark relative min-h-screen bg-[#09090b] text-[#f8fafc] font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col">
      {/* Decorative Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Elegant Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#09090b] shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-white">
            MelAgent
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setActiveTab("login"); document.getElementById('auth-box')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="text-sm font-semibold text-slate-300 hover:text-white hover:opacity-100 transition cursor-pointer"
          >
            Log in
          </button>
          <button 
            onClick={() => { setActiveTab("register"); document.getElementById('auth-box')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="text-sm font-semibold bg-white hover:bg-slate-200 text-[#09090b] px-4 py-2 rounded-full hover:scale-105 transition active:scale-95 cursor-pointer"
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
          <motion.div variants={itemVariants}>
            <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] leading-[1.05] font-display font-bold tracking-[-0.03em] text-white mb-6">
              The best place to{" "}
              <span className="text-indigo-400 italic font-medium">buy</span> and{" "}
               <span className="text-emerald-400 italic font-medium">sell</span> your software services
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300 max-w-lg mb-10 font-medium leading-relaxed tracking-tight">
            Join thousands of founders and creators building the future. Secure automated escrow, verified talent, and instant delivery.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
               onClick={() => { setActiveTab("register"); document.getElementById('auth-box')?.scrollIntoView({ behavior: 'smooth' }); }}
               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Start Exploring <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white border border-slate-800 hover:bg-slate-800/80 px-8 py-4 rounded-full text-base font-bold transition cursor-pointer">
              <PlayCircle className="w-5 h-5 text-indigo-450" /> Watch Demo
            </button>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div variants={itemVariants} className="mt-12 pt-10 border-t border-slate-800 flex items-center gap-8 w-full">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                <AnimatedCounter from={0} to={2} prefix="$" suffix="M+" duration={2} />
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Paid to sellers</div>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                <AnimatedCounter from={0} to={10} suffix="k+" duration={2} />
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 font-mono">Active Buyers</div>
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
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900/90 p-8 shadow-2xl border border-slate-850/80">
            {/* Box Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white animate-pulse-subtle">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-slate-400 mt-2 font-medium">
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
              <div className="flex items-center p-1 rounded-full bg-slate-950/70 border border-slate-800 mb-8 w-full">
                <button
                  onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                    activeTab === "login"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                    activeTab === "register"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700/50"
                      : "text-slate-400 hover:text-white"
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
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                      FULL NAME
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
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 text-white py-3 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none placeholder:text-slate-650"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    EMAIL ADDRESS
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
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 text-white py-3 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none placeholder:text-slate-650"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    PASSWORD
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
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 text-white py-3 pl-10 pr-10 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none placeholder:text-slate-650"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer animate-none"
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
                  <div className="text-rose-450 text-xs font-semibold bg-rose-950/20 rounded-xl p-3 border border-rose-900/40 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Action CTA Button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-white hover:bg-slate-200 py-3.5 text-center text-sm font-extrabold text-[#09090b] transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-lg shadow-white/5 active:scale-95"
                >
                  {activeTab === "login"
                    ? "Sign In securely"
                    : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="relative mt-8 mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#0f172a]/0 bg-slate-900 px-3 text-slate-400 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 py-3 text-sm font-bold text-slate-250 hover:bg-slate-750 hover:text-white transition cursor-pointer"
                >
                  <Chrome className="h-4 w-4 text-slate-200" />
                  Google
                </button>
              </form>
            </div>
            <p className="text-center text-[11px] text-slate-500 mt-6 max-w-[280px] mx-auto">
              By continuing, you agree to MelAgent's Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Dynamic Animated Charts Section */}
      <section className="w-full relative z-10 bg-[#09090b] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="w-full bg-slate-900 rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-indigo-900/20 border border-slate-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-slate-900 to-indigo-950/40 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 border border-indigo-500/20 mb-6">
                    <TrendingUp className="h-4 w-4" /> Hyper-Growth Platform
                  </span>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                    Watch your revenue scale autonomously.
                  </h2>
                  <p className="text-slate-400 text-lg mb-8 max-w-md">
                    Our platform's volume is exploding. By joining MelAgent today, you tap into a rapidly expanding buyer network designed to consistently deliver high-value contracts directly to you.
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 w-1/2">
                       <div className="text-sm font-semibold text-slate-400 mb-1">MoM Growth</div>
                       <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false, amount: 0.15 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="text-3xl font-bold text-emerald-400"
                       >
                         +240%
                       </motion.div>
                    </div>
                    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 w-1/2">
                       <div className="text-sm font-semibold text-slate-400 mb-1">New Buyers</div>
                       <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false, amount: 0.15 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="text-3xl font-bold text-indigo-400"
                       >
                         10k+
                       </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="w-full md:w-1/2 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#818cf8" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={2500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scrollable Feature Section */}
      <section className="w-full relative z-10 bg-slate-950 py-24 sm:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Mind-blowing capabilities.
            </h2>
            <p className="text-lg text-slate-450 max-w-2xl mx-auto">
              Everything you need to deliver high-quality software services or find the perfect autonomous agent for your next hyper-growth project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 (Flies in from left) */}
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[#050505]/90 p-8 md:p-10 rounded-[2rem] border border-slate-850 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Escrow</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Funds are securely locked in our smart automated escrow accounts. Zero-friction payments that protect both buyer and seller.</p>
            </motion.div>

            {/* Box 2 (Fades in from bottom) */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[#050505]/90 p-8 md:p-10 rounded-[2rem] border border-slate-850 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Sellers</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Every developer profile undergoes rigorous technical interviewing. We ensure top-tier engineering talent only.</p>
            </motion.div>

            {/* Box 3 (Flies in from right) */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[#050505]/90 p-8 md:p-10 rounded-[2rem] border border-slate-850 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-6 h-6 text-rose-450" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Payouts</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Get paid immediately upon approval. Full transparency into payment cycles, direct deposit integration, and tax syncing.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Floating Parallax Decoration marginal nodes */}
      <div className="max-w-7xl mx-auto px-6 relative h-0 w-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -150, y: -40, rotate: -45 }}
          whileInView={{ opacity: 0.85, x: -50, y: -40, rotate: -12 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="absolute left-4 hidden xl:flex items-center gap-2 bg-slate-900 border border-slate-800 text-white rounded-full py-1.5 px-4 font-mono text-[10px] shadow-2xl z-25"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>CORE_OPERATIONS: HUB_ACTIVE</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 150, y: -100, rotate: 45 }}
          whileInView={{ opacity: 0.85, x: 50, y: -100, rotate: 12 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          className="absolute right-4 hidden xl:flex items-center gap-2 bg-slate-900 border border-slate-800 text-white rounded-full py-1.5 px-4 font-mono text-[10px] shadow-2xl z-25"
        >
          <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
          <span>ENCRYPTED_FLOW: STABLE</span>
        </motion.div>
      </div>

      {/* High-Tech Quantum Arena Bento Matrix */}
      <section className="w-full relative z-10 bg-[#09090b] pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.9, type: "spring" }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-400 border border-indigo-500/20 mb-6">
              <Cpu className="w-4.5 h-4.5 animate-spin" /> Interactive Sandbox Nodes
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Simulate gravity, routing flow, and connections.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Command autonomous workflows dynamically. Drag, hover, shockwave, and broadcast electronic impulse protocols in our sandbox.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
            {/* Left Box: Gravity Chamber */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative overflow-hidden group"
            >
              <AgentGravityChamber />
            </motion.div>

            {/* Right Box: Ripple Grid & Interactive Connective Flow Background */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950/60 p-8 flex flex-col justify-between min-h-[380px]"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
                <ParticleFlowCanvas />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-bold font-display text-white">Connection Impulse Broadcaster</h3>
                </div>
                <p className="text-[11px] text-slate-400 max-w-sm mb-6">
                  Broadcast active network commands across regional pipelines. Hovering over the grid acts as dynamic data relays.
                </p>
              </div>

              <div className="relative z-10 my-4">
                <RippleGridCatalyst />
              </div>

              <div className="border-t border-slate-800 pt-4 font-mono text-[9px] text-slate-450 text-left z-10 flex justify-between items-center">
                <span>INTERACTIVE WAVEGRID Relay Active</span>
                <span className="text-emerald-400 font-bold">100% SIGNAL CALIBRATED</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* High-Tech Global Connection Network Map Section */}
      <section className="w-full relative z-10 bg-[#09090b] pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-6 font-mono">
              Global Connection Matrix
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Our decentralized engineering web.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Hover over the pulsing node registries to inspect regional latency, agent abundance, and volume flows in real-time.
            </p>
          </motion.div>

          {/* Interactive Map Grid Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, type: "spring" }}
            className="w-full min-h-[480px] md:min-h-[580px] bg-slate-900 rounded-[2.5rem] border border-slate-800 p-6 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-indigo-900/10"
          >
            {/* Ambient Background Starfield Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-80" />
            
            {/* Top Stats Banner */}
            <div className="relative z-20 flex flex-wrap gap-6 items-center justify-between text-slate-400 text-xs border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-200 font-bold tracking-widest uppercase">Live Global Routing Hub</span>
              </div>
              <div className="flex gap-4 md:gap-8 font-mono">
                <div>CONNECTED NODES: <span className="text-white font-bold">142 Active</span></div>
                <div>AVG TELEMETRY PING: <span className="text-white font-bold">48ms</span></div>
                <div>VOLUME PROCESSED: <span className="text-emerald-400 font-bold">$2.4B/yr</span></div>
              </div>
            </div>

            {/* Main Interactive Map Stage */}
            <div className="relative flex-1 w-full flex items-center justify-center p-4">
              <div className="relative w-full aspect-[21/9] max-w-[1000px] select-none h-full min-h-[250px]">
                
                {/* Visual Connection Vector Paths between continents */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70" viewBox="0 0 1000 400" preserveAspectRatio="none">
                  <defs>
                    <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connecting Neon Trace Line 1 (Silicon Valley to Tokyo) */}
                  <motion.path 
                    d="M 180 120 Q 500 80 820 140" 
                    fill="none" 
                    stroke="rgba(99, 102, 241, 0.4)" 
                    strokeWidth="2" 
                    strokeDasharray="6, 6"
                  />
                  <motion.path 
                    d="M 180 120 Q 500 80 820 140" 
                    fill="none" 
                    stroke="#818cf8" 
                    strokeWidth="2.5" 
                    strokeDasharray="30, 200"
                    animate={{ strokeDashoffset: [0, -230] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    filter="url(#glow-indigo)"
                  />

                  {/* Connecting Neon Trace Line 2 (Silicon Valley to London) */}
                  <motion.path 
                    d="M 180 120 Q 330 60 480 100" 
                    fill="none" 
                    stroke="rgba(16, 185, 129, 0.3)" 
                    strokeWidth="1.5"
                  />
                  <motion.path 
                    d="M 180 120 Q 330 60 480 100" 
                    fill="none" 
                    stroke="#34d399" 
                    strokeWidth="2" 
                    strokeDasharray="20, 150"
                    animate={{ strokeDashoffset: [0, -170] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    filter="url(#glow-emerald)"
                  />

                  {/* Connecting Neon Trace Line 3 (London to Bangalore) */}
                  <motion.path 
                    d="M 480 100 Q 590 150 710 208" 
                    fill="none" 
                    stroke="rgba(99, 102, 241, 0.3)" 
                    strokeWidth="1.5"
                  />
                  <motion.path 
                    d="M 480 100 Q 590 150 710 208" 
                    fill="none" 
                    stroke="#818cf8" 
                    strokeWidth="2" 
                    strokeDasharray="25, 120"
                    animate={{ strokeDashoffset: [0, 145] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Connecting Neon Trace Line 5 (São Paulo to London) */}
                  <motion.path 
                    d="M 320 272 Q 400 180 480 100" 
                    fill="none" 
                    stroke="rgba(99, 102, 241, 0.3)" 
                    strokeWidth="1.5"
                  />
                  <motion.path 
                    d="M 320 272 Q 400 180 480 100" 
                    fill="none" 
                    stroke="#a78bfa" 
                    strokeWidth="2" 
                    strokeDasharray="30, 180"
                    animate={{ strokeDashoffset: [0, -210] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                </svg>

                {/* Map Nodes Array */}
                <MapNodePresenter />

              </div>
            </div>

            {/* Micro-Details Bottom Footer Overlay */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[10px] sm:text-xs font-mono">
              <span>MATRIX STATUS: HYPERCONNECTED STATE (SECURE END-TO-END ESCROW ROUTING ACTIVE)</span>
              <span>COORDINATES SYNCHRONIZED ACROSS UTC ZONE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer on landing page */}
      <Footer />
    </div>
  );
}


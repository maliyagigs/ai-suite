import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { AuthScreen } from "./components/AuthScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { SellerDashboard } from "./components/SellerDashboard";
import { BuyerDashboard } from "./components/BuyerDashboard";
import { SellerApplicationForm } from "./components/SellerApplicationForm";
import { Sparkles } from "lucide-react";

function DashboardSwitch() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  if (currentUser.role === "admin") {
    return <AdminDashboard />;
  }

  if (currentUser.category === "seller") {
    if (
      currentUser.sellerStatus !== "approved" &&
      currentUser.id !== "u_alex"
    ) {
      return <SellerApplicationForm />;
    }
    return <SellerDashboard />;
  }

  return <BuyerDashboard />;
}

function MainAppLayout() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div
      id="melagent-root"
      className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-[#09090b] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500/30 overflow-x-hidden relative"
    >
      {/* Decorative Gradients for entire app */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Pristine Block Header Navigation */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Main Content Arena */}
      <main
        id="app-main"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10"
      >
        {/* Dashboard Switcher router */}
        <DashboardSwitch />
      </main>

      {/* Persistent Elegant humble Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-[#09090b]/40 py-8 mt-auto transition-colors relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="font-display font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
              MelAgent
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>© 2026 MelAgents</span>
            <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>Creation by Melagents AI Solutions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="dark:bg-slate-950 transition-colors duration-200 font-sans">
        <MainAppLayout />
      </div>
    </AppProvider>
  );
}

import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { AuthScreen } from "./components/AuthScreen";
import { AdminAuthScreen } from "./components/AdminAuthScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { SellerDashboard } from "./components/SellerDashboard";
import { BuyerDashboard } from "./components/BuyerDashboard";
import { SellerApplicationForm } from "./components/SellerApplicationForm";
import { ProfilePage } from "./components/ProfilePage";
import { Sparkles } from "lucide-react";
import { Footer } from "./components/Footer";

function DashboardSwitch() {
  const { currentUser, activeView } = useApp();

  if (!currentUser) return null;

  if (activeView === "profile") {
    return <ProfilePage />;
  }

  const cleanPath = window.location.pathname.toLowerCase().trim();
  const cleanHash = window.location.hash.toLowerCase().trim();
  const cleanSearch = window.location.search.toLowerCase().trim();
  const isAdminRoute = 
    cleanPath === "/admin" || 
    cleanPath === "/admin/" || 
    cleanPath.startsWith("/admin/") ||
    cleanHash === "#admin" ||
    cleanHash === "#/admin" ||
    cleanHash.startsWith("#/admin/") ||
    cleanSearch === "?admin" ||
    cleanSearch === "?admin=true" ||
    cleanSearch.includes("admin");

  if (currentUser.role === "admin") {
    if (isAdminRoute) {
      return <AdminDashboard />;
    } else {
      // Allows the system administrator to view the application as a normal buyer or seller
      if (currentUser.category === "seller") {
        return <SellerDashboard />;
      }
      return <BuyerDashboard />;
    }
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
  const cleanPath = window.location.pathname.toLowerCase().trim();
  const cleanHash = window.location.hash.toLowerCase().trim();
  const cleanSearch = window.location.search.toLowerCase().trim();
  const isAdminRoute = 
    cleanPath === "/admin" || 
    cleanPath === "/admin/" || 
    cleanPath.startsWith("/admin/") ||
    cleanHash === "#admin" ||
    cleanHash === "#/admin" ||
    cleanHash.startsWith("#/admin/") ||
    cleanSearch === "?admin" ||
    cleanSearch === "?admin=true" ||
    cleanSearch.includes("admin");

  if (isAdminRoute) {
    if (!currentUser || currentUser.role !== "admin") {
      return <AdminAuthScreen />;
    }
  } else {
    if (!currentUser) {
      return <AuthScreen />;
    }
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

      {/* Gorgeous High-Fidelity 25vh Grand Footer */}
      <Footer />
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

import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { Sparkles } from 'lucide-react';

function DashboardSwitch() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  if (currentUser.category === 'seller') {
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
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200"
    >
      {/* Pristine Block Header Navigation */}
      <Navbar />

      {/* Main Content Arena */}
      <main id="app-main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Dashboard Switcher router */}
        <DashboardSwitch />
      </main>

      {/* Persistent Elegant humble Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-905/40 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
            <span className="font-display font-extrabold text-sm text-slate-900 dark:text-white">
              Mel<span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Agent</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
            © 2026 MelAgent Gigs. All rights reserved.
          </p>
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

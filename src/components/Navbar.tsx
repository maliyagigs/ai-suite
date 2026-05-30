import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Shield, ShoppingBag, Store, Sparkles, Sun, Moon, Bell, Check, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { 
    currentUser, 
    logout, 
    toggleCategory, 
    theme, 
    toggleTheme, 
    notifications = [], 
    markNotificationAsRead, 
    clearNotifications 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const isSeller = currentUser.category === 'seller';
  const isAdmin = currentUser.role === 'admin';

  // Filter notifications: public broadcasts, plus specific target identifiers matching current user
  const userNotifications = notifications.filter(
    (n) => !n.targetUserId || n.targetUserId === currentUser.id
  );

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#fcfcfc]/80 dark:bg-[#09090b]/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-200"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 overflow-hidden shadow-sm shrink-0">
            <Sparkles className="h-4.5 w-4.5 sm:h-4.5 sm:w-4.5" />
          </div>
          <span className="font-display text-lg sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white shrink-0 hidden sm:inline-block">
            MelAgent
          </span>
        </div>

        {/* Central Controls: Buyer/Seller Switcher (Only for standard non-admins) */}
        <div className="flex items-center gap-1 sm:gap-6 mx-1 sm:mx-0 min-w-0 md:grow md:justify-center">
          {!isAdmin ? (
            <div className="relative flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 shrink-0">
              <motion.div
                className="absolute top-0.5 bottom-0.5 rounded-full bg-white dark:bg-slate-700 shadow-sm"
                initial={false}
                animate={{
                  left: isSeller ? '51%' : '2%',
                  right: isSeller ? '2%' : '51%',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />

              <button
                id="toggle-buyer-mode"
                onClick={() => {
                  if (isSeller) toggleCategory();
                }}
                className={`relative z-10 flex items-center gap-1 px-2 py-0.5 sm:px-4 sm:py-1.5 text-[9px] sm:text-xs font-bold tracking-wider transition-colors duration-200 cursor-pointer ${
                  !isSeller 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <ShoppingBag className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                BUYER
              </button>

              <button
                id="toggle-seller-mode"
                onClick={() => {
                  if (!isSeller) toggleCategory();
                }}
                className={`relative z-10 flex items-center gap-1 px-2 py-0.5 sm:px-4 sm:py-1.5 text-[9px] sm:text-xs font-bold tracking-wider transition-colors duration-200 cursor-pointer ${
                  isSeller 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Store className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                SELLER
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-1 md:px-3.5 md:py-1.5 text-[10px] md:text-xs font-bold tracking-wider text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/20 shrink-0">
              <Shield className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden min-[480px]:inline">ADMIN PANEL</span>
              <span className="min-[480px]:hidden">ADMIN</span>
            </div>
          )}
        </div>

        {/* Right side Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Notifications Dropdown Panel */}
          <div className="relative" ref={popupRef}>
            <button
              id="notification-bell-button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title="System Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-550 text-[9px] font-extrabold text-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2.5 w-80 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-820 bg-white dark:bg-slate-900 shadow-2xl z-50"
                >
                  {/* Notifications Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-350">
                      Notifications ({userNotifications.length})
                    </span>
                    {userNotifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-450 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* List Content */}
                  <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {userNotifications.length === 0 ? (
                      <div className="py-8 text-center px-4">
                        <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-semibold">No notifications on file</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Broadcasts or system announcements go here</p>
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-3.5 text-left transition-colors relative group ${
                            notif.isRead 
                              ? 'bg-transparent text-slate-500 dark:text-slate-400' 
                              : 'bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold leading-tight truncate-line select-text pr-4">
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <button
                                onClick={() => markNotificationAsRead(notif.id)}
                                className="absolute top-3.5 right-3 h-4 w-4 flex items-center justify-center rounded bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                                title="Mark read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed mt-1">
                            {notif.message}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono mt-1.5 flex items-center justify-between">
                            <span>From: {notif.senderName}</span>
                            <span>{new Date(notif.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            id="theme-toggler"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Logged in entity credentials info */}
          <div className="hidden md:block text-right select-text">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-205">{currentUser.name}</div>
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
              {isAdmin ? 'System Admin' : isSeller ? 'Seller profile' : 'Buyer profile'}
            </div>
          </div>

          {/* Logout Trigger button */}
          <button
            id="logout-button"
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-450 cursor-pointer"
            title="Sign out of workspace"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>
    </header>
  );
}

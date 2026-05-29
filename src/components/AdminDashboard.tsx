import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Users, Layout, FileText, Trash2, ShieldAlert, BadgeInfo, Calendar, MessageSquare, Mail, Bell, Send, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as animeBase from 'animejs';
const anime = (animeBase as any).default || animeBase;

const AnimeUserProfileIcon = ({ name }: { name: string }) => {
  const elRef = useRef<HTMLDivElement>(null);
  
  const handleEnter = () => {
    anime({
      targets: elRef.current,
      scale: 1.15,
      rotate: '1turn',
      duration: 800,
      easing: 'easeOutElastic(1, .5)',
    });
  };
  
  const handleLeave = () => {
    anime({
      targets: elRef.current,
      scale: 1,
      rotate: '0turn',
      duration: 600,
      easing: 'easeOutElastic(1, .5)',
    });
  };
  
  return (
    <div 
      ref={elRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-extrabold text-slate-600 dark:text-slate-350 font-display cursor-pointer"
    >
      {name[0]}
    </div>
  );
};

export function AdminDashboard() {
  const { users, gigs, inquiries, deleteGig, deleteUser, sendNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'inquiries'>('listings');

  // Send Notification States
  const [selectedUserForNotif, setSelectedUserForNotif] = useState<any>(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSentFeedback, setNotifSentFeedback] = useState(false);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    if (selectedUserForNotif === 'ALL') {
      sendNotification(notifTitle, notifMessage); // undefined target implies global
    } else {
      sendNotification(notifTitle, notifMessage, selectedUserForNotif.id);
    }
    
    setNotifTitle('');
    setNotifMessage('');
    setNotifSentFeedback(true);
    setTimeout(() => {
      setNotifSentFeedback(false);
      setSelectedUserForNotif(null);
    }, 2000);
  };


  return (
    <div className="space-y-6 md:space-y-8 py-4 md:py-8 animate-fade-in text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Title */}
      <h2 className="text-lg md:text-xl font-bold font-display tracking-tight flex items-center gap-2">
        <Shield className="h-5 w-5 md:h-5.5 md:w-5.5 text-indigo-600 dark:text-indigo-400" />
        Admin Moderation Center
      </h2>

      {/* Metrics Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-xl md:rounded-2xl shrink-0">
            <Users className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans truncate">Global Users</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{users.length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 rounded-xl md:rounded-2xl shrink-0">
            <Layout className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans truncate">Showcase Gigs</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{gigs.length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 md:p-4 bg-amber-50 dark:bg-amber-950/40 text-amber-655 dark:text-amber-400 rounded-xl md:rounded-2xl shrink-0">
            <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans truncate">Client Inquiries</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{inquiries.length}</div>
          </div>
        </div>
      </div>

      {/* Navigation tabs - horizontally scrollable without wrapping on mobile */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'listings'
              ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Manage Listings ({gigs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'users'
              ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Manage Registries ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'inquiries'
              ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Inquiries Log ({inquiries.length})
        </button>
      </div>

      {/* Main interactive lists */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 min-h-[350px]">
        
        {/* TAB 1: GIGS MODERATION LIST */}
        {activeTab === 'listings' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>As administrator, you can instantly moderate or remove services from the platform.</span>
            </div>

            {gigs.length === 0 ? (
              <div className="text-center py-12 md:py-16 text-slate-500 font-medium text-sm">
                No active gigs exist in the platform registry.
              </div>
            ) : (
              <>
                {/* Desktop view (Tables) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                        <th className="pb-3 pr-4">Service Details</th>
                        <th className="pb-3 px-4">Domain</th>
                        <th className="pb-3 px-4">Seller/Author</th>
                        <th className="pb-3 px-4">Price</th>
                        <th className="pb-3 pl-4 text-right">Delete Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {gigs.map((g) => (
                          <motion.tr
                            key={g.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <img src={g.imageUrl} alt={g.title} className="h-10 w-10 rounded-lg object-cover" />
                                <div className="min-w-0">
                                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block line-clamp-1">{g.title}</span>
                                  <span className="text-[10px] text-slate-440 dark:text-slate-500 font-mono">{g.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                                {g.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{g.sellerName}</td>
                            <td className="py-4 px-4 text-sm font-extrabold text-slate-800 dark:text-white">${g.price}</td>
                            <td className="py-4 pl-4 text-right">
                              <button
                                onClick={() => deleteGig(g.id)}
                                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                title="Delete Gig listing"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet list view */}
                <div className="md:hidden space-y-4">
                  <AnimatePresence>
                    {gigs.map((g) => (
                      <motion.div
                        key={g.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img src={g.imageUrl} alt={g.title} className="h-12 w-12 rounded-lg object-cover shrink-0 select-none" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight select-text">{g.title}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 select-text">{g.id}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-xs">
                          <div>
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">Domain</span>
                            <span className="inline-flex rounded bg-indigo-550/10 dark:bg-indigo-950/40 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
                              {g.category}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">Seller</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block truncate mt-1 select-text">{g.sellerName}</span>
                          </div>

                          <div>
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">Price</span>
                            <span className="text-sm font-extrabold text-slate-800 dark:text-white block mt-1 select-text">${g.price}</span>
                          </div>

                          <div className="flex items-end justify-end">
                            <button
                              onClick={() => deleteGig(g.id)}
                              className="h-9 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 dark:border-rose-950/50 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/25 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer py-1 px-3"
                              title="Delete Gig listing"
                            >
                              <Trash2 className="h-4 w-4 shrink-0" />
                              <span className="text-xs font-bold">Delete Gig</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: USERS LIST */}
        {activeTab === 'users' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
                <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
                <span>Manage current registered users. Note: you cannot delete your own logged-in admin identity.</span>
              </div>
              <button
                onClick={() => setSelectedUserForNotif('ALL')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Bell className="h-4 w-4" />
                Broadcast Global Notification
              </button>
            </div>

            {/* Desktop view (Tables) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="pb-3 pr-4">User Personal Details</th>
                    <th className="pb-3 px-4">System Identity</th>
                    <th className="pb-3 px-4">Joined Date</th>
                    <th className="pb-3 pl-4 text-right">Moderate Account</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((u) => (
                      <motion.tr
                        key={u.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2.5">
                            <AnimeUserProfileIcon name={u.name} />
                            <div>
                              <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block">{u.name}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 ring-1 ring-amber-600/10">
                              <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                              Standard User
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs font-medium text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {u.joinedDate}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUserForNotif(u)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition cursor-pointer"
                              title="Send Notification"
                            >
                              <Bell className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                              title="Moderation delete account"
                              disabled={u.email === 'maliyagigs@gmail.com' || u.id === 'u_admin'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet list view */}
            <div className="md:hidden space-y-4">
              <AnimatePresence>
                {users.map((u) => (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <AnimeUserProfileIcon name={u.name} />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100 block truncate select-text">{u.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate select-text">{u.email}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-xs">
                      <div>
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">Identity</span>
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                            <ShieldAlert className="h-3 w-3 shrink-0" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 mt-1">
                            Standard
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">Joined Date</span>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-455 mt-1 select-text">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {u.joinedDate}
                        </span>
                      </div>

                      <div className="col-span-2 pt-1 flex gap-2">
                        <button
                          onClick={() => setSelectedUserForNotif(u)}
                          className="h-9 flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-100 dark:border-indigo-950/50 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/25 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                          title="Send user notification"
                        >
                          <Bell className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold">Notify</span>
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="h-9 flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 dark:border-rose-950/50 text-rose-600 dark:text-rose-455 bg-rose-50/50 dark:bg-rose-950/25 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-35 disabled:pointer-events-none"
                          title="Moderation delete account"
                          disabled={u.email === 'maliyagigs@gmail.com' || u.id === 'u_admin'}
                        >
                          <Trash2 className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-bold">Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES AUDIT LEDGER */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>General Platform Audits - monitor text transmissions & custom offerings.</span>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 md:py-16 text-slate-500 font-medium text-sm">
                No custom inquiries made yet in this session.
              </div>
            ) : (
              <>
                {/* Desktop view (Tables) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                        <th className="pb-3 pr-4">Details / Timestamp</th>
                        <th className="pb-3 px-4">Service Scope</th>
                        <th className="pb-3 px-4">Buyer Connection</th>
                        <th className="pb-3 px-4">Assigned Seller</th>
                        <th className="pb-3 pl-4 text-right">Custom Offer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq) => (
                        <tr
                          key={inq.id}
                          className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-4 pr-4">
                            <div>
                              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-350 block">{inq.id}</span>
                              <span className="text-[10px] text-slate-440 dark:text-slate-500">{new Date(inq.createdAt).toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-350">{inq.gigTitle}</td>
                          <td className="py-4 px-4">
                            <div className="text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-100 block">{inq.buyerName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{inq.buyerEmail}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold text-slate-750 dark:text-slate-300">{inq.sellerName}</td>
                          <td className="py-4 pl-4 text-right">
                            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                              ${inq.proposedBudget}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet list view */}
                <div className="md:hidden space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-350 block select-text">{inq.id}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light select-text">{new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">Offer Budget</span>
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 select-text">${inq.proposedBudget}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 text-xs">
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider mb-1">Service Requested</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug select-text">{inq.gigTitle}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 pt-2.5 text-[11px] border-t border-slate-150 dark:border-slate-800/60">
                        <div>
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Buyer</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100 block mt-0.5 select-text">{inq.buyerName}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block truncate mt-0.5 select-text" title={inq.buyerEmail}>{inq.buyerEmail}</span>
                        </div>

                        <div>
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Assigned Seller</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mt-0.5 select-text truncate">{inq.sellerName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* NOTIFICATION MODAL */}
      <AnimatePresence>
        {selectedUserForNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedUserForNotif(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 z-10"
            >
              <button
                onClick={() => setSelectedUserForNotif(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                <Send className="h-5 w-5 text-indigo-500" />
                Dispatch Notification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {selectedUserForNotif === 'ALL' 
                  ? 'Send a platform-wide system notification to all users.'
                  : `Send a direct alert to ${selectedUserForNotif?.name}.`}
              </p>

              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Notification Subject</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g. Account Alert, Promo Offer..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Message Body</label>
                  <textarea
                    required
                    rows={4}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Provide details for this notification..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:text-white resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={notifSentFeedback}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors mt-2"
                >
                  {notifSentFeedback ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Dispatched Successfully
                    </span>
                  ) : (
                    'Transmitting Notification'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

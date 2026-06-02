import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Shield,
  Users,
  Layout,
  FileText,
  Trash2,
  ShieldAlert,
  BadgeInfo,
  Calendar,
  MessageSquare,
  Mail,
  Bell,
  Send,
  CheckCircle2,
  X,
  Plus,
  Globe,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { animate as anime } from "animejs";

const AnimeUserProfileIcon = ({ name }: { name: string }) => {
  const elRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    anime(elRef.current!, {
      scale: 1.15,
      rotate: "1turn",
      duration: 800,
      easing: "easeOutElastic(1, .5)",
    });
  };

  const handleLeave = () => {
    anime(elRef.current!, {
      scale: 1,
      rotate: "0turn",
      duration: 600,
      easing: "easeOutElastic(1, .5)",
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
  const {
    users,
    gigs,
    inquiries,
    deleteGig,
    deleteUser,
    sendNotification,
    approveSellerApplication,
    rejectSellerApplication,
    projects,
    addProject,
    deleteProject,
    settings,
    updateSettings,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    "listings" | "users" | "inquiries" | "applications" | "web_creations" | "platform_settings"
  >("listings");

  // Platform stats state
  const [paidToSellersInput, setPaidToSellersInput] = useState(settings?.paidToSellersCount?.toString() || "2");
  const [activeBuyersInput, setActiveBuyersInput] = useState(settings?.activeBuyersCount?.toString() || "10");
  const [statsFeedback, setStatsFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Keep inputs in sync if settings changes
  useEffect(() => {
    if (settings) {
      setPaidToSellersInput(settings.paidToSellersCount.toString());
      setActiveBuyersInput(settings.activeBuyersCount.toString());
    }
  }, [settings]);

  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateSettings({
      paidToSellersCount: Number(paidToSellersInput),
      activeBuyersCount: Number(activeBuyersInput)
    });
    setStatsFeedback(res);
    setTimeout(() => setStatsFeedback(null), 3000);
  };

  // Web Creations form state
  const [newProjUrl, setNewProjUrl] = useState("");
  const [formFeedback, setFormFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjUrl.trim()) return;

    // Auto-generate title and description from URL
    let autoTitle = "";
    try {
      const parsedUrl = new URL(newProjUrl.startsWith("http") ? newProjUrl : `https://${newProjUrl}`);
      const hostname = parsedUrl.hostname.replace("www.", "");
      const firstPart = hostname.split(".")[0];
      autoTitle = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
      autoTitle = autoTitle.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    } catch {
      autoTitle = "Showcase Website";
    }

    const autoDesc = "Live client demo showcasing modern full-stack integrations and tailored digital client commerce flows.";

    const res = await addProject(autoTitle, autoDesc, newProjUrl);
    setFormFeedback(res);
    if (res.success) {
      setNewProjUrl("");
    }
    setTimeout(() => setFormFeedback(null), 3000);
  };

  // Send Notification States
  const [selectedUserForNotif, setSelectedUserForNotif] = useState<any>(null);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifSentFeedback, setNotifSentFeedback] = useState(false);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    if (selectedUserForNotif === "ALL") {
      sendNotification(notifTitle, notifMessage); // undefined target implies global
    } else {
      sendNotification(notifTitle, notifMessage, selectedUserForNotif.id);
    }

    setNotifTitle("");
    setNotifMessage("");
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
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 md:p-6 shadow-xl shadow-indigo-900/5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 md:p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-[1.25rem] shrink-0">
            <Users className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans truncate">
              Global Users
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">
              {users.length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 md:p-6 shadow-xl shadow-indigo-900/5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 rounded-[1.25rem] shrink-0">
            <Layout className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans truncate">
              Showcase Gigs
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">
              {gigs.length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 md:p-6 shadow-xl shadow-indigo-900/5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 md:p-4 bg-amber-50 dark:bg-amber-950/40 text-amber-655 dark:text-amber-400 rounded-[1.25rem] shrink-0">
            <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans truncate">
              Client Inquiries
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">
              {inquiries.length}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs - horizontally scrollable without wrapping on mobile */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "listings"
              ? "border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Manage Listings ({gigs.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "users"
              ? "border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Manage Registries ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "inquiries"
              ? "border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Inquiries Log ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex gap-2 items-center ${
            activeTab === "applications"
              ? "border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Seller Applications (
          {users.filter((u) => u.sellerStatus === "pending").length})
        </button>
        <button
          onClick={() => setActiveTab("web_creations")}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "web_creations"
              ? "border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Web Creations ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("platform_settings")}
          className={`pb-3 px-4 md:px-6 font-display font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex gap-2 items-center ${
            activeTab === "platform_settings"
              ? "border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Platform Stats
        </button>
      </div>

      {/* Main interactive lists */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-indigo-900/5 border border-slate-200/80 dark:border-slate-800 min-h-[350px]">
        {/* TAB 5: WEB CREATIONS SHOWCASE MANAGEMENT */}
        {activeTab === "web_creations" && (
          <div className="space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>
                Add or moderate live website showcase previews that render in mini monitors on the visitor landing page.
              </span>
            </div>

            {/* Addition Form Card */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm font-sans">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider mb-4">
                <Plus className="h-4 w-4 text-indigo-500" />
                Add New Showcase Creation
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
                    Live Demo Link URL (https://)
                  </label>
                  <input
                    type="url"
                    required
                    value={newProjUrl}
                    onChange={(e) => setNewProjUrl(e.target.value)}
                    placeholder="e.g., https://ceylonta.onrender.com"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 outline-none focus:border-indigo-500 dark:text-white transition"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-850">
                  {formFeedback && (
                    <span className={`text-xs font-bold ${formFeedback.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {formFeedback.message}
                    </span>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={(e) => handleCreateProject(e as any)}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-lg shadow-indigo-500/10 active:scale-95 transition cursor-pointer"
                  >
                    Publish Website Creation
                  </button>
                </div>
              </div>
            </div>

            {/* Current Creations Registry Table */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Active Creations Archive ({projects.length})
              </h4>
              
              {projects.length === 0 ? (
                <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                  No showcase projects active in database. Add one above to seed registry.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                        <th className="pb-3 pr-4">Website Details</th>
                        <th className="pb-3 px-4">Live URL Address</th>
                        <th className="pb-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {projects.map((p) => (
                          <motion.tr
                            key={p.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition"
                          >
                            <td className="py-4 pr-4 max-w-sm">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white block">
                                  {p.title}
                                </span>
                                <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                                  {p.description}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-mono text-[10px] text-indigo-550 dark:text-indigo-400">
                              <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                <Globe className="h-3.5 w-3.5 shrink-0" />
                                {p.url}
                              </a>
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <button
                                onClick={async () => {
                                  await deleteProject(p.id);
                                }}
                                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-150 dark:border-slate-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                title="Delete Web Showcase"
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
              )}
            </div>
          </div>
        )}

        {/* TAB 6: PLATFORM STATS MANAGEMENT */}
        {activeTab === "platform_settings" && (
          <div className="space-y-8 animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>
                Configure global landing page metrics dynamically. Changes will animate live for all visitors immediately.
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm max-w-xl">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider mb-4">
                <Settings className="h-4 w-4 text-indigo-500" />
                Landing Page Stats Settings
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-slate-450 dark:text-slate-400">
                    Paid To Sellers count (Animated Target value, e.g. 2 for $2M+)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={paidToSellersInput}
                    onChange={(e) => setPaidToSellersInput(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 outline-none focus:border-indigo-500 dark:text-white transition animate-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-slate-450 dark:text-slate-400">
                    Active Buyers count (Animated Target value, e.g. 10 for 10k+)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={activeBuyersInput}
                    onChange={(e) => setActiveBuyersInput(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 outline-none focus:border-indigo-500 dark:text-white transition animate-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-850">
                  {statsFeedback && (
                    <span className={`text-xs font-bold ${statsFeedback.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {statsFeedback.message}
                    </span>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={(e) => handleUpdateStats(e as any)}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-lg shadow-indigo-500/10 active:scale-95 transition cursor-pointer font-sans"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SELLER APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>
                Review pending applications from users who want to become
                sellers.
              </span>
            </div>

            {users.filter((u) => u.sellerStatus === "pending").length === 0 ? (
              <div className="text-center py-12 md:py-24 animate-fade-in">
                <ShieldAlert className="h-10 w-10 md:h-16 md:w-16 mx-auto text-slate-200 dark:text-slate-800 mb-3 md:mb-4" />
                <h3 className="text-sm md:text-lg font-bold text-slate-700 dark:text-slate-300">
                  No Pending Applications
                </h3>
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-2">
                  All seller applications have been processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {users
                  .filter((u) => u.sellerStatus === "pending")
                  .map((u) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <AnimeUserProfileIcon name={u.name} />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-100 block">
                                {u.name}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {u.email}
                              </span>
                            </div>
                          </div>
                          {u.portfolio && (
                            <div className="mt-3 space-y-2">
                              <div>
                                <strong className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
                                  Title
                                </strong>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {u.portfolio.title}
                                </p>
                              </div>
                              <div>
                                <strong className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
                                  Contact
                                </strong>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  Email: {u.portfolio.contactEmail} | Phone:{" "}
                                  {u.portfolio.contactPhone}
                                </p>
                              </div>
                              <div>
                                <strong className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
                                  Links
                                </strong>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {u.portfolio.linkedin && (
                                    <a
                                      href={u.portfolio.linkedin}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-indigo-500 hover:underline mr-3"
                                    >
                                      LinkedIn
                                    </a>
                                  )}
                                  {u.portfolio.businessLink && (
                                    <a
                                      href={u.portfolio.businessLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-indigo-500 hover:underline"
                                    >
                                      Portfolio
                                    </a>
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => approveSellerApplication(u.id)}
                            className="flex-1 md:flex-none px-4 py-2 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectSellerApplication(u.id)}
                            className="flex-1 md:flex-none px-4 py-2 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: GIGS MODERATION LIST */}
        {activeTab === "listings" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>
                As administrator, you can instantly moderate or remove services
                from the platform.
              </span>
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
                                <img
                                  src={g.imageUrl}
                                  alt={g.title}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                                <div className="min-w-0">
                                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block line-clamp-1">
                                    {g.title}
                                  </span>
                                  <span className="text-[10px] text-slate-440 dark:text-slate-500 font-mono">
                                    {g.id}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                                {g.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {g.sellerName}
                            </td>
                            <td className="py-4 px-4 text-sm font-extrabold text-slate-800 dark:text-white">
                              ${g.price}
                            </td>
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
                          <img
                            src={g.imageUrl}
                            alt={g.title}
                            className="h-12 w-12 rounded-lg object-cover shrink-0 select-none"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight select-text">
                              {g.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 select-text">
                              {g.id}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-xs">
                          <div>
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">
                              Domain
                            </span>
                            <span className="inline-flex rounded bg-indigo-550/10 dark:bg-indigo-950/40 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
                              {g.category}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">
                              Seller
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block truncate mt-1 select-text">
                              {g.sellerName}
                            </span>
                          </div>

                          <div>
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">
                              Price
                            </span>
                            <span className="text-sm font-extrabold text-slate-800 dark:text-white block mt-1 select-text">
                              ${g.price}
                            </span>
                          </div>

                          <div className="flex items-end justify-end">
                            <button
                              onClick={() => deleteGig(g.id)}
                              className="h-9 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-100 dark:border-rose-950/50 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/25 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer py-1 px-3"
                              title="Delete Gig listing"
                            >
                              <Trash2 className="h-4 w-4 shrink-0" />
                              <span className="text-xs font-bold">
                                Delete Gig
                              </span>
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
        {activeTab === "users" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
                <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
                <span>
                  Manage current registered users. Note: you cannot delete your
                  own logged-in admin identity.
                </span>
              </div>
              <button
                onClick={() => setSelectedUserForNotif("ALL")}
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
                              <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block">
                                {u.name}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {u.role === "admin" ? (
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
                              disabled={
                                u.role === "admin" ||
                                u.id === "u_admin"
                              }
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
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100 block truncate select-text">
                          {u.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate select-text">
                          {u.email}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-xs">
                      <div>
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">
                          Identity
                        </span>
                        {u.role === "admin" ? (
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
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide font-sans">
                          Joined Date
                        </span>
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
                          disabled={
                            u.role === "admin" ||
                            u.id === "u_admin"
                          }
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
        {activeTab === "inquiries" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-start md:items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
              <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 md:mt-0" />
              <span>
                General Platform Audits - monitor text transmissions & custom
                offerings.
              </span>
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
                              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-350 block">
                                {inq.id}
                              </span>
                              <span className="text-[10px] text-slate-440 dark:text-slate-500">
                                {new Date(inq.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
                            {inq.gigTitle}
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-100 block">
                                {inq.buyerName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {inq.buyerEmail}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs font-semibold text-slate-750 dark:text-slate-300">
                            {inq.sellerName}
                          </td>
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
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-350 block select-text">
                            {inq.id}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light select-text">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">
                            Offer Budget
                          </span>
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 select-text">
                            ${inq.proposedBudget}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 text-xs">
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider mb-1">
                          Service Requested
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug select-text">
                          {inq.gigTitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 pt-2.5 text-[11px] border-t border-slate-150 dark:border-slate-800/60">
                        <div>
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Buyer
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-100 block mt-0.5 select-text">
                            {inq.buyerName}
                          </span>
                          <span
                            className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block truncate mt-0.5 select-text"
                            title={inq.buyerEmail}
                          >
                            {inq.buyerEmail}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Assigned Seller
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mt-0.5 select-text truncate">
                            {inq.sellerName}
                          </span>
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
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedUserForNotif(null)}
            />
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
                {selectedUserForNotif === "ALL"
                  ? "Send a platform-wide system notification to all users."
                  : `Send a direct alert to ${selectedUserForNotif?.name}.`}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">
                    Notification Subject
                  </label>
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
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">
                    Message Body
                  </label>
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
                  type="button"
                  onClick={(e) => handleSendNotification(e as any)}
                  disabled={notifSentFeedback}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors mt-2"
                >
                  {notifSentFeedback ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Dispatched Successfully
                    </span>
                  ) : (
                    "Transmitting Notification"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

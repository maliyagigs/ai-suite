import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SellerPortfolio, Order } from '../types';
import { 
  ShoppingBag, 
  User, 
  Sparkles, 
  Settings, 
  ArrowLeftRight, 
  Check, 
  AlertCircle, 
  Star, 
  Globe, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Save, 
  CheckCircle,
  FileText,
  Video,
  ArrowLeft,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom theme color presets
const THEME_PRESETS = [
  { name: 'Midnight Indigo', class: 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300', value: 'indigo' },
  { name: 'Emerald Sparkle', class: 'border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300', value: 'emerald' },
  { name: 'Amber Sunrise', class: 'border-amber-600 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300', value: 'amber' },
  { name: 'Neon Ocean', class: 'border-cyan-600 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300', value: 'cyan' },
  { name: 'Royal Amethyst', class: 'border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300', value: 'purple' },
  { name: 'Rose Quartz', class: 'border-rose-600 dark:border-rose-400 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300', value: 'rose' },
];

export function ProfilePage() {
  const {
    currentUser,
    users,
    gigs,
    orders = [],
    toggleCategory,
    acceptOrder,
    deliverOrder,
    completeAndRateOrder,
    disputeOrder,
    updateUserProfile,
    updatePortfolio,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'customizations' | 'settings' | 'role'>('orders');

  // Sub-tabs for the Orders & Services view
  const [orderSubTab, setOrderSubTab] = useState<'buyer' | 'seller'>('buyer');

  // Form profile edits
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || 'Passionate Freelancer in continuous technical search.');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [customTheme, setCustomTheme] = useState(currentUser?.customThemeColor || 'indigo');
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form portfolio edits (for seller view)
  const [pTitle, setPTitle] = useState(currentUser?.portfolio?.title || 'Expert Agency Service Professional');
  const [pDesc, setPDesc] = useState(currentUser?.portfolio?.description || 'Experienced consultant offering premium deliverables.');
  const [pSkills, setPSkills] = useState((currentUser?.portfolio?.skills || ['Customer Support', 'Tech Solutions']).join(', '));
  const [pEducation, setPEducation] = useState(currentUser?.portfolio?.education || 'Self-Employed Expert');
  const [pLinkedin, setPLinkedin] = useState(currentUser?.portfolio?.linkedin || '');
  const [pBusiness, setPBusiness] = useState(currentUser?.portfolio?.businessLink || '');
  const [pContactEmail, setPContactEmail] = useState(currentUser?.portfolio?.contactEmail || currentUser?.email || '');
  const [pContactPhone, setPContactPhone] = useState(currentUser?.portfolio?.contactPhone || '');
  const [portfolioSaveStatus, setPortfolioSaveStatus] = useState<string | null>(null);

  // Dynamic styling helpers to ensure perfect text accessibility contrast in dark and light modes
  const getAccentBgClass = () => {
    switch (customTheme) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white';
      case 'amber': return 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white';
      case 'cyan': return 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white';
      default: return 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-605 text-white';
    }
  };

  const getAccentTextClass = () => {
    switch (customTheme) {
      case 'emerald': return 'text-emerald-600 dark:text-emerald-400';
      case 'amber': return 'text-amber-600 dark:text-amber-400';
      case 'cyan': return 'text-cyan-600 dark:text-cyan-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'rose': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-indigo-600 dark:text-indigo-400';
    }
  };

  const getAccentClasses = (isActive: boolean) => {
    if (isActive) {
      switch (customTheme) {
        case 'emerald': return 'bg-emerald-600 text-white shadow-md shadow-emerald-550/10';
        case 'amber': return 'bg-amber-500 text-white shadow-md shadow-amber-550/10';
        case 'cyan': return 'bg-cyan-600 text-white shadow-md shadow-cyan-550/10';
        case 'purple': return 'bg-purple-600 text-white shadow-md shadow-purple-550/10';
        case 'rose': return 'bg-rose-600 text-white shadow-md shadow-rose-550/10';
        default: return 'bg-indigo-600 text-white shadow-md shadow-indigo-550/15';
      }
    } else {
      return 'text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/60';
    }
  };

  const getPresetStyle = (presetValue: string, isSelected: boolean) => {
    if (isSelected) {
      switch (presetValue) {
        case 'emerald': return 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-555/20';
        case 'amber': return 'border-amber-450 dark:border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 ring-2 ring-amber-555/20';
        case 'cyan': return 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-900 dark:text-cyan-300 ring-2 ring-cyan-555/20';
        case 'purple': return 'border-purple-500 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300 ring-2 ring-purple-555/20';
        case 'rose': return 'border-rose-500 dark:border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 ring-2 ring-rose-555/20';
        default: return 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 ring-2 ring-indigo-555/20';
      }
    } else {
      return 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40';
    }
  };

  // Order action popup/expansion states (from Buyer Dashboard)
  const [activeRateOrderId, setActiveRateOrderId] = useState<string | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState("");
  const [activeDisputeOrderId, setActiveDisputeOrderId] = useState<string | null>(null);
  const [disputeReasonMsg, setDisputeReasonMsg] = useState("");

  if (!currentUser) {
    return (
      <div className="py-20 text-center text-slate-500 italic">
        Please register or log in to view and customize your account profile.
      </div>
    );
  }

  // Handle standard settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await updateUserProfile({
        name,
        email,
        bio,
        avatarUrl,
        customThemeColor: customTheme
      });
      setSaveStatus(res);
      if (res.success) {
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      setSaveStatus({ success: false, message: 'Server synchronization failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle seller portfolio update
  const handlePortfolioUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPortfolioSaveStatus("Synchronizing portfolio...");
    const skillsArray = pSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated: SellerPortfolio = {
      title: pTitle,
      description: pDesc,
      skills: skillsArray,
      education: pEducation,
      linkedin: pLinkedin,
      businessLink: pBusiness,
      contactEmail: pContactEmail,
      contactPhone: pContactPhone,
    };

    updatePortfolio(updated);
    setTimeout(() => {
      setPortfolioSaveStatus("Portfolio saved successfully! ✓");
      setTimeout(() => setPortfolioSaveStatus(null), 2500);
    }, 800);
  };

  const getThemeBadgeClass = () => {
    const currentPreset = THEME_PRESETS.find(p => p.value === customTheme);
    return currentPreset ? currentPreset.class : THEME_PRESETS[0].class;
  };

  const isSellerApproved = currentUser.category === 'seller' && currentUser.sellerStatus === 'approved';  return (
    <div className="max-w-6xl mx-auto py-8 px-2 space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
      
      {/* Premium Exit Navigation Block */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-305 hover:bg-slate-105 dark:hover:bg-slate-800 cursor-pointer shadow-sm transition active:scale-95"
          title="Return back to finding premium services"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Profile & Back to Buyer Page
        </button>
      </div>

      {/* Visual Identity Brief Header Banner */}
      <div className={`p-6 md:p-8 rounded-[2.5rem] border ${getThemeBadgeClass()} shadow-2xl relative overflow-hidden transition-all duration-300`}>
        <div className="absolute top-[-30%] right-[-5%] w-[40%] h-[160%] rounded-full bg-gradient-to-tr from-white/10 to-transparent dark:from-white/5 pointer-events-none transform rotate-45" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-15">
          <div className="relative group">
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-indigo-600 text-white font-display text-4xl font-extrabold flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                {currentUser.name[0].toUpperCase()}
              </div>
            )}
            <button 
              onClick={() => setActiveTab('customizations')} 
              className="absolute -bottom-2 -right-2 bg-slate-900 text-white rounded-xl p-1.5 shadow border border-slate-750 scale-90 hover:scale-100 transition cursor-pointer"
              title="Edit Avatar Photo"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-center md:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                {currentUser.name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-current`}>
                {currentUser.category}
              </span>
            </div>
            
            <p className="text-xs max-w-xl text-slate-705 dark:text-slate-300 italic font-medium leading-relaxed">
              "{currentUser.bio || bio}"
            </p>

            <div className="text-[11px] font-mono font-semibold text-slate-500 flex items-center justify-center md:justify-start gap-4">
              <span>Member Since: {currentUser.joinedDate}</span>
              <span>•</span>
              <span>Account ID: {currentUser.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand Navigation rail (3-col) */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest block px-3 mb-2">Controls Hub</span>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${getAccentClasses(activeTab === 'orders')}`}
          >
            <ShoppingBag className="h-4 w-4" />
            Orders & Services
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${getAccentClasses(activeTab === 'profile')}`}
          >
            <User className="h-4 w-4" />
            Resume Profile
          </button>

          <button
            onClick={() => setActiveTab('customizations')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${getAccentClasses(activeTab === 'customizations')}`}
          >
            <Sparkles className="h-4 w-4" />
            Customizations
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${getAccentClasses(activeTab === 'settings')}`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          <button
            onClick={() => setActiveTab('role')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${getAccentClasses(activeTab === 'role')}`}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Switch Working Role
          </button>
        </div>

        {/* Right Hand Active Tab Arena (9-col) */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            
            {/* TAB: ORDERS & COMMISSIONS */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Switcher within My Orders */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] space-y-6">
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-indigo-600" />
                        My Orders & Active Commissions Tracker
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Interact with active development channels, view deliverables, or report issues/disputes.
                      </p>
                    </div>

                    {/* Role sub filter */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => setOrderSubTab('buyer')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                          orderSubTab === 'buyer' 
                            ? `bg-white dark:bg-slate-700 ${getAccentTextClass()} shadow-sm` 
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Client (Buyer)
                      </button>
                      <button
                        onClick={() => setOrderSubTab('seller')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                          orderSubTab === 'seller' 
                            ? `bg-white dark:bg-slate-700 ${getAccentTextClass()} shadow-sm` 
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Freelancer (Seller)
                      </button>
                    </div>
                  </div>

                  {/* BUYER COMMISSIONS PANEL */}
                  {orderSubTab === 'buyer' ? (
                    <div className="space-y-4">
                      {orders.filter((o) => o.buyerId === currentUser.id).length === 0 ? (
                        <div className="text-center py-12 text-slate-400 italic text-xs">
                          No service commissions or active order transactions placed yet as a Buyer.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {orders
                            .filter((o) => o.buyerId === currentUser.id)
                            .map((ord) => (
                              <div
                                key={ord.id}
                                className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between space-y-4"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                                      Order ID: {ord.id}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                                      ord.status === 'completed'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                                        : ord.status === 'delivered'
                                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                                        : ord.status === 'in_progress'
                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                                        : ord.status === 'disputed'
                                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                                    }`}>
                                      {ord.status.replace('_', ' ')}
                                    </span>
                                  </div>

                                  <div>
                                    <h4 className="font-extrabold text-sm text-slate-850 dark:text-white line-clamp-1">
                                      {ord.gigTitle}
                                    </h4>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                      <span>Seller: <strong>{ord.sellerName}</strong></span>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-semibold">Total Price Paid:</span>
                                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                                      ${ord.price}
                                    </span>
                                  </div>
                                </div>

                                {/* Actions buyer side */}
                                <div className="pt-3 border-t border-slate-150 dark:border-slate-800/40 space-y-2">
                                  {ord.status === 'pending_seller' && (
                                    <div className="text-[11px] text-slate-400 italic">⏳ Waiting for Seller to accept order.</div>
                                  )}

                                  {ord.status === 'in_progress' && (
                                    <div className="space-y-2">
                                      <div className="text-[11px] text-amber-600 font-bold">🔨 Development in progress!</div>
                                      {activeDisputeOrderId !== ord.id ? (
                                        <button
                                          onClick={() => {
                                            setActiveDisputeOrderId(ord.id);
                                            setActiveRateOrderId(null);
                                            setDisputeReasonMsg("");
                                          }}
                                          className="text-[10px] uppercase font-bold text-rose-500 hover:underline cursor-pointer"
                                        >
                                          ⚠️ Dispute / File Issue
                                        </button>
                                      ) : (
                                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-820 space-y-2">
                                          <textarea
                                            rows={2}
                                            placeholder="Explain the technical issue..."
                                            value={disputeReasonMsg}
                                            onChange={(e) => setDisputeReasonMsg(e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-350"
                                          />
                                          <div className="flex justify-end gap-2 text-xs">
                                            <button onClick={() => setActiveDisputeOrderId(null)} className="px-2 py-0.5 bg-slate-205 dark:bg-slate-800 rounded">Cancel</button>
                                            <button 
                                              disabled={!disputeReasonMsg.trim()}
                                              onClick={() => {
                                                disputeOrder(ord.id, disputeReasonMsg);
                                                setActiveDisputeOrderId(null);
                                              }}
                                              className="px-2 py-0.5 bg-rose-600 text-white rounded"
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {ord.status === 'delivered' && (
                                    <div className="space-y-2">
                                      <p className="text-[11px] text-indigo-655 font-bold">🎉 Deliverables submitted!</p>
                                      {activeRateOrderId !== ord.id ? (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              setActiveRateOrderId(ord.id);
                                              setRatingVal(5);
                                              setRatingComment("");
                                            }}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                                          >
                                            Approve & Rate
                                          </button>
                                          <button
                                            onClick={() => setActiveDisputeOrderId(ord.id)}
                                            className="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-lg font-bold"
                                          >
                                            Dispute
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-2">
                                          <div className="flex gap-1.5">
                                            {[1,2,3,4,5].map(s => (
                                              <button key={s} onClick={() => setRatingVal(s)}>
                                                <Star className={`w-5 h-5 ${s <= ratingVal ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                                              </button>
                                            ))}
                                          </div>
                                          <textarea
                                            placeholder="Write a feedback comment..."
                                            value={ratingComment}
                                            onChange={(e) => setRatingComment(e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border bg-white dark:bg-slate-900"
                                          />
                                          <div className="flex justify-end gap-1.5 text-xs">
                                            <button onClick={() => setActiveRateOrderId(null)} className="px-2 py-0.5 bg-slate-205 dark:bg-slate-700 rounded">Cancel</button>
                                            <button
                                              onClick={() => {
                                                completeAndRateOrder(ord.id, ratingVal, ratingComment);
                                                setActiveRateOrderId(null);
                                              }}
                                              className="px-2.5 py-0.5 bg-indigo-600 text-white rounded font-bold"
                                            >
                                              Confirm Complete
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {ord.status === 'completed' && (
                                    <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-2 text-[11px] rounded border border-emerald-100/20">
                                      <p className="text-emerald-700 font-bold">✓ Rated & Completed</p>
                                      {ord.ratingComment && <p className="text-slate-500 mt-1 italic">"{ord.ratingComment}"</p>}
                                    </div>
                                  )}

                                  {ord.status === 'disputed' && (
                                    <div className="bg-rose-50/40 dark:bg-rose-950/20 p-2 text-[11px] rounded border border-rose-100/20">
                                      <p className="text-rose-600 font-bold">⚠️ Disputed / Under mediation</p>
                                      <p className="text-slate-500 italic">"Reason: {ord.disputeReason}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* SELLER COMMISSIONS PANEL */
                    <div className="space-y-4">
                      {orders.filter((o) => o.sellerId === currentUser.id).length === 0 ? (
                        <div className="text-center py-12 text-slate-400 italic text-xs">
                          No service commissions have been placed on your catalog listings yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders
                            .filter((o) => o.sellerId === currentUser.id)
                            .map((ord) => (
                              <div
                                key={ord.id}
                                className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 workspace-comms"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">PROJECT ORDER</span>
                                    <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">
                                      {ord.gigTitle}
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">Client ID: {ord.buyerName}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-[#10b981]">${ord.price}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                      ord.status === 'completed' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-650'
                                    }`}>
                                      {ord.status}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2 border-t border-slate-150 dark:border-slate-800/40 pt-3">
                                  {ord.status === 'pending_seller' && (
                                    <button
                                      onClick={() => acceptOrder(ord.id)}
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                                    >
                                      ✓ Accept Commission
                                    </button>
                                  )}

                                  {ord.status === 'in_progress' && (
                                    <button
                                      onClick={() => deliverOrder(ord.id)}
                                      className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                                    >
                                      ⚡ Complete & Deliver Outputs
                                    </button>
                                  )}

                                  {ord.status === 'delivered' && (
                                    <div className="text-[11px] text-indigo-500 italic font-medium">Deliverables dispatched, waiting review.</div>
                                  )}

                                  {ord.status === 'completed' && (
                                    <div className="w-full text-xs">
                                      <p className="font-bold text-emerald-600">✓ Finished Contract</p>
                                      {ord.ratingComment && <p className="text-slate-500 italic">" {ord.ratingComment} "</p>}
                                    </div>
                                  )}

                                  {ord.status === 'disputed' && (
                                    <div className="w-full text-xs text-rose-600 bg-rose-50/20 p-2.5 rounded border border-rose-100/20">
                                      <p className="font-bold">⚠️ Client Filed Dispute</p>
                                      <p className="italic text-slate-400 mt-1">"{ord.disputeReason}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* TAB: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Unified Buyer & Seller profiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Buyer Profile details Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base">Buyer Working Card</h4>
                        <p className="text-[10px] text-slate-400">Your specifications when purchasing talents</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Bio Summary</span>
                        <p className="mt-1 text-slate-705 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-xl italic">
                          "{currentUser.bio || 'Your client bio is empty. Set it inside Settings tab.'}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Real Name</span>
                          <span className="text-slate-850 dark:text-white font-semibold mt-1 block">{currentUser.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Email Address</span>
                          <span className="text-slate-850 dark:text-white font-semibold mt-1 block select-all">{currentUser.email}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-sans">Domain Category Preference</span>
                        <span className="mt-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold rounded-lg inline-block">
                          Direct Client Checkout Mode ({currentUser.category})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Portfolio details Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-[2rem] space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-extrabold text-base">Seller Portfolio Card</h4>
                            <p className="text-[10px] text-slate-400">Your visibility credentials on MelAgent lists</p>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                          currentUser.sellerStatus === 'approved' 
                            ? 'bg-emerald-50/50 border-emerald-250 text-emerald-600' 
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          {currentUser.sellerStatus || 'None'}
                        </span>
                      </div>

                      {currentUser.portfolio ? (
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Professional Title</span>
                            <span className="text-slate-800 dark:text-white font-bold block mt-0.5">"{currentUser.portfolio.title}"</span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Bio Biography</span>
                            <p className="text-slate-650 dark:text-slate-350 italic mt-0.5 bg-slate-50/50 dark:bg-slate-950/50 p-2 rounded-lg">
                              {currentUser.portfolio.description}
                            </p>
                          </div>

                          {currentUser.portfolio.skills && currentUser.portfolio.skills.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Expertise Tags</span>
                              <div className="flex flex-wrap gap-1">
                                {currentUser.portfolio.skills.map((skill, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] border border-emerald-100/30">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Background Info</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentUser.portfolio.education}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Inbound Phone</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentUser.portfolio.contactPhone || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-400 italic text-xs">
                          You haven't initialized your updatable seller portfolio yet. Start below.
                        </div>
                      )}
                    </div>

                    {isSellerApproved && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40">
                        <button
                          onClick={() => {
                            setActiveTab('settings');
                            setTimeout(() => {
                              const el = document.getElementById('portfolio-editor-section');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-xs cursor-pointer"
                        >
                          Modify Portfolio Details
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB: CUSTOMIZATIONS */}
            {activeTab === 'customizations' && (
              <motion.div
                key="customizations-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] space-y-8"
              >
                <div>
                  <h3 className="font-display text-lg font-bold flex items-center gap-2">
                    <Sparkles className={`h-5 w-5 ${getAccentTextClass()}`} />
                    Theme & Profile Styling Aesthetics
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Fine-tune your visual identity on MelAgent lists. Upload a custom profile picture and select custom color themes.
                  </p>
                </div>

                {/* Custom Base64 Avatar Upload */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-white block">A: Profile Photo</span>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="relative shrink-0">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Custom Avatar" 
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-605 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 font-display text-2xl font-bold flex items-center justify-center border-2 border-dashed border-indigo-300">
                          {currentUser.name[0].toUpperCase()}
                        </div>
                      )}
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl('');
                            setSaveStatus({ success: true, message: 'Custom profile photo cleared. Please click "Save All Customizations" to commit.' });
                          }}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 transition cursor-pointer"
                          title="Remove Photo"
                        >
                          <span className="text-[10px] font-bold px-1.5 py-0.5">✕</span>
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        Drag & drop your custom profile picture, or click below to select a file
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Supports standard PNG, JPG, or WEBP formats (Max file size: 2MB)
                      </p>
                      <label className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition shadow active:scale-95 ${getAccentBgClass()}`}>
                        <UploadCloud className="h-3.5 w-3.5" />
                        Upload Custom Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                setSaveStatus({ success: false, message: 'Selected image exceeds safety limit of 2MB.' });
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                const result = reader.result as string;
                                setAvatarUrl(result);
                                setSaveStatus({ success: true, message: 'Photo loaded successfully! Click "Save All Customizations" to commit changes.' });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Theme profile customization */}
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <span className="text-xs font-bold text-slate-700 dark:text-white block">B: Profile Theme Card Hue</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          setCustomTheme(preset.value);
                          setSaveStatus({ success: true, message: `Card Hue changed to "${preset.name}". Click "Save All Customizations" to apply!` });
                        }}
                        className={`p-3.5 rounded-xl border-2 text-left transition hover:scale-[1.01] cursor-pointer flex flex-col justify-between h-20 ${getPresetStyle(preset.value, customTheme === preset.value)}`}
                      >
                        <span className="text-xs font-bold block">{preset.name}</span>
                        <div className="flex gap-1 items-center mt-1">
                          <div className={`w-3.5 h-3.5 rounded-full border border-current ${preset.class}`} />
                          <span className="text-[10px] font-medium opacity-80 uppercase">Apply Hue</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex-1">
                    {saveStatus && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 max-w-md ${
                        saveStatus.success ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-350'
                      }`}>
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span className="font-semibold">{saveStatus.success ? 'Saved successfully ✓' : saveStatus.message}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow active:scale-95 ${getAccentBgClass()}`}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save All Customizations'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Section A: Core Settings */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-indigo-600" />
                      Core Account Details Setup
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Setup your primary username and credentials. These are used across communications & checkout logs.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">
                          Core Account Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">
                          Primary Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">
                        Professional Bio / Client Intro Headline
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent text-slate-850 dark:text-white resize-none"
                      />
                    </div>

                    {saveStatus && (
                      <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                        saveStatus.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-850'
                      }`}>
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>{saveStatus.message}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving Configurations...' : 'Save Core Details'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Section B: Portfolio Editor (Only if Approved Seller) */}
                {isSellerApproved && (
                  <div id="portfolio-editor-section" className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] space-y-6">
                    <div>
                      <h3 className="font-display text-lg font-bold flex items-center gap-2 text-emerald-600">
                        <Sparkles className="h-5 w-5" />
                        Updatable Professional Seller Portfolio
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Configure the deep career curriculum visible to visitors when querying your listed services.
                      </p>
                    </div>

                    <form onSubmit={handlePortfolioUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">Professional Title Headline</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Expert AI Engineer & React Developer"
                            value={pTitle}
                            onChange={(e) => setPTitle(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">Education & Background</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Self-Taught Expert / Stanford Graduate"
                            value={pEducation}
                            onChange={(e) => setPEducation(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">LinkedIn Profile Link</label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/..."
                            value={pLinkedin}
                            onChange={(e) => setPLinkedin(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">Business Portfolio URL</label>
                          <input
                            type="url"
                            placeholder="https://mywebsite.com"
                            value={pBusiness}
                            onChange={(e) => setPBusiness(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">Direct Contact Phone</label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={pContactPhone}
                            onChange={(e) => setPContactPhone(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">Skills Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="TypeScript, React 19, API Integration"
                          value={pSkills}
                          onChange={(e) => setPSkills(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-505 uppercase tracking-wider mb-1">Professional Portfolio Biography Description</label>
                        <textarea
                          rows={4}
                          value={pDesc}
                          onChange={(e) => setPDesc(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent resize-none"
                        />
                      </div>

                      {portfolioSaveStatus && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-bold">
                          {portfolioSaveStatus}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <Save className="h-4 w-4" />
                          Update Seller Portfolio
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: ROLE SWITCHER */}
            {activeTab === 'role' && (
              <motion.div
                key="role-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] space-y-6"
              >
                <div>
                  <h3 className="font-display text-lg font-bold flex items-center gap-2">
                    <ArrowLeftRight className="h-5 w-5 text-indigo-650" />
                    Buyer vs Seller Profile Role Switch
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Toggle your operational context with one click. Switch modes to modify offerings, explore listings, or verify active commissions.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-slate-400">Current Operational Setting:</span>
                    <h4 className="font-display text-lg font-extrabold text-indigo-600 capitalize">
                      {currentUser.category.toUpperCase()} MODE active
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {currentUser.category === 'buyer' 
                        ? 'Explores freelance catalogs, sends custom inquiries, and places direct platform orders.' 
                        : 'Establishes catalog items, reviews client project communications, and submits deliverables.'}
                    </p>
                  </div>

                  <button
                    onClick={toggleCategory}
                    className="px-6 py-3.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow shadow-indigo-650/15"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Switch working mode to {currentUser.category === 'buyer' ? 'Seller' : 'Buyer'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

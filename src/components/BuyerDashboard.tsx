import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Gig, SellerPortfolio } from '../types';
import { Search, Filter, Compass, CheckCircle2, ShoppingBag, X, Star, Video, FileText, Globe, Linkedin, Mail, Phone, ExternalLink, Send, ArrowUpRight, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { animate as anime } from 'animejs';

const AnimeUserProfileIcon = ({ name }: { name: string }) => {
  const elRef = useRef<HTMLDivElement>(null);
  
  const handleEnter = () => {
    anime(elRef.current!, {
      scale: 1.15,
      rotate: '1turn',
      duration: 800,
      easing: 'easeOutElastic(1, .5)',
    });
  };
  
  const handleLeave = () => {
    anime(elRef.current!, {
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
      className="h-10 w-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-650 font-extrabold text-sm text-white font-display shrink-0 cursor-pointer"
    >
      {name[0]}
    </div>
  );
};

export function BuyerDashboard() {
  const {
    currentUser,
    gigs,
    users,
    inquiries,
    orders,
    submitInquiry,
    submitOrder,
    completeAndRateOrder,
    disputeOrder,
    incrementViews,
    clearInquiries,
    deleteInquiry,
    setActiveView
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price-asc' | 'price-desc'>('relevance');
  const [activeGig, setActiveGig] = useState<Gig | null>(null);

  // Form states for the service inquiry submission
  const [proposedBudget, setProposedBudget] = useState<number>(0);
  const [inquiryMsg, setInquiryMsg] = useState('');
  
  // Checkout/Inquiry validation feedback
  const [inquiryResult, setInquiryResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Order handling states
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  // Inline rating / dispute status expansion states
  const [activeRateOrderId, setActiveRateOrderId] = useState<string | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState("");

  const [activeDisputeOrderId, setActiveDisputeOrderId] = useState<string | null>(null);
  const [disputeReasonMsg, setDisputeReasonMsg] = useState("");

  // Active slideshow index
  const [mediaIdx, setMediaIdx] = useState(0);

  // Seller rating aggregate breakdown analysis helper
  const getSellerRatingAnalysis = (sellerId: string) => {
    const sellerGigs = gigs.filter((g) => g.sellerId === sellerId);
    const sellerCompletedOrders = (orders || []).filter((o) => o.sellerId === sellerId && o.status === "completed" && o.rating);
    const ratings: number[] = [];

    // Prioritize direct order rating outcomes
    sellerCompletedOrders.forEach(o => {
      if (typeof o.rating === "number") ratings.push(o.rating);
    });

    // Fall back to general gig reputation
    sellerGigs.forEach(g => {
      const count = g.ratingCount || 1;
      for (let i = 0; i < count; i++) {
        ratings.push(g.rating !== undefined ? g.rating : 5.0);
      }
    });

    if (ratings.length === 0) {
      return {
        average: 5.0,
        total: 0,
        distribution: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const sum = ratings.reduce((acc, r) => acc + r, 0);
    const avg = Number((sum / ratings.length).toFixed(1));
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    ratings.forEach((val) => {
      const rounded = Math.min(5, Math.max(1, Math.round(val)));
      counts[rounded] = (counts[rounded] || 0) + 1;
    });

    const dist: Record<number, number> = {};
    [1, 2, 3, 4, 5].forEach((num) => {
      dist[num] = Math.round((counts[num] / ratings.length) * 100);
    });

    return {
      average: avg,
      total: ratings.length,
      distribution: dist
    };
  };

  const categories = ['All', 'Development', 'Design', 'AI Services', 'Marketing', 'Writing', 'Video Editing'];

  // Match search parameters
  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort match indexing based on tags, ratings or price
  const sortedAndFilteredGigs = [...filteredGigs].sort((a, b) => {
    if (sortBy === 'rating') {
      const aRating = a.rating !== undefined ? a.rating : 5.0;
      const bRating = b.rating !== undefined ? b.rating : 5.0;
      if (bRating === aRating) {
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      }
      return bRating - aRating;
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    // relevance/default: sort by tag exact matches then defaults
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const aTagMatch = a.tags.some((t) => t.toLowerCase() === q);
      const bTagMatch = b.tags.some((t) => t.toLowerCase() === q);
      if (aTagMatch && !bTagMatch) return -1;
      if (!aTagMatch && bTagMatch) return 1;
    }
    return 0;
  });

  // Handle inquiry dispatch
  const handleSendInquiry = async (e: React.FormEvent, gigId: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInquiryResult(null);

    try {
      const res = await submitInquiry(gigId, proposedBudget || (activeGig?.price ?? 100), inquiryMsg);
      setInquiryResult(res);
      if (res.success) {
        setInquiryMsg('');
        // Increment views counts for seo metrics
        incrementViews(gigId);
      }
    } catch (err) {
      setInquiryResult({ success: false, message: "Network connection failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaceDirectOrder = async () => {
    if (!activeGig) return;
    setIsOrdering(true);
    setOrderResult(null);
    try {
      const priceToUse = proposedBudget || activeGig.price;
      const res = await submitOrder(
        activeGig.id,
        priceToUse,
        activeGig.sellerId,
        activeGig.sellerName,
        activeGig.title
      );
      setOrderResult(res);
      if (res.success) {
        // Increment views counts
        incrementViews(activeGig.id);
        setTimeout(() => {
          setActiveGig(null);
          setOrderResult(null);
        }, 2100);
      }
    } catch (err) {
      setOrderResult({ success: false, message: "Order placement transmission failed." });
    } finally {
      setIsOrdering(false);
    }
  };

  // Find seller object in general platform database for disclosure
  const getSellerInfo = (sellerId: string) => {
    return users.find((u) => u.id === sellerId);
  };

  return (
    <div className="space-y-8 py-6 animate-fade-in text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Search and Hero Spotlight block */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 px-6 py-14 md:px-12 text-white shadow-2xl shadow-indigo-900/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-slate-900 to-indigo-950/20" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-bold text-slate-300 border border-slate-700/50 mb-6">
            <Compass className="h-3.5 w-3.5" />
            Discover Validated Agency Talents
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white mb-6 leading-[1.1] pb-2">
            Find premium freelance services for your custom operations.
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-8">
            <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 pointer-events-none">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search topics (e.g., 'React', 'Branding', 'AI Chatbot')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-white/10 text-white placeholder-slate-400 py-4 pl-14 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/10 shadow-md backdrop-blur-md transition-all hover:bg-white/15"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Row with Sorting controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Filter by Domain
          </h3>
          
          <div className="flex items-center gap-3">
            {/* Sorting dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">SORT BY</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="relevance">Relevance & Tags</option>
                <option value="rating">Highest Ratings</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 dark:text-slate-550 font-bold">
              Showing {sortedAndFilteredGigs.length} Gigs
            </span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide whitespace-nowrap border cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GIG SHOWCASE CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredGigs.length === 0 ? (
          <div className="col-span-full py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-850 text-center px-4">
            <ShoppingBag className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">No services match your criteria</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
              Please try adjusting your query query words, clearing keywords or switching domains above.
            </p>
          </div>
        ) : (
          sortedAndFilteredGigs.map((g) => (
            <motion.div
              key={g.id}
              whileHover={{ y: -4 }}
              onClick={() => {
                setActiveGig(g);
                setProposedBudget(g.price);
                setInquiryMsg('');
                setInquiryResult(null);
                setMediaIdx(0);
              }}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Media banner image */}
              <div className="relative aspect-video w-full bg-slate-50 dark:bg-[#050505] overflow-hidden">
                <img
                  src={g.imageUrl}
                  alt={g.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1 text-[10px] font-extrabold text-slate-800 dark:text-slate-200 tracking-wider">
                  {g.category}
                </span>
                
                {/* PDF/Video badges indicators */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {g.videoUrl && (
                    <span className="rounded bg-rose-650/90 text-white p-1" title="Has intro video">
                      <Video className="h-3 w-3" />
                    </span>
                  )}
                  {g.pdfUrl && (
                    <span className="rounded bg-indigo-650/90 text-white p-1" title="Has PDF documentation">
                      <FileText className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">By {g.sellerName}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {g.rating !== undefined ? g.rating.toFixed(1) : '5.0'}{' '}
                      <span className="text-slate-400 font-normal">
                        ({g.ratingCount !== undefined ? g.ratingCount : (g.views % 12) + 2})
                      </span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-850 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm md:text-base line-clamp-1">
                    {g.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {g.description}
                  </p>

                  {/* Render tag list on card preview */}
                  {g.tags && g.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {g.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono font-bold bg-slate-50 dark:bg-slate-950 text-indigo-500 dark:text-indigo-400 border border-slate-100 dark:border-slate-850 px-1.5 py-0.5 rounded-md"
                        >
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer labels */}
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                    <span>Views: {g.views}</span>
                    <span>Inquiries: {g.inquiryCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold leading-none mb-0.5">STARTING AT</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">${g.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MY ACTIVE COMMISSIONS, ORDERS, AND CONCURRENCIES TRACKER - SECUREMENTS RESERVED FOR PROFILE DETAILS */}
      <section className="hidden bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              My Orders & Service Commissions ({(orders || []).filter((o) => o.buyerId === currentUser?.id).length})
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-505 mt-1">
              Verify service active status, complete deliverables, provide seller ratings, or report disputes.
            </p>
          </div>
        </div>

        {(orders || []).filter((o) => o.buyerId === currentUser?.id).length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 italic text-xs">
            No service commissions or active order transactions placed yet. Select an available service above to proceed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(orders || [])
              .filter((o) => o.buyerId === currentUser?.id)
              .map((ord) => {
                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 dark:text-slate-500">
                          Order ID: {ord.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : ord.status === 'delivered'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30'
                            : ord.status === 'in_progress'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-605 dark:text-amber-400'
                            : ord.status === 'disputed'
                            ? 'bg-rose-550/10 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-850 dark:text-white line-clamp-1">
                          {ord.gigTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-550 dark:text-slate-400">
                          <span>Target Seller: <strong className="text-slate-705 dark:text-slate-300">{ord.sellerName}</strong></span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Total Price Paid:</span>
                        <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                          ${ord.price}
                        </span>
                      </div>
                    </div>

                    {/* ORDER LIFECYCLE ACTION RENDERING */}
                    <div className="pt-3 border-t border-slate-150 dark:border-slate-800/40 space-y-3">
                      {ord.status === 'pending_seller' && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          ⏳ Waiting for Seller to accept order workspace and initiate work.
                        </div>
                      )}

                      {ord.status === 'in_progress' && (
                        <div className="space-y-2">
                          <div className="text-[11.5px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                            🔨 Development is currently in progress!
                          </div>
                          
                          {activeDisputeOrderId !== ord.id ? (
                            <button
                              onClick={() => {
                                setActiveDisputeOrderId(ord.id);
                                setActiveRateOrderId(null);
                                setDisputeReasonMsg("");
                              }}
                              className="text-[10px] uppercase font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              ⚠️ Report Issue / Conflict
                            </button>
                          ) : (
                            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 space-y-3 mt-3 animate-fade-in">
                              <span className="font-bold text-xs text-slate-805 dark:text-white block">Explain the conflict reason:</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="State what issue occurred during this commission workspace..."
                                value={disputeReasonMsg}
                                onChange={(e) => setDisputeReasonMsg(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-850 dark:text-white focus:outline-none"
                              />
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  onClick={() => setActiveDisputeOrderId(null)}
                                  className="px-3 py-1 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  disabled={!disputeReasonMsg.trim()}
                                  onClick={() => {
                                    disputeOrder(ord.id, disputeReasonMsg);
                                    setActiveDisputeOrderId(null);
                                    setDisputeReasonMsg("");
                                  }}
                                  className="px-3 py-1 rounded bg-rose-600 font-bold text-white hover:bg-rose-705 disabled:opacity-40 cursor-pointer"
                                >
                                  Submit Report
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {ord.status === 'delivered' && (
                        <div className="space-y-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                            🎉 Seller delivery uploaded! Review outputs, then choose to Approve & Rate, or notify issue.
                          </div>
                          
                          {activeRateOrderId !== ord.id && activeDisputeOrderId !== ord.id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setActiveRateOrderId(ord.id);
                                  setActiveDisputeOrderId(null);
                                  setRatingVal(5);
                                  setRatingComment("");
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-[11px] transition cursor-pointer"
                              >
                                Accept & Rate Seller
                              </button>
                              <button
                                onClick={() => {
                                  setActiveDisputeOrderId(ord.id);
                                  setActiveRateOrderId(null);
                                  setDisputeReasonMsg("");
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/25 font-bold text-[11px] transition cursor-pointer"
                              >
                                ⚠️ Report Issue
                              </button>
                            </div>
                          )}

                          {activeRateOrderId === ord.id && (
                            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 mt-3 animate-fade-in">
                              <span className="font-bold text-xs text-slate-800 dark:text-white block">Provide Rating Feedback:</span>
                              <div className="flex gap-2.5 items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRatingVal(star)}
                                    className="cursor-pointer transition hover:scale-110 active:scale-95"
                                  >
                                    <Star className={`h-6 w-6 ${star <= ratingVal ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Share review comments about this vendor (optional)..."
                                value={ratingComment}
                                onChange={(e) => setRatingComment(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-850 dark:text-white focus:outline-none"
                              />
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  onClick={() => setActiveRateOrderId(null)}
                                  className="px-3 py-1 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    completeAndRateOrder(ord.id, ratingVal, ratingComment);
                                    setActiveRateOrderId(null);
                                    setRatingComment("");
                                  }}
                                  className="px-3 py-1 rounded bg-indigo-600 font-bold text-white hover:bg-indigo-705 cursor-pointer"
                                >
                                  Submit & Complete
                                </button>
                              </div>
                            </div>
                          )}

                          {activeDisputeOrderId === ord.id && (
                            <div className="p-3.5 rounded-xl bg-slate-105 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 mt-3 animate-fade-in">
                              <span className="font-bold text-xs text-slate-805 dark:text-white block">Conflict / Issue Description:</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="Explain potential issues in detail..."
                                value={disputeReasonMsg}
                                onChange={(e) => setDisputeReasonMsg(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-705 bg-white dark:bg-slate-900 text-slate-850 dark:text-white focus:outline-none"
                              />
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  onClick={() => setActiveDisputeOrderId(null)}
                                  className="px-3 py-1 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  disabled={!disputeReasonMsg.trim()}
                                  onClick={() => {
                                    disputeOrder(ord.id, disputeReasonMsg);
                                    setActiveDisputeOrderId(null);
                                    setDisputeReasonMsg("");
                                  }}
                                  className="px-3 py-1 rounded bg-rose-600 font-extrabold text-white hover:bg-rose-705 disabled:opacity-40 cursor-pointer"
                                >
                                  Submit Report
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {ord.status === 'completed' && (
                        <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/20 dark:border-emerald-900/20 space-y-1.5 text-[11px]">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold block">✓ Commission Completed & Rated</span>
                          {ord.rating && (
                            <div className="flex items-center gap-1 my-0.5">
                              <span className="text-slate-400 font-bold">Your Score:</span>
                              <div className="flex text-amber-500">
                                {Array.from({ length: ord.rating }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                              </div>
                            </div>
                          )}
                          {ord.ratingComment && (
                            <p className="text-slate-600 dark:text-slate-300 italic">"{ord.ratingComment}"</p>
                          )}
                        </div>
                      )}

                      {ord.status === 'disputed' && (
                        <div className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/20 dark:border-rose-900/20 text-[11px] space-y-1">
                          <span className="text-rose-700 dark:text-rose-450 font-bold block">⚠️ Issue Filed / Under Investigation</span>
                          <p className="text-slate-600 dark:text-slate-300 italic">Report details: "{ord.disputeReason}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* MY SENT INQUIRIES WORK HISTORY LIST */}
      {inquiries.filter((inq) => inq.buyerId === currentUser?.id).length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-205 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="font-display text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              My Sent Service Inquiries history ({inquiries.filter((inq) => inq.buyerId === currentUser?.id).length})
            </h3>
            <button
              onClick={clearInquiries}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-550/10 hover:bg-rose-550/15 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-thin border-rose-100 dark:border-rose-950/55 transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Clear Inquiries History
            </button>
          </div>

          <div className="space-y-4">
            {inquiries
              .filter((inq) => inq.buyerId === currentUser?.id)
              .map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-505 dark:text-indigo-400">
                        Service Code: {inq.gigTitle}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">
                        Target Seller Agent: {inq.sellerName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">Proposed Budget</span>
                        <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                          ${inq.proposedBudget}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-605 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition cursor-pointer shrink-0"
                        title="Delete inquiry record"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-605 dark:text-slate-350">
                    "{inq.message}"
                  </div>

                  {inq.sellerResponse && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100/50 dark:border-indigo-900/55 text-xs animate-fade-in space-y-1">
                      <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block">Response proposal from {inq.sellerName}:</span>
                      <p className="text-slate-700 dark:text-slate-300 italic">"{inq.sellerResponse}"</p>
                      {inq.respondedAt && (
                        <span className="block text-[9px] text-slate-405 dark:text-slate-500 pt-1 font-medium">Received: {new Date(inq.respondedAt).toLocaleString()}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-405 dark:text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800/40">
                    <span>Inquiry Sent: {new Date(inq.createdAt).toLocaleDateString()}</span>
                    {inq.sellerResponse ? (
                      <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        Response proposal received
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50/70 dark:bg-slate-800">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Transmitted / Pending Seller
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* COMPREHENSIVE DETAIL MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {activeGig && (() => {
          const sellerObj = getSellerInfo(activeGig.sellerId);
          const portfolio: SellerPortfolio | undefined = sellerObj?.portfolio;

          // Build slideshow list: Main Cover image URL + up to 2 additional screenshots
          const slideshowImages = [activeGig.imageUrl, ...(activeGig.additionalImages || [])].filter(Boolean);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
              
              {/* Semi-transparent Backdrop for Light and Dark backgrounds */}
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setActiveGig(null)} />

              {/* Scrollable Modal Containment Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-100 shadow-2xl shadow-indigo-900/10 border border-slate-200/80 dark:border-slate-800"
              >
                {/* Sticky top Close button */}
                <button
                  onClick={() => setActiveGig(null)}
                  className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-50 hover:text-rose-600 border border-slate-200/60 dark:border-slate-800 cursor-pointer transition-all"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Left/Right splitting panels */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* LEFT SPLIT (Lg:col-span-7): Media and Portfolio description details */}
                  <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-205 dark:border-slate-800/80">
                    
                    {/* Domain label */}
                    <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                      {activeGig.category}
                    </span>

                    {/* Service Title */}
                    <h2 className="font-display text-xl md:text-2xl font-extrabold mt-1.5 text-slate-900 dark:text-white">
                      {activeGig.title}
                    </h2>

                    {/* Slideshow element with next / previous options */}
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200/60 dark:border-slate-800">
                        <img 
                          src={slideshowImages[mediaIdx]} 
                          alt="Showcase slideshow view" 
                          className="h-full w-full object-cover animate-fade-in"
                          key={mediaIdx}
                        />

                        {slideshowImages.length > 1 && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] font-bold text-white">
                            {mediaIdx + 1} / {slideshowImages.length} Screenshots
                          </div>
                        )}
                      </div>

                      {/* Thumbnail indicators */}
                      {slideshowImages.length > 1 && (
                        <div className="flex gap-2">
                          {slideshowImages.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setMediaIdx(index)}
                              className={`h-12 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                mediaIdx === index ? 'border-indigo-600 scale-[1.03]' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt="" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Gig Description content block */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Service overview details
                      </h4>
                      <p className="text-slate-655 dark:text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                        {activeGig.description}
                      </p>
                    </div>

                    {/* Embedded Video Presentation if it exists */}
                    {activeGig.videoUrl && (
                      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Video className="h-4 w-4 text-rose-500 animate-pulse" />
                          Demonstration Video Overview
                        </h4>

                        {/* Embed YouTube or similar */}
                        {activeGig.videoUrl.includes('youtube.com/embed') || activeGig.videoUrl.includes('youtube') ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-950">
                            <iframe 
                              src={activeGig.videoUrl} 
                              title="Intro presentation stream"
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <a
                            href={activeGig.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 rounded-2xl border border-rose-100 dark:border-rose-900/30 text-xs font-bold hover:underline"
                          >
                            <span>Open service overview presentation link</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Attached PDF syllabus or technical documentation */}
                    {activeGig.pdfUrl && (
                      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-indigo-500" />
                          Overview PDF Material Attachment
                        </h4>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-902 border border-slate-150 dark:border-slate-800 hover:border-indigo-200 rounded-2xl transition">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-800 dark:text-white block truncate max-w-xs">{activeGig.pdfName || 'Service_Agreement_Deliverables.pdf'}</span>
                              <span className="text-[10px] text-slate-400 block font-bold font-mono">Attachment details ready</span>
                            </div>
                          </div>

                          <a
                            href={activeGig.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold text-white transition flex items-center gap-1 cursor-pointer"
                          >
                            Open PDF
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* RIGHT SPLIT (Lg:col-span-5): Portfolio Disclosure & Custom Inquiry form */}
                  <div className="lg:col-span-5 p-4 sm:p-6 md:p-8 space-y-6 flex flex-col justify-between">
                    
                    {/* Section: Meet the Seller */}
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Meet the Service Seller</span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <AnimeUserProfileIcon name={activeGig.sellerName} />
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 dark:text-white block text-sm truncate">{activeGig.sellerName}</span>
                            <span className="text-[10px] text-slate-400 block truncate">Joined workspace: {sellerObj?.joinedDate || '2026-01-10'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Portfolio specifications */}
                      {portfolio ? (
                        <div className="space-y-3 mt-2 text-xs">
                          {portfolio.title && (
                            <h5 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-start gap-1">
                              <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                              <span className="select-text">"{portfolio.title}"</span>
                            </h5>
                          )}

                          {portfolio.description && (
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 select-text">
                              "{portfolio.description}"
                            </p>
                          )}

                          {portfolio.skills && portfolio.skills.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Specialist Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {portfolio.skills.map((skill, index) => (
                                  <span key={index} className="rounded-lg bg-indigo-50 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {portfolio.education && (
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Credentials</span>
                              <span className="text-slate-600 dark:text-slate-300 font-medium block select-text">{portfolio.education}</span>
                            </div>
                          )}

                          {/* Social and business linkages */}
                          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/50 min-w-0">
                            {portfolio.linkedin && (
                              <a
                                href={portfolio.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400 font-bold hover:underline text-[11px] min-w-0"
                              >
                                <Linkedin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">LinkedIn Profile Link</span>
                              </a>
                            )}

                            {portfolio.businessLink && (
                              <a
                                href={portfolio.businessLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400 font-bold hover:underline text-[11px] min-w-0"
                              >
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">Business Hub Link</span>
                              </a>
                            )}

                            {portfolio.contactEmail && (
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-semibold min-w-0">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate select-all" title={portfolio.contactEmail}>Direct: {portfolio.contactEmail}</span>
                              </div>
                            )}

                            {portfolio.contactPhone && (
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-semibold min-w-0">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate select-all" title={portfolio.contactPhone}>Phone: {portfolio.contactPhone}</span>
                              </div>
                            )}
                          </div>

                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          This seller has not fully populated his Up-and-Coming resume portfolio yet.
                        </p>
                      )}

                      {/* SELLER RATING ANALYSIS BANNER BLOCK */}
                      <div className="bg-indigo-50/25 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-100 dark:border-indigo-950/45 space-y-3 mt-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block">Seller Rating Analysis</span>
                        {(() => {
                          const anal = getSellerRatingAnalysis(activeGig.sellerId);
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="text-center shrink-0">
                                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 block">{anal.average}</span>
                                  <div className="flex justify-center text-amber-500 my-0.5">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                  </div>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-505 font-bold block">{anal.total} Reviews</span>
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                  {[5, 4, 3, 2, 1].map((stars) => {
                                    const pct = anal.distribution[stars] || 0;
                                    return (
                                      <div key={stars} className="flex items-center gap-2 text-[10px]">
                                        <span className="w-3 text-slate-400 dark:text-slate-500 font-bold text-right">{stars}★</span>
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-505 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="w-6 text-slate-400 dark:text-slate-550 font-semibold text-right">{pct}%</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                    </div>

                    {/* Inquiry & Direct Checkout Submission Form Area */}
                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-slate-500 dark:text-slate-400">Standard Price:</span>
                        <span className="text-base text-slate-900 dark:text-white font-extrabold">${activeGig.price}</span>
                      </div>

                      {inquiryResult && (
                        <div className={`p-4 rounded-2xl flex items-start gap-2.5 border ${
                          inquiryResult.success
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800 text-emerald-850 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-800 text-rose-850 dark:text-rose-450'
                        }`}>
                          <CheckCircle2 className="h-5 w-5 shrink-0" />
                          <div>
                            <span className="font-bold text-xs block">{inquiryResult.success ? 'Inquiry Sent!' : 'Submission Failed'}</span>
                            <span className="text-[10px] leading-tight block mt-0.5">{inquiryResult.message}</span>
                          </div>
                        </div>
                      )}

                      {orderResult && (
                        <div className={`p-4 rounded-2xl flex items-start gap-2.5 border ${
                          orderResult.success
                            ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50 text-indigo-850 dark:text-indigo-400'
                            : 'bg-rose-550/10 dark:bg-rose-950/20 border-rose-500/20 text-rose-600 dark:text-rose-450'
                        }`}>
                          <ShoppingBag className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-xs block">{orderResult.success ? 'Direct Order Placed!' : 'Order Placement Failed'}</span>
                            <span className="text-[10px] leading-tight block mt-0.5">{orderResult.message}</span>
                          </div>
                        </div>
                      )}

                      <form onSubmit={(e) => handleSendInquiry(e, activeGig.id)} className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            My Proposed Budget (USD)
                          </label>
                          <input
                            type="number"
                            min="5"
                            required
                            value={proposedBudget}
                            onChange={(e) => setProposedBudget(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs font-bold focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            Describe your Custom Request message
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Introduce your project goals, deadlines, or integrations you require..."
                            value={inquiryMsg}
                            onChange={(e) => setInquiryMsg(e.target.value)}
                            className="w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 pt-1">
                          <button
                            type="submit"
                            disabled={isSubmitting || isOrdering || (inquiryResult?.success)}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                          >
                            <Send className="h-3.5 w-3.5" />
                            {isSubmitting ? 'Transmitting Inquiries...' : 'Submit Custom Inquiry'}
                          </button>

                          <button
                            type="button"
                            disabled={isSubmitting || isOrdering || (orderResult?.success)}
                            onClick={handlePlaceDirectOrder}
                            className="w-full py-3 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#059669] hover:brightness-110 text-xs font-extrabold text-white shadow-xl shadow-emerald-500/10 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            {isOrdering ? 'Placing direct order...' : `Place Direct Order ($${proposedBudget || activeGig.price})`}
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>

                </div>

              </motion.div>

            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Store, CheckCircle, Trash2, Layout, Tag, Eye, Image as ImageIcon, Video, FileText, UserPlus, Linkedin, ExternalLink, HelpCircle, Mail, Phone, Bookmark, Zap, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESET_IMAGES = [
  { name: 'Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop' },
  { name: 'Branding/Logo', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop' },
  { name: 'AI Services', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop' },
  { name: 'Writing/Creative', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop' },
  { name: 'Marketing/SEO', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Web Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop' },
];

export function SellerDashboard() {
  const {
    currentUser,
    gigs,
    addGig,
    deleteGig,
    inquiries,
    orders,
    acceptOrder,
    deliverOrder,
    updatePortfolio,
    respondToInquiry
  } = useApp();

  // Active form states
  const [replyInquiryId, setReplyInquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(50);
  const [category, setCategory] = useState('Development');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImage, setCustomImage] = useState('');
  const [customImageName, setCustomImageName] = useState('');

  // Additional media fields
  const [extraImg1, setExtraImg1] = useState('');
  const [extraImg1Name, setExtraImg1Name] = useState('');
  const [extraImg2, setExtraImg2] = useState('');
  const [extraImg2Name, setExtraImg2Name] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoName, setVideoName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');

  // Feedback states
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successGigTitle, setSuccessGigTitle] = useState('');

  // Portfolio form fields (Initialized pre-populated or with defaults)
  const [pTitle, setPTitle] = useState(currentUser?.portfolio?.title || 'Expert Agency Service Professional');
  const [pDesc, setPDesc] = useState(currentUser?.portfolio?.description || 'Experienced consultant offering premium deliverables.');
  const [pSkills, setPSkills] = useState((currentUser?.portfolio?.skills || ['Customer Support', 'Tech Solutions']).join(', '));
  const [pEducation, setPEducation] = useState(currentUser?.portfolio?.education || 'Self-Employed Expert');
  const [pLinkedin, setPLinkedin] = useState(currentUser?.portfolio?.linkedin || '');
  const [pBusiness, setPBusiness] = useState(currentUser?.portfolio?.businessLink || '');
  const [pContactEmail, setPContactEmail] = useState(currentUser?.portfolio?.contactEmail || currentUser?.email || '');
  const [pContactPhone, setPContactPhone] = useState(currentUser?.portfolio?.contactPhone || '');
  
  const [showPortfolioToast, setShowPortfolioToast] = useState(false);

  if (!currentUser) return null;

  // Filter listings belonging to this seller
  const sellerGigs = gigs.filter((g) => g.sellerId === currentUser.id);

  // Filter inquiries belonging to this seller
  const sellerInquiries = inquiries.filter((inq) => inq.sellerId === currentUser.id);

  // Compute live SEO analyzer metric based on current inputs
  const getSEOScore = () => {
    let score = 25; // base price & title state
    let count = 1;
    if (title.length > 20) { score += 15; count++; }
    if (description.length > 100) { score += 15; count++; }
    
    const tags = tagsInput.split(',').filter(Boolean);
    if (tags.length >= 3) { score += 15; count++; }
    
    if (extraImg1 || extraImg2) { score += 15; count++; }
    if (videoUrl) { score += 10; count++; }
    if (pdfUrl) { score += 10; count++; }
    
    return Math.min(score, 100);
  };

  const currentSEOScore = getSEOScore();

  const handlePortfolioUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = pSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updatePortfolio({
      title: pTitle,
      description: pDesc,
      skills: skillsList,
      education: pEducation,
      linkedin: pLinkedin,
      businessLink: pBusiness,
      contactEmail: pContactEmail,
      contactPhone: pContactPhone,
    });

    setShowPortfolioToast(true);
    setTimeout(() => {
      setShowPortfolioToast(false);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || price <= 0) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const finalImage = customImage.trim() ? customImage.trim() : selectedImage;
    const additionalImages = [extraImg1, extraImg2].map((url) => url.trim()).filter(Boolean);

    addGig({
      title,
      description,
      price,
      category,
      tags: tags.length > 0 ? tags : [category],
      imageUrl: finalImage,
      additionalImages,
      videoUrl: videoUrl.trim(),
      videoName: videoName.trim() || undefined,
      pdfUrl: pdfUrl.trim(),
      pdfName: pdfName.trim() || 'Service_Agreement_Deliverables.pdf',
    });

    setSuccessGigTitle(title);
    setShowSuccessToast(true);

    // Reset Form
    setTitle('');
    setDescription('');
    setPrice(50);
    setTagsInput('');
    setCustomImage('');
    setCustomImageName('');
    setExtraImg1('');
    setExtraImg1Name('');
    setExtraImg2('');
    setExtraImg2Name('');
    setVideoUrl('');
    setVideoName('');
    setPdfUrl('');
    setPdfName('');

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 py-6 animate-fade-in text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Visual Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold font-display tracking-tight flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Seller Control Workspace
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Build services, compile an updatable portfolio, coordinate incoming inquiries, and manage SEO visibility.
          </p>
        </div>
      </div>

      {/* Grid: Metrics, Portfolio and SEO Advisory Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Lg:col-span-8): Gig Create Form & Inquiries */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Gig Publishing Area */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-900/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight flex items-center gap-2 text-slate-850 dark:text-white">
                <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                Publish a New Freelance Service
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Primary title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  What service will you offer? (e.g. "I will...")
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. build dynamic SaaS web apps with React, Tailwind and API endpoints"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Category selector & Price Tag input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Service Domain Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>AI Services</option>
                    <option>Marketing</option>
                    <option>Writing</option>
                    <option>Video Editing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Starting price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="5"
                      max="15000"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white pl-8 pr-4 py-3 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description bio deliverables text */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Service deliverables, deliverables, and specs description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail what technical specifications you use, what files are outputted, and how buyers can expect to coordinate work logs."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Search Keywords tags input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Search Keywords & SEO Tags (comma-separated labels)
                </label>
                <span className="block text-[10px] text-slate-400 mb-2">
                  Add 3 to 5 clear labels (e.g. landing page, React, custom AI chatbot).
                </span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4.5 flex items-center text-slate-400">
                    <Tag className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="React, CSS, Frontend, Copywriting"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white pl-11 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Banner selection / Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                  Main Gig Image Artwork (Click a preset or paste custom cover URL)
                </label>

                {/* Grid of Unsplash choices */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => {
                        setSelectedImage(img.url);
                        setCustomImage('');
                      }}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img.url && !customImage
                          ? 'border-indigo-600 scale-[1.03] shadow-inner'
                          : 'border-transparent hover:border-slate-350'
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 py-0.5 px-1 truncate text-[9px] text-white font-medium text-center">
                        {img.name}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    placeholder="Paste custom main image URL if preferred..."
                    value={customImage}
                    onChange={(e) => {
                      setCustomImage(e.target.value);
                      if (e.target.value) setCustomImageName('');
                    }}
                    className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="local-image-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCustomImageName(file.name);
                          const r = new FileReader();
                          r.onloadend = () => {
                            setCustomImage(r.result as string);
                          };
                          r.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="local-image-upload"
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      Upload Image
                    </label>
                  </div>
                </div>
                {customImageName && (
                  <div className="text-[10px] text-emerald-500 font-medium font-mono mt-1">
                    ✓ Uploaded local image: {customImageName}
                  </div>
                )}
              </div>

              {/* Multiple Upload Items row details */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
                <span className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Multiple Gig Assets (Images, Video & Document PDF attachment)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Additional Image 1 */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Additional Image 1</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="Screenshot / work portfolio URL"
                        value={extraImg1}
                        onChange={(e) => {
                          setExtraImg1(e.target.value);
                          if (e.target.value) setExtraImg1Name('');
                        }}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="extra-img1-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setExtraImg1Name(file.name);
                            const r = new FileReader();
                            r.onloadend = () => setExtraImg1(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="extra-img1-upload" className="px-3 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] font-bold text-indigo-500 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer whitespace-nowrap">
                        Upload
                      </label>
                    </div>
                    {extraImg1Name && <p className="text-[9px] text-emerald-500 font-mono mt-1">✓ {extraImg1Name}</p>}
                  </div>

                  {/* Additional Image 2 */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Additional Image 2</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="Alternate graphic preview URL"
                        value={extraImg2}
                        onChange={(e) => {
                          setExtraImg2(e.target.value);
                          if (e.target.value) setExtraImg2Name('');
                        }}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="extra-img2-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setExtraImg2Name(file.name);
                            const r = new FileReader();
                            r.onloadend = () => setExtraImg2(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="extra-img2-upload" className="px-3 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] font-bold text-indigo-500 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer whitespace-nowrap">
                        Upload
                      </label>
                    </div>
                    {extraImg2Name && <p className="text-[9px] text-emerald-500 font-mono mt-1">✓ {extraImg2Name}</p>}
                  </div>

                  {/* Gig Video */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Video className="h-3.5 w-3.5 text-indigo-500" />
                      Gig Video Introduction link
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="e.g. YouTube, Vimeo embed/link"
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          if (e.target.value) setVideoName('');
                        }}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="file"
                        accept="video/*"
                        id="video-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoName(file.name);
                            const blobUrl = URL.createObjectURL(file);
                            setVideoUrl(blobUrl);
                          }
                        }}
                      />
                      <label htmlFor="video-upload" className="px-3 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] font-bold text-indigo-500 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer whitespace-nowrap">
                        Upload
                      </label>
                    </div>
                    {videoName && <p className="text-[9px] text-emerald-500 font-mono mt-1">✓ {videoName}</p>}
                  </div>

                  {/* Gig PDF Overview */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-indigo-500" />
                      Gig Overview PDF Document link
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="PDF URL containing specs or syllabus"
                        value={pdfUrl}
                        onChange={(e) => {
                          setPdfUrl(e.target.value);
                          if (e.target.value) setPdfName('');
                        }}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                      <input
                        type="file"
                        accept="application/pdf"
                        id="pdf-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPdfName(file.name);
                            const r = new FileReader();
                            r.onloadend = () => setPdfUrl(r.result as string);
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="pdf-upload" className="px-3 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-750 text-[11px] font-bold text-indigo-500 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer whitespace-nowrap">
                        Upload
                      </label>
                    </div>
                    {pdfName && <p className="text-[9px] text-emerald-500 font-mono mt-1">✓ {pdfName}</p>}
                  </div>
                </div>

                {pdfUrl && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">PDF File Display Label</label>
                    <input
                      type="text"
                      placeholder="Service_Agreement_Deliverables.pdf"
                      value={pdfName}
                      onChange={(e) => setPdfName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-indigo-100 dark:shadow-none transition cursor-pointer"
              >
                Launch Active Gig to Showcase
              </button>
            </form>
          </section>

          {/* Section 2: Incoming Client Inquiries */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-900/5 mt-8">
            <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight flex items-center gap-2 text-slate-850 dark:text-white mb-8">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Direct Client Inquiries ({sellerInquiries.length})
            </h3>

            {sellerInquiries.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <Bookmark className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  No active inquiries have been received on your gigs yet. Showcase listings to attract requests.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                          Gig Referral: {inq.gigTitle}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                          Sender: {inq.buyerName} ({inq.buyerEmail})
                        </h4>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Proposed Budget</div>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          ${inq.proposedBudget}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-inner">
                      "{inq.message}"
                    </p>

                    {inq.sellerResponse && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100/50 dark:border-indigo-900/55 text-xs animate-fade-in">
                        <span className="font-extrabold text-indigo-700 dark:text-indigo-400 block mb-1">Your response proposal:</span>
                        <p className="text-slate-700 dark:text-slate-300 italic">"{inq.sellerResponse}"</p>
                        {inq.respondedAt && (
                          <span className="block text-[9px] text-slate-400 dark:text-slate-500 mt-2 font-medium">Dispatched on: {new Date(inq.respondedAt).toLocaleString()}</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/45">
                      <span>Submitted: {new Date(inq.createdAt).toLocaleDateString()}</span>
                      {inq.sellerResponse ? (
                        <span className="flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-emerald-700 dark:text-emerald-400 font-bold">
                          <CheckCircle className="h-3 w-3" />
                          RESPONDED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 text-amber-700 dark:text-amber-400 font-bold">
                          PENDING ANSWER
                        </span>
                      )}
                    </div>

                    {!inq.sellerResponse && (
                      <div className="pt-2">
                        {replyInquiryId === inq.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!replyText.trim()) return;
                              respondToInquiry(inq.id, replyText);
                              setReplyInquiryId(null);
                              setReplyText('');
                            }}
                            className="space-y-2.5 animate-fade-in"
                          >
                            <textarea
                              required
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your response proposal, scheduling terms or answers here..."
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white resize-none"
                            />
                            <div className="flex justify-end gap-2 text-xs font-bold">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyInquiryId(null);
                                  setReplyText('');
                                }}
                                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors"
                              >
                                Send Proposal Response
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setReplyInquiryId(inq.id);
                                setReplyText('');
                              }}
                              className="flex items-center gap-1 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-xs font-extrabold text-indigo-700 dark:text-indigo-400 cursor-pointer transition-colors"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Reply / Send Proposal
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* INCOMING COMMISSIONS & PROJECTS WORKSPACE - SECUREMENTS RESERVED FOR CENTRALIZED PROFILE PAGE */}
          <section className="hidden bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-900/5 space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight flex items-center gap-2 text-slate-850 dark:text-white">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                Active Project Commissions ({(orders || []).filter((o) => o.sellerId === currentUser.id).length})
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Manage your service orders, accept workspace contracts, and dispatch final deliverables for client confirmation.
              </p>
            </div>

            {(orders || []).filter((o) => o.sellerId === currentUser.id).length === 0 ? (
              <div className="p-10 text-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 italic text-xs">
                No orders or project commissions have been placed on your service catalog listings yet.
              </div>
            ) : (
              <div className="space-y-4">
                {(orders || [])
                  .filter((o) => o.sellerId === currentUser.id)
                  .map((ord) => {
                    return (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 font-sans">
                          <div>
                            <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-slate-400">
                              Catalog Referral: {ord.gigTitle}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-850 dark:text-white mt-1">
                              Client: {ord.buyerName} ({ord.buyerEmail})
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-2">
                              Budget: ${ord.price}
                            </span>
                            
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                              ord.status === 'completed'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                : ord.status === 'delivered'
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150/30'
                                : ord.status === 'in_progress'
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-500 border border-amber-155/20'
                                : ord.status === 'disputed'
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-150/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}>
                              {ord.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* WORKSPACE ACTIONS */}
                        <div className="pt-3 border-t border-slate-150 dark:border-slate-805 flex justify-end gap-2">
                          {ord.status === 'pending_seller' && (
                            <button
                              onClick={() => acceptOrder(ord.id)}
                              className="px-4 py-2 hover:scale-[1.01] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-md"
                            >
                              ✓ Accept Commission & Claim Work
                            </button>
                          )}

                          {ord.status === 'in_progress' && (
                            <button
                              onClick={() => deliverOrder(ord.id)}
                              className="px-4 py-2 hover:scale-[1.01] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-md"
                            >
                              ⚡ Confirm Delivery (Dispatch Uploads)
                            </button>
                          )}

                          {ord.status === 'delivered' && (
                            <div className="text-xs font-bold text-indigo-505 dark:text-indigo-400 italic bg-indigo-50/20 dark:bg-slate-850 px-3 py-1.5 rounded-lg border border-indigo-100/10">
                              ℹ Deliverables submitted. Waiting on client confirmation & rating review.
                            </div>
                          )}

                          {ord.status === 'completed' && (
                            <div className="w-full text-xs bg-emerald-50/30 dark:bg-slate-855 rounded-xl border border-emerald-100/20 px-4 py-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-[#059669] dark:text-emerald-400">✓ Project Finalized Successfully</span>
                                {ord.rating && (
                                  <div className="flex text-amber-500">
                                    {Array.from({ length: ord.rating }).map((_, idx) => (
                                      <span key={idx}>★</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {ord.ratingComment && (
                                <p className="text-slate-500 dark:text-slate-300 italic">" {ord.ratingComment} "</p>
                              )}
                            </div>
                          )}

                          {ord.status === 'disputed' && (
                            <div className="w-full text-xs bg-rose-50/40 dark:bg-rose-950/25 rounded-xl border border-rose-105 px-4 py-3 space-y-1 text-slate-800 dark:text-slate-300">
                              <span className="font-extrabold text-rose-600 dark:text-rose-400 block animate-pulse">⚠️ Client Dispute / Issue Filed</span>
                              <p className="italic text-slate-500 dark:text-slate-400 text-xs">"{ord.disputeReason}"</p>
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                Resolve with the client directly or contact MelAgent mediation hub.
                              </p>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN (Lg:col-span-4): Updatable Portfolio & Advisory Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section A: Seller Portfolio Editor Widget */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-900/5 space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight flex items-center gap-2 text-slate-850 dark:text-white">
                <UserPlus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                My Seller Portfolio
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Update your biography details, LinkedIn linkages, contact logs, and credentials visible to prospective buyers.
              </p>
            </div>

            <form onSubmit={handlePortfolioUpdate} className="space-y-4">
              
              {/* Professional Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expert AI Engineer & React Developer"
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Bio description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Professional Bio Intro
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Overview of your client history and certifications..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Skills Tags List */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React coding, CSS grids, API tuning"
                  value={pSkills}
                  onChange={(e) => setPSkills(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Education details */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Education & Background
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.S. in Computer Science - Oxford University"
                  value={pEducation}
                  onChange={(e) => setPEducation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Contact Grid fields */}
              <div className="grid grid-cols-1 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Contact & Links Channels
                </span>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Contact Email Address</label>
                  <input
                    type="email"
                    required
                    value={pContactEmail}
                    onChange={(e) => setPContactEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={pContactPhone}
                    onChange={(e) => setPContactPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                    <Linkedin className="h-3 w-3 text-indigo-500" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={pLinkedin}
                    onChange={(e) => setPLinkedin(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3 text-indigo-500" />
                    Business/Portfolio Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourworksite.com"
                    value={pBusiness}
                    onChange={(e) => setPBusiness(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent dark:text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit update */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-750 text-xs font-bold text-white transition cursor-pointer"
              >
                Sync Portfolio Details
              </button>
            </form>
          </section>

          {/* Section B: SEO & Gig Visibility Optimizer Recommendations */}
          <section className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              SEO Visibility Advisor
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We monitor tag parameters and user interactions online. Follow these suggestions to attract the highest volume of client inquiries onto your listings:
            </p>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>Title tag completeness:</b> Keep your title informative with key target terms like "React", "branding" or "copywriter".</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>Additional Screen Samples:</b> Users are <b>3.5x more likely</b> to proceed when you add multiple asset image URLs to your Gig profile.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>Interactive Overview PDF:</b> Upload a detailed pricing guide or work scope syllabus PDF to build baseline customer trust.</span>
              </li>
              <li className="flex items-start gap-2 text-indigo-200 bg-indigo-900/30 p-2 rounded-lg">
                <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><b>Pro-Tip</b>: Fill out all social links (LinkedIn & Phone values) inside the seller profile so buyers can immediately call with confidence.</span>
              </li>
            </ul>
          </section>

          {/* Section C: My Listings quick showcase overview */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-indigo-900/5 mt-6">
            <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-slate-850 dark:text-white mb-6">
              My Service Listings ({sellerGigs.length})
            </h3>

            {sellerGigs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No listings set yet. Create one on the left.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {sellerGigs.map((g) => (
                  <div key={g.id} className="flex gap-3 items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
                    <img src={g.imageUrl} alt="" className="h-10 w-10 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{g.title}</h4>
                      <code className="text-[10px] text-slate-400 font-mono block">Price: ${g.price}</code>
                    </div>
                    <button
                      onClick={() => deleteGig(g.id)}
                      className="p-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 rounded text-slate-400"
                      title="Remove Listing"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </div>

      {/* PORTFOLIO TOAST FEEDBACK */}
      <AnimatePresence>
        {showPortfolioToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-800 rounded-2xl px-5 py-4 shadow-xl ring-1 ring-slate-800"
          >
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="text-xs font-semibold text-slate-350">Profile Update</div>
              <div className="text-sm font-bold">Seller Portfolio Synced!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GIG CREATED TOAST FEEDBACK */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-800 rounded-2xl px-5 py-4 shadow-xl ring-1 ring-slate-800"
          >
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="text-xs font-semibold text-slate-350">Service Active</div>
              <div className="text-sm font-bold truncate max-w-xs">{successGigTitle}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

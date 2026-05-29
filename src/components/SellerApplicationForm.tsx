import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Shield,
  Sparkles,
  Send,
  Briefcase,
  Link,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function SellerApplicationForm() {
  const { currentUser, submitSellerApplication } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [businessLink, setBusinessLink] = useState("");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "");
  const [contactPhone, setContactPhone] = useState("");

  if (currentUser?.sellerStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
        <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white mb-2">
          Application Under Review
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
          Your seller profile application has been received and is currently
          being reviewed by our administrative team. We will notify you once
          it's approved.
        </p>
      </div>
    );
  }

  if (currentUser?.sellerStatus === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
        <div className="h-16 w-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white mb-2">
          Application Not Approved
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
          Unfortunately, your seller profile application was not approved at
          this time. Please contact support for more details.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSellerApplication({
      title,
      description,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      education,
      linkedin,
      businessLink,
      contactEmail,
      contactPhone,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white mb-3">
          Become a Seller
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Complete your professional profile below to offer services on our
          platform. All applications are reviewed by admins to ensure quality.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-500" />
              Professional Info
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Professional Title
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Bio Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers about your expertise, experience, and the value you provide..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white resize-none"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Skills (comma separated)
                </label>
                <input
                  required
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Design, Copywriting"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Education
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="B.S. Computer Science"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
              <Link className="h-4 w-4 text-indigo-500" />
              Links & Contact
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Personal / Business Link
                </label>
                <input
                  type="url"
                  value={businessLink}
                  onChange={(e) => setBusinessLink(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Contact Email
                </label>
                <input
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/25"
          >
            <Send className="h-4 w-4" />
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

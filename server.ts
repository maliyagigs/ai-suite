import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

let cleanFilename = "";
let cleanDirname = "";

try {
  if (typeof import.meta !== "undefined" && import.meta && import.meta.url) {
    cleanFilename = fileURLToPath(import.meta.url);
    cleanDirname = path.dirname(cleanFilename);
  } else {
    cleanFilename = __filename;
    cleanDirname = __dirname;
  }
} catch (e) {
  cleanFilename = typeof __filename !== "undefined" ? __filename : "";
  cleanDirname = typeof __dirname !== "undefined" ? __dirname : "";
}

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "server_db.json");

const cleanVal = (val: string) => {
  let v = val.trim();
  if (v.startsWith('"') && v.endsWith('"')) {
    v = v.slice(1, -1);
  }
  if (v.startsWith("'") && v.endsWith("'")) {
    v = v.slice(1, -1);
  }
  return v.trim();
};

const ADMIN_EMAIL = cleanVal(process.env.ADMIN_EMAIL || "maliyagigs@gmail.com").toLowerCase();
const ADMIN_PASSWORD = cleanVal(process.env.ADMIN_PASSWORD || "g2jabB80");

console.log(`[BOOT] Loaded administrator identity: "${ADMIN_EMAIL}" with key length: ${ADMIN_PASSWORD.length}`);

const googleClient = new OAuth2Client("629111524631-3q4s91g3c69vtqmok0tu1a1io9haonfl.apps.googleusercontent.com");

app.use(express.json());

// Seed data interfaces
interface SellerPortfolio {
  title: string;
  description: string;
  skills: string[];
  education: string;
  linkedin: string;
  businessLink: string;
  contactEmail: string;
  contactPhone: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  category: "buyer" | "seller";
  joinedDate: string;
  portfolio?: SellerPortfolio;
  sellerStatus?: "none" | "pending" | "approved" | "rejected";
  bio?: string;
  avatarUrl?: string;
  customThemeColor?: string;
}

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  sellerId: string;
  sellerName: string;
  imageUrl: string;
  additionalImages?: string[];
  videoUrl?: string;
  videoName?: string;
  pdfUrl?: string;
  pdfName?: string;
  views: number;
  inquiryCount: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  senderName: string;
  targetUserId?: string;
  isRead: boolean;
  createdAt: string;
}

interface Inquiry {
  id: string;
  gigId: string;
  gigTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  proposedBudget: number;
  message: string;
  status: "pending" | "responded" | "archived";
  sellerResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: "pending_seller" | "in_progress" | "delivered" | "completed" | "disputed";
  disputeReason?: string;
  rating?: number;
  ratingComment?: string;
  createdAt: string;
  deliveredAt?: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface SiteSettings {
  paidToSellersCount: number;
  activeBuyersCount: number;
}

interface DatabaseSchema {
  users: User[];
  gigs: Gig[];
  inquiries: Inquiry[];
  orders: Order[];
  notifications: Notification[];
  projects?: Project[];
  settings?: SiteSettings;
}

const ALEX_PORTFOLIO: SellerPortfolio = {
  title: "",
  description: "",
  skills: [],
  education: "",
  linkedin: "",
  businessLink: "",
  contactEmail: "",
  contactPhone: "",
};

const DEFAULT_USERS: User[] = [
  {
    id: "u_admin",
    email: ADMIN_EMAIL,
    name: "Maliya Admin",
    role: "admin",
    category: "buyer",
    joinedDate: "2026-01-01",
  },
  {
    id: "u_alex",
    email: "alex@example.com",
    name: "Alex Rivera",
    role: "user",
    category: "seller",
    joinedDate: "2026-02-01",
    sellerStatus: "approved",
    bio: "Passionate Full-Stack React Developer with 6+ years of commercial experience building SaaS platforms.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    portfolio: {
      title: "Senior Full Stack Architect",
      description: "Providing premium web applications using React, Node.js, and Cloud Infrastructure.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "PostgreSQL"],
      education: "B.Sc. in Computer Science",
      linkedin: "https://linkedin.com/in/alex-rivera-example",
      businessLink: "https://alex-portfolio.example.com",
      contactEmail: "alex@example.com",
      contactPhone: "+1 (555) 019-2834"
    }
  },
  {
    id: "u_sophiachen",
    email: "sophia@example.com",
    name: "Sophia Chen",
    role: "user",
    category: "seller",
    joinedDate: "2026-03-12",
    sellerStatus: "approved",
    bio: "AI Engineer specializing in custom LLM automation, agentic workflows, and semantic search.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    portfolio: {
      title: "Specialist AI Integration Expert",
      description: "Optimizing operations by infusing Gemini models into custom customer workflows.",
      skills: ["Gemini LLM", "Python", "LangChain", "Vector Databases", "Prompt Engineering"],
      education: "M.Sc. in Artificial Intelligence",
      linkedin: "https://linkedin.com/in/sophia-chen-example",
      businessLink: "https://sophia-ai.example.com",
      contactEmail: "sophia@example.com",
      contactPhone: "+1 (555) 024-9183"
    }
  }
];

const DEFAULT_GIGS: Gig[] = [
  {
    id: "g_saas_react",
    title: "Premium React & Tailwind Frontend Application Development",
    description: "Architect and deliver a highly optimized modern React frontend build styled cleanly with Tailwind CSS. Includes custom animation states, pristine mobile responsiveness, and clean component isolation.",
    price: 350,
    category: "Development",
    tags: ["React", "Tailwind CSS", "TypeScript", "Next.js"],
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    imageUrl: "https://images.unsplash.com/photo-1555066935-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    views: 142,
    inquiryCount: 4,
    rating: 4.9,
    ratingCount: 12,
    createdAt: "2026-03-01T12:00:00Z"
  },
  {
    id: "g_ai_agents",
    title: "Custom LLM & Gemini Agentic Integration Pipelines",
    description: "Design and implement custom AI automated workflows powered by the latest Gemini web services. Build semantic search agents, auto-notifiers, classification indices, and safe agent execution pipelines without exposing keys.",
    price: 480,
    category: "AI Services",
    tags: ["AI Services", "Gemini", "Automation", "LLM"],
    sellerId: "u_sophiachen",
    sellerName: "Sophia Chen",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
    views: 215,
    inquiryCount: 8,
    rating: 5.0,
    ratingCount: 9,
    createdAt: "2026-03-15T15:30:00Z"
  },
  {
    id: "g_seo_strategy",
    title: "High-Impact Commercial Search Engine Optimization Audit",
    description: "Comprehensive page audit covering index maps, search rank diagnostics, load latency performance, and full site-wide content strategy proposals to increase organic conversions by up to 2.5x.",
    price: 180,
    category: "Marketing",
    tags: ["SEO", "Marketing", "Audit", "Strategy"],
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    views: 89,
    inquiryCount: 2,
    rating: 4.8,
    ratingCount: 15,
    createdAt: "2026-03-10T09:15:00Z"
  }
];

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq_demo_1",
    gigId: "g_saas_react",
    gigTitle: "Premium React & Tailwind Frontend Application Development",
    buyerId: "u_admin",
    buyerName: "Maliya Admin",
    buyerEmail: ADMIN_EMAIL,
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    proposedBudget: 350,
    message: "Hi Alex, we need a high-end multi-view portfolio template inspired by Space Grotesk. Can we complete this in 5 days?",
    status: "responded",
    sellerResponse: "Hi Maliya! Yes, I can prioritize and deliver this workspace frontend cleanly with fully interactive animations in 4 days. Looking forward!",
    respondedAt: "2026-05-15T14:22:00Z",
    createdAt: "2026-05-14T10:15:00Z"
  },
  {
    id: "inq_demo_2",
    gigId: "g_ai_agents",
    gigTitle: "Custom LLM & Gemini Agentic Integration Pipelines",
    buyerId: "u_admin",
    buyerName: "Maliya Admin",
    buyerEmail: ADMIN_EMAIL,
    sellerId: "u_sophiachen",
    sellerName: "Sophia Chen",
    proposedBudget: 450,
    message: "Hello Sophia, can you build a server proxy for our workspace that automatically parses chemical compounds and files safety reports via Gemini?",
    status: "pending",
    createdAt: "2026-06-01T11:00:00Z"
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "n_welcome",
    title: "Welcome to MelAgent Workspace!",
    message:
      "We are delighted to have you. Find validated freelancers or offer premium listings with high visibility today.",
    senderName: "System Bot",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ord_demo_1",
    gigId: "g_saas_react",
    gigTitle: "Premium React & Tailwind Frontend Application Development",
    price: 350,
    buyerId: "u_admin",
    buyerName: "Maliya Admin",
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    status: "delivered",
    createdAt: "2026-05-20T09:00:00Z",
    deliveredAt: "2026-05-25T17:45:00Z"
  },
  {
    id: "ord_demo_2",
    gigId: "g_seo_strategy",
    gigTitle: "High-Impact Commercial Search Engine Optimization Audit",
    price: 180,
    buyerId: "u_admin",
    buyerName: "Maliya Admin",
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    status: "in_progress",
    createdAt: "2026-05-28T10:30:00Z"
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Cyber Pack Solution",
    description: "Highly secure, multi-layer networking suite designed to audit and defend server clusters autonomously with state-of-the-art diagnostic interfaces.",
    url: "https://janu-cyber-pack.onrender.com/"
  },
  {
    id: "p2",
    title: "Ceylonta Premium Tea",
    description: "Elegant commercial hub bringing premium Grade-A Ceylon organic tea and artisan leaf blends to global buyers with rich storytelling aesthetics.",
    url: "https://ceylonta.onrender.com"
  },
  {
    id: "p3",
    title: "Chem-Pro Assistant Solutions",
    description: "Industrial-grade chemical formulation workspace managing complex compound ratios, testing logs, safety indices, and material ledger sheets.",
    url: "https://chem-pro.appwrite.network/"
  },
  {
    id: "p4",
    title: "Cyber Shield Core Console",
    description: "Enterprise defensive gateway monitoring live intrusion payloads, mapping endpoint traffic routes, and dispatching fast packet countermeasures.",
    url: "https://janu-cyber-pack.onrender.com/"
  },
  {
    id: "p5",
    title: "Ceylon Harvest Trading Network",
    description: "Global export syndicate ledger connecting local tea plantations with bulk distribution partners across active marine lanes.",
    url: "https://ceylonta.onrender.com"
  },
  {
    id: "p6",
    title: "Advanced Formulation Lab Assistant",
    description: "High-accuracy ratio predictor engine analyzing solvent density, temperature variables, and precipitate outcomes in a streamlined canvas interface.",
    url: "https://chem-pro.appwrite.network/"
  }
];

// Helper to load/save JSON DB
function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(raw);
      let needsSave = false;
      if (!db.users || db.users.length === 0) {
        db.users = DEFAULT_USERS;
        needsSave = true;
      }
      if (!db.gigs || db.gigs.length === 0) {
        db.gigs = DEFAULT_GIGS;
        needsSave = true;
      }
      if (!db.inquiries || db.inquiries.length === 0) {
        db.inquiries = DEFAULT_INQUIRIES;
        needsSave = true;
      }
      if (!db.notifications || db.notifications.length === 0) {
        db.notifications = DEFAULT_NOTIFICATIONS;
        needsSave = true;
      }
      if (!db.orders || db.orders.length === 0) {
        db.orders = DEFAULT_ORDERS;
        needsSave = true;
      }
      if (!db.projects || db.projects.length === 0) {
        db.projects = DEFAULT_PROJECTS;
        needsSave = true;
      }
      if (!db.settings) {
        db.settings = { paidToSellersCount: 2, activeBuyersCount: 10 };
        needsSave = true;
      }
      if (needsSave) {
        saveDB(db);
      }
      return db;
    }
  } catch (err) {
    console.error("Error reading database file, using defaults", err);
  }

  // Prepopulate if empty/missing
  const initial: DatabaseSchema = {
    users: DEFAULT_USERS,
    gigs: DEFAULT_GIGS,
    inquiries: DEFAULT_INQUIRIES,
    orders: DEFAULT_ORDERS,
    notifications: DEFAULT_NOTIFICATIONS,
    projects: DEFAULT_PROJECTS,
    settings: { paidToSellersCount: 2, activeBuyersCount: 10 }
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// REST API Endpoints

// GET /api/db - returns the whole data for initial sync
app.get("/api/db", (req, res) => {
  const db = loadDB();
  res.json(db);
});

// GET /api/projects - Get all projects
app.get("/api/projects", (req, res) => {
  const db = loadDB();
  res.json(db.projects || []);
});

// POST /api/projects - Add a new web creation project
app.post("/api/projects", (req, res) => {
  try {
    const { title, description, url } = req.body || {};
    if (!title || !description || !url) {
      return res.status(400).json({ error: "Title, description, and link URL are required." });
    }

    const db = loadDB();
    if (!db.projects) {
      db.projects = [];
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      url: url.trim()
    };

    db.projects.push(newProject);
    saveDB(db);
    res.status(201).json(newProject);
  } catch (err: any) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project: " + err.message });
  }
});

// DELETE /api/projects/:id - Delete a web creation project
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  if (!db.projects) {
    db.projects = [];
  }

  db.projects = db.projects.filter((p) => p.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// POST /api/settings - Update site settings (Admin only)
app.post("/api/settings", (req, res) => {
  try {
    const { paidToSellersCount, activeBuyersCount } = req.body || {};
    const db = loadDB();
    db.settings = {
      paidToSellersCount: paidToSellersCount !== undefined ? Number(paidToSellersCount) : (db.settings?.paidToSellersCount ?? 2),
      activeBuyersCount: activeBuyersCount !== undefined ? Number(activeBuyersCount) : (db.settings?.activeBuyersCount ?? 10)
    };
    saveDB(db);
    res.json({ success: true, settings: db.settings });
  } catch (err: any) {
    console.error("Error saving settings:", err);
    res.status(500).json({ error: "Failed to save settings: " + err.message });
  }
});

// GET /api/gigs - Get all gigs
app.get("/api/gigs", (req, res) => {
  const db = loadDB();
  res.json(db.gigs);
});

// GET /api/users - Get all users
app.get("/api/users", (req, res) => {
  const db = loadDB();
  res.json(db.users);
});

// GET /api/inquiries - Get all inquiries
app.get("/api/inquiries", (req, res) => {
  const db = loadDB();
  res.json(db.inquiries);
});

// GET /api/notifications - Get all notifications
app.get("/api/notifications", (req, res) => {
  const db = loadDB();
  res.json(db.notifications);
});

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, pass, isAdminForm } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = typeof pass === "string" ? pass.trim() : "";
  const isAdminCredentials = cleanEmail === ADMIN_EMAIL && cleanPass === ADMIN_PASSWORD;

  console.log(`[AUTH LOGIN] email: ${cleanEmail}, isAdminForm: ${!!isAdminForm}, matchAdmin: ${isAdminCredentials}`);

  const db = loadDB();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (user) {
    if (cleanEmail === ADMIN_EMAIL && cleanPass !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials for admin entry." });
    }

    if (isAdminCredentials) {
      user.role = "admin";
      saveDB(db);
      return res.json({ success: true, message: "Successfully signed in as Admin!", user });
    }

    saveDB(db);
    return res.json({ success: true, message: "Successfully signed in!", user });
  }

  // Auto register if user doesn't exist
  const name = cleanEmail.split("@")[0];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const newUser: User = {
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: capitalizedName,
    role: isAdminCredentials ? "admin" : "user",
    category: "buyer",
    joinedDate: new Date().toISOString().split("T")[0],
  };

  db.users.push(newUser);
  saveDB(db);

  return res.json({ success: true, message: "New profile registered.", user: newUser });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { name, email, pass, isAdminForm } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = typeof pass === "string" ? pass.trim() : "";
  const isAdminCredentials = cleanEmail === ADMIN_EMAIL && cleanPass === ADMIN_PASSWORD;

  console.log(`[AUTH REGISTER] email: ${cleanEmail}, isAdminForm: ${!!isAdminForm}, matchAdmin: ${isAdminCredentials}`);

  const db = loadDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    // If user exists, default to log in
    if (cleanEmail === ADMIN_EMAIL && cleanPass !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials for admin entry." });
    }
    if (isAdminCredentials) {
      existing.role = "admin";
      saveDB(db);
      return res.json({ success: true, message: "Account already exists, logged in as Admin.", user: existing });
    }
    saveDB(db);
    return res.json({ success: true, message: "Account already exists, logged in.", user: existing });
  }

  const newUser: User = {
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: name?.trim() || cleanEmail.split("@")[0],
    role: isAdminCredentials ? "admin" : "user",
    category: "buyer",
    joinedDate: new Date().toISOString().split("T")[0],
  };

  db.users.push(newUser);
  saveDB(db);

  return res.json({ success: true, message: "Account successfully registered and active.", user: newUser });
});

// POST /api/auth/google
app.post("/api/auth/google", async (req, res) => {
  const { credential, isAdminForm } = req.body;
  if (!credential) {
    return res.status(400).json({ success: false, message: "Missing Google credential" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: "629111524631-3q4s91g3c69vtqmok0tu1a1io9haonfl.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
       return res.status(400).json({ success: false, message: "Invalid Google token payload" });
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    const name = payload.name || cleanEmail.split("@")[0];
    const isAdminAccount = cleanEmail === ADMIN_EMAIL;

    const db = loadDB();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (user) {
      if (isAdminAccount) {
        user.role = "admin";
        saveDB(db);
        return res.json({ success: true, message: "Successfully signed in with Google as Admin!", user });
      }
      saveDB(db);
      return res.json({ success: true, message: "Successfully signed in with Google!", user });
    }

    // Auto register if user doesn't exist
    const newUser: User = {
      id: `u_${Date.now()}`,
      email: cleanEmail,
      name: name,
      role: isAdminAccount ? "admin" : "user",
      category: "buyer",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    db.users.push(newUser);
    saveDB(db);

    return res.json({ success: true, message: "New profile registered via Google.", user: newUser });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(401).json({ success: false, message: "Invalid Google credential" });
  }
});

// POST /api/gigs - add a gig
app.post("/api/gigs", (req, res) => {
  const { title, description, price, category, tags, sellerId, sellerName, imageUrl, additionalImages, videoUrl, videoName, pdfUrl, pdfName } = req.body;

  if (!title || !price || !sellerId) {
    return res.status(400).json({ error: "Missing required core fields" });
  }

  const db = loadDB();
  const newGig: Gig = {
    id: `g_${Date.now()}`,
    title,
    description,
    price: Number(price),
    category: category || "Development",
    tags: tags || [],
    sellerId,
    sellerName,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    additionalImages: additionalImages || [],
    videoUrl: videoUrl || "",
    videoName: videoName || "",
    pdfUrl: pdfUrl || "",
    pdfName: pdfName || "",
    views: 0,
    inquiryCount: 0,
    rating: 5.0,
    ratingCount: 1,
    createdAt: new Date().toISOString().split("T")[0],
  };

  db.gigs.unshift(newGig);
  saveDB(db);

  res.json({ success: true, gig: newGig });
});

// POST /api/gigs/:id/view - increment gig views
app.post("/api/gigs/:id/view", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.gigs = db.gigs.map((g) => {
    if (g.id === id) {
      return { ...g, views: g.views + 1 };
    }
    return g;
  });
  saveDB(db);
  res.json({ success: true });
});

// POST /api/gigs/:id/rate - rate a gig
app.post("/api/gigs/:id/rate", (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating" });
  }

  const db = loadDB();
  db.gigs = db.gigs.map((g) => {
    if (g.id === id) {
      const newCount = g.ratingCount + 1;
      const newRating = Number(((g.rating * g.ratingCount + rating) / newCount).toFixed(1));
      return { ...g, rating: newRating, ratingCount: newCount };
    }
    return g;
  });
  saveDB(db);
  res.json({ success: true });
});

// DELETE /api/gigs/:id - delete gig
app.delete("/api/gigs/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.gigs = db.gigs.filter((g) => g.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// DELETE /api/users/:id - delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.users = db.users.filter((u) => u.id !== id);
  db.gigs = db.gigs.filter((g) => g.sellerId !== id);
  saveDB(db);
  res.json({ success: true });
});

// POST /api/portfolio - update portfolio / apply as seller
app.post("/api/portfolio", (req, res) => {
  const { userId, portfolio, sellerStatus, category } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const db = loadDB();
  db.users = db.users.map((u) => {
    if (u.id === userId) {
      const updated: User = { ...u };
      if (portfolio !== undefined) updated.portfolio = portfolio;
      if (sellerStatus !== undefined) updated.sellerStatus = sellerStatus;
      if (category !== undefined) updated.category = category;
      return updated;
    }
    return u;
  });
  saveDB(db);

  const updatedUser = db.users.find((u) => u.id === userId);
  res.json({ success: true, user: updatedUser });
});

// POST /api/user/update - General endpoint for profile details, customizations, and settings
app.post("/api/user/update", (req, res) => {
  const { userId, name, email, bio, avatarUrl, customThemeColor, category } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const db = loadDB();
  db.users = db.users.map((u) => {
    if (u.id === userId) {
      const updated = { ...u };
      if (name !== undefined) updated.name = name;
      if (email !== undefined) updated.email = email;
      if (bio !== undefined) updated.bio = bio;
      if (avatarUrl !== undefined) updated.avatarUrl = avatarUrl;
      if (customThemeColor !== undefined) updated.customThemeColor = customThemeColor;
      if (category !== undefined) updated.category = category;
      return updated;
    }
    return u;
  });
  saveDB(db);

  const updatedUser = db.users.find((u) => u.id === userId);
  res.json({ success: true, user: updatedUser });
});

// POST /api/seller-application/:userId/approve
app.post("/api/seller-application/:userId/approve", (req, res) => {
  const { userId } = req.params;
  const db = loadDB();
  db.users = db.users.map((u) => {
    if (u.id === userId) {
      return { ...u, sellerStatus: "approved", category: "seller" };
    }
    return u;
  });
  saveDB(db);
  res.json({ success: true });
});

// POST /api/seller-application/:userId/reject
app.post("/api/seller-application/:userId/reject", (req, res) => {
  const { userId } = req.params;
  const db = loadDB();
  db.users = db.users.map((u) => {
    if (u.id === userId) {
      return { ...u, sellerStatus: "rejected" };
    }
    return u;
  });
  saveDB(db);
  res.json({ success: true });
});

// POST /api/inquiries
app.post("/api/inquiries", (req, res) => {
  const { gigId, proposedBudget, message, buyerId, buyerName, buyerEmail } = req.body;

  if (!gigId || !buyerId) {
    return res.status(400).json({ error: "Missing gigId or buyerId" });
  }

  const db = loadDB();
  const gig = db.gigs.find((g) => g.id === gigId);
  if (!gig) {
    return res.status(404).json({ error: "Active service listing no longer exists" });
  }

  if (buyerId === gig.sellerId) {
    return res.status(400).json({ error: "You cannot submit an inquiry on your own service listing" });
  }

  const newInq: Inquiry = {
    id: `inq_${Date.now()}`,
    gigId: gig.id,
    gigTitle: gig.title,
    buyerId,
    buyerName,
    buyerEmail,
    sellerId: gig.sellerId,
    sellerName: gig.sellerName,
    proposedBudget: proposedBudget || gig.price,
    message: message?.trim() || "I am interested in your service! Let’s coordinate.",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(newInq);

  // Update gig inquiry count
  db.gigs = db.gigs.map((g) => (g.id === gigId ? { ...g, inquiryCount: g.inquiryCount + 1 } : g));

  saveDB(db);
  res.json({ success: true, inquiry: newInq });
});

// POST /api/inquiries/:id/respond
app.post("/api/inquiries/:id/respond", (req, res) => {
  const { id } = req.params;
  const { responseText } = req.body;

  if (!responseText) {
    return res.status(400).json({ error: "Response text is required" });
  }

  const db = loadDB();
  let inquiryToReply: Inquiry | undefined;

  db.inquiries = db.inquiries.map((inq) => {
    if (inq.id === id) {
      inquiryToReply = {
        ...inq,
        status: "responded",
        sellerResponse: responseText,
        respondedAt: new Date().toISOString(),
      };
      return inquiryToReply;
    }
    return inq;
  });

  if (!inquiryToReply) {
    return res.status(404).json({ error: "Inquiry not found" });
  }

  const newNotif: Notification = {
    id: `n_reply_${Date.now()}`,
    title: `Message from ${inquiryToReply.sellerName || "Seller"}`,
    message: `Response to "${inquiryToReply.gigTitle}": "${responseText}"`,
    senderName: inquiryToReply.sellerName || "Seller",
    targetUserId: inquiryToReply.buyerId,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db.notifications.unshift(newNotif);
  saveDB(db);

  res.json({ success: true, inquiry: inquiryToReply, notification: newNotif });
});

// DELETE /api/inquiries/:id
app.delete("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.inquiries = db.inquiries.filter((inq) => inq.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// DELETE /api/inquiries/clear
app.delete("/api/inquiries/clear", (req, res) => {
  const db = loadDB();
  db.inquiries = [];
  saveDB(db);
  res.json({ success: true });
});

// POST /api/notifications
app.post("/api/notifications", (req, res) => {
  const { title, message, senderName, targetUserId } = req.body;

  const db = loadDB();
  const newNotif: Notification = {
    id: `n_${Date.now()}`,
    title,
    message,
    senderName: senderName || "Admin",
    targetUserId,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  db.notifications.unshift(newNotif);
  saveDB(db);

  res.json({ success: true, notification: newNotif });
});

// POST /api/notifications/:id/read
app.post("/api/notifications/:id/read", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.notifications = db.notifications.map((n) => {
    if (n.id === id) {
      return { ...n, isRead: true };
    }
    return n;
  });
  saveDB(db);
  res.json({ success: true });
});

// DELETE /api/notifications/clear
app.delete("/api/notifications/clear", (req, res) => {
  const db = loadDB();
  db.notifications = [];
  saveDB(db);
  res.json({ success: true });
});

// GET /api/orders
app.get("/api/orders", (req, res) => {
  const db = loadDB();
  res.json(db.orders || []);
});

// POST /api/orders - Create a new direct order
app.post("/api/orders", (req, res) => {
  const { gigId, price, buyerId, buyerName, sellerId, sellerName, gigTitle } = req.body;
  if (!gigId || !buyerId || !sellerId) {
    return res.status(400).json({ error: "Missing required order parameters" });
  }

  const db = loadDB();
  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    gigId,
    gigTitle: gigTitle || "Service Commission",
    price: Number(price),
    buyerId,
    buyerName,
    sellerId,
    sellerName,
    status: "pending_seller",
    createdAt: new Date().toISOString()
  };

  db.orders = db.orders || [];
  db.orders.unshift(newOrder);

  // Send notification to seller
  const notif: Notification = {
    id: `n_ord_${Date.now()}`,
    title: `New Order: ${newOrder.gigTitle}`,
    message: `Buyer ${buyerName} has placed an order for $${newOrder.price}! Please accept to begin working.`,
    senderName: "System Billing",
    targetUserId: sellerId,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notif);

  saveDB(db);
  res.json({ success: true, order: newOrder });
});

// POST /api/orders/:id/accept - Seller accepts order
app.post("/api/orders/:id/accept", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  let found: Order | undefined;

  db.orders = (db.orders || []).map((o) => {
    if (o.id === id) {
      found = { ...o, status: "in_progress" };
      return found;
    }
    return o;
  });

  if (!found) return res.status(404).json({ error: "Order not found" });

  // Notify buyer
  const notif: Notification = {
    id: `n_acc_${Date.now()}`,
    title: `Order Accepted: ${found.gigTitle}`,
    message: `Seller ${found.sellerName} has accepted your order and started working!`,
    senderName: "System",
    targetUserId: found.buyerId,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notif);

  saveDB(db);
  res.json({ success: true, order: found });
});

// POST /api/orders/:id/deliver - Seller confirms delivery
app.post("/api/orders/:id/deliver", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  let found: Order | undefined;

  db.orders = (db.orders || []).map((o) => {
    if (o.id === id) {
      found = { ...o, status: "delivered", deliveredAt: new Date().toISOString() };
      return found;
    }
    return o;
  });

  if (!found) return res.status(404).json({ error: "Order not found" });

  // Notify buyer
  const notif: Notification = {
    id: `n_del_${Date.now()}`,
    title: `Order Delivered: ${found.gigTitle}`,
    message: `Seller ${found.sellerName} marked your order as delivered. Please review, rate, and complete the order.`,
    senderName: "System",
    targetUserId: found.buyerId,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notif);

  saveDB(db);
  res.json({ success: true, order: found });
});

// POST /api/orders/:id/complete - Buyer completes and rates
app.post("/api/orders/:id/complete", (req, res) => {
  const { id } = req.params;
  const { rating, ratingComment } = req.body;
  const db = loadDB();
  let found: Order | undefined;

  db.orders = (db.orders || []).map((o) => {
    if (o.id === id) {
      found = {
        ...o,
        status: "completed",
        rating: typeof rating === "number" ? rating : undefined,
        ratingComment: ratingComment || undefined,
        completedAt: new Date().toISOString()
      };
      return found;
    }
    return o;
  });

  if (!found) return res.status(404).json({ error: "Order not found" });

  // Update gig's rating if applicable
  if (rating) {
    db.gigs = db.gigs.map((g) => {
      if (g.id === found?.gigId) {
        const newCount = g.ratingCount + 1;
        const newRating = Number(((g.rating * g.ratingCount + rating) / newCount).toFixed(1));
        return { ...g, rating: newRating, ratingCount: newCount };
      }
      return g;
    });
  }

  // Notify seller
  const notif: Notification = {
    id: `n_com_${Date.now()}`,
    title: `Order Completed!`,
    message: `Buyer ${found.buyerName} has accepted & completed order "${found.gigTitle}". Rating: ${rating || "None"} stars.`,
    senderName: "System Billing",
    targetUserId: found.sellerId,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notif);

  saveDB(db);
  res.json({ success: true, order: found });
});

// POST /api/orders/:id/dispute - Buyer files complaint
app.post("/api/orders/:id/dispute", (req, res) => {
  const { id } = req.params;
  const { disputeReason } = req.body;
  const db = loadDB();
  let found: Order | undefined;

  db.orders = (db.orders || []).map((o) => {
    if (o.id === id) {
      found = { ...o, status: "disputed", disputeReason: disputeReason || "No custom reason provided" };
      return found;
    }
    return o;
  });

  if (!found) return res.status(404).json({ error: "Order not found" });

  // Notify seller
  const notif: Notification = {
    id: `n_disp_${Date.now()}`,
    title: `Order Disputed!`,
    message: `Buyer ${found.buyerName} reported an issue with order "${found.gigTitle}". Reason: ${disputeReason}`,
    senderName: "Dispute Center",
    targetUserId: found.sellerId,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(notif);

  saveDB(db);
  res.json({ success: true, order: found });
});

// Serving the Single Page App Frontend with Vite Middleware in Dev
app.get('/auth/google/callback', (req, res) => {
  res.send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');
            if (idToken) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', credential: idToken }, '*');
            }
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
        <p>Authentication complete. This window will now close.</p>
      </body>
    </html>
  `);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "server_db.json");

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

interface DatabaseSchema {
  users: User[];
  gigs: Gig[];
  inquiries: Inquiry[];
  notifications: Notification[];
}

const ALEX_PORTFOLIO: SellerPortfolio = {
  title: "Full Stack Service Architect & UI Developer",
  description:
    "I build hyper-scalable web apps utilizing modern React, Redux, Node.js, and Google AI services. Over 6 years of expertise delivering high-performance SaaS platforms with sleek visual themes.",
  skills: [
    "TypeScript",
    "React 19",
    "Tailwind v4",
    "Node.js",
    "Google AI integration",
    "Figma UX Design",
  ],
  education: "B.S. in Computer Science - Stanford University",
  linkedin: "https://linkedin.com/in/alex-rivera-melagent-demo",
  businessLink: "https://alexrivera.dev",
  contactEmail: "alex.rivera@melagent-freelancer.net",
  contactPhone: "+1 (555) 321-4920",
};

const DEFAULT_USERS: User[] = [
  {
    id: "u_admin",
    email: "maliyagigs@gmail.com",
    name: "Maliya Admin",
    role: "admin",
    category: "buyer",
    joinedDate: "2026-01-01",
  },
  {
    id: "u_alex",
    email: "seller@melagent.com",
    name: "Alex Rivera",
    role: "user",
    category: "seller",
    joinedDate: "2026-02-10",
    portfolio: ALEX_PORTFOLIO,
    sellerStatus: "approved",
  },
  {
    id: "u_buyer",
    email: "buyer@melagent.com",
    name: "David Chen",
    role: "user",
    category: "buyer",
    joinedDate: "2026-03-01",
  },
];

const DEFAULT_GIGS: Gig[] = [
  {
    id: "g1",
    title: "Custom Full Stack React Platform with Elegant Themes",
    description:
      "I will design and build a state-of-the-art Single Page Application. Features clean layouts, responsive grid panels, complete type safety, and customized user flows.",
    price: 350,
    category: "Development",
    tags: ["React", "TypeScript", "Tailwind", "Sleek UI"],
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    pdfUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfName: "React_App_Development_Syllabus.pdf",
    views: 142,
    inquiryCount: 3,
    rating: 5.0,
    ratingCount: 15,
    createdAt: "2026-05-20",
  },
  {
    id: "g2",
    title: "Visual Identity & Complete Minimalist Branding Kit",
    description:
      "Establish a cohesive aesthetic. I will craft a corporate brand portfolio containing vector files, customized design rules, color presets, and social media banners.",
    price: 150,
    category: "Design",
    tags: ["Branding", "Figma", "Logo Design", "Aesthetics"],
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    imageUrl:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?q=80&w=600&auto=format&fit=crop",
    ],
    videoUrl: "",
    pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    pdfName: "Branding_Guide_Template.pdf",
    views: 89,
    inquiryCount: 1,
    rating: 4.8,
    ratingCount: 6,
    createdAt: "2026-05-22",
  },
  {
    id: "g3",
    title: "Advanced AI Chatbot & Agent API Integration",
    description:
      "Integrate the flagship Gemini Pro conversational API into your live business channel or internal slack workspace to automate client workflows with high fidelity.",
    price: 490,
    category: "AI Services",
    tags: ["Gemini", "Chatbot", "Workflow AI", "Automation"],
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    ],
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    pdfUrl: "",
    views: 210,
    inquiryCount: 5,
    rating: 4.9,
    ratingCount: 22,
    createdAt: "2026-05-25",
  },
];

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq_1",
    gigId: "g1",
    gigTitle: "Custom Full Stack React Platform with Elegant Themes",
    buyerId: "u_buyer",
    buyerName: "David Chen",
    buyerEmail: "buyer@melagent.com",
    sellerId: "u_alex",
    sellerName: "Alex Rivera",
    proposedBudget: 350,
    message:
      "Hello Alex! I saw your react gig and would love to build a custom customer portal. Do you have availability next week?",
    status: "pending",
    createdAt: "2026-05-26T14:30:00Z",
  },
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

// Helper to load/save JSON DB
function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading database file, using defaults", err);
  }

  // Prepopulate if empty/missing
  const initial: DatabaseSchema = {
    users: DEFAULT_USERS,
    gigs: DEFAULT_GIGS,
    inquiries: DEFAULT_INQUIRIES,
    notifications: DEFAULT_NOTIFICATIONS,
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
  const { email, pass } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const isAdminAccount = cleanEmail === "maliyagigs@gmail.com" && pass === "g2jabB80";

  const db = loadDB();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (user) {
    if (cleanEmail === "maliyagigs@gmail.com" && pass !== "g2jabB80") {
      return res.status(401).json({ success: false, message: "Invalid credentials for admin entry." });
    }

    if (isAdminAccount && user.role !== "admin") {
      user.role = "admin";
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
    role: isAdminAccount ? "admin" : "user",
    category: "buyer",
    joinedDate: new Date().toISOString().split("T")[0],
  };

  db.users.push(newUser);
  saveDB(db);

  return res.json({ success: true, message: "New profile registered.", user: newUser });
});

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { name, email, pass } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const isAdminAccount = cleanEmail === "maliyagigs@gmail.com" && pass === "g2jabB80";

  const db = loadDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    // If user exists, default to log in
    if (cleanEmail === "maliyagigs@gmail.com" && pass !== "g2jabB80") {
      return res.status(401).json({ success: false, message: "Invalid credentials for admin entry." });
    }
    if (isAdminAccount && existing.role !== "admin") {
      existing.role = "admin";
    }
    saveDB(db);
    return res.json({ success: true, message: "Account already exists, logged in.", user: existing });
  }

  const newUser: User = {
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: name?.trim() || cleanEmail.split("@")[0],
    role: isAdminAccount ? "admin" : "user",
    category: "buyer",
    joinedDate: new Date().toISOString().split("T")[0],
  };

  db.users.push(newUser);
  saveDB(db);

  return res.json({ success: true, message: "Account successfully registered and active.", user: newUser });
});

// POST /api/auth/google
app.post("/api/auth/google", async (req, res) => {
  const { credential } = req.body;
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
    const isAdminAccount = cleanEmail === "maliyagigs@gmail.com";

    const db = loadDB();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (user) {
      if (isAdminAccount && user.role !== "admin") {
        user.role = "admin";
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

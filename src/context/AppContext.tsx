const API_BASE_URL = typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_API_URL ? (import.meta as any).env.VITE_API_URL : "";
import {
  databases,
  account,
  ID,
  Query,
  DATABASE_ID,
  USERS_COL,
  GIGS_COL,
  INQUIRIES_COL,
  ORDERS_COL,
  NOTIFICATIONS_COL,
  PROJECTS_COL,
  SETTINGS_COL
} from "../lib/appwrite";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  Gig,
  Inquiry,
  SellerPortfolio,
  UserCategory,
  UserRole,
  Notification,
  Order,
  Project,
  SiteSettings,
} from "../types";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  gigs: Gig[];
  inquiries: Inquiry[];
  orders: Order[];
  notifications: Notification[];
  theme: "light" | "dark";
  toggleTheme: () => void;
  login: (email: string, pass: string, isAdminForm?: boolean) => Promise<{ success: boolean; message: string }>;
  googleLogin: (credential: string, isAdminForm?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    pass: string,
    isAdminForm?: boolean,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  toggleCategory: () => void;
  addGig: (
    gig: Omit<
      Gig,
      | "id"
      | "sellerId"
      | "sellerName"
      | "createdAt"
      | "views"
      | "inquiryCount"
      | "rating"
      | "ratingCount"
    >,
  ) => void;
  submitInquiry: (
    gigId: string,
    budget: number,
    message: string,
  ) => Promise<{ success: boolean; message: string }>;
  submitOrder: (
    gigId: string,
    price: number,
    sellerId: string,
    sellerName: string,
    gigTitle: string,
  ) => Promise<{ success: boolean; message: string }>;
  acceptOrder: (orderId: string) => Promise<void>;
  deliverOrder: (orderId: string) => Promise<void>;
  completeAndRateOrder: (orderId: string, rating: number, comment?: string) => Promise<void>;
  disputeOrder: (orderId: string, reason: string) => Promise<void>;
  updatePortfolio: (portfolio: SellerPortfolio) => void;
  submitSellerApplication: (portfolio: SellerPortfolio) => void;
  approveSellerApplication: (userId: string) => void;
  rejectSellerApplication: (userId: string) => void;
  incrementViews: (gigId: string) => void;
  deleteGig: (gigId: string) => void;
  deleteUser: (userId: string) => void;
  sendNotification: (
    title: string,
    message: string,
    targetUserId?: string,
  ) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  clearInquiries: () => void;
  deleteInquiry: (id: string) => void;
  respondToInquiry: (id: string, message: string) => void;
  rateGig: (gigId: string, rating: number) => void;
  activeView: "dashboard" | "profile" | "admin";
  setActiveView: (view: "dashboard" | "profile" | "admin") => void;
  updateUserProfile: (fields: Partial<User>) => Promise<{ success: boolean; message: string }>;
  projects: Project[];
  addProject: (title: string, description: string, url: string) => Promise<{ success: boolean; message: string }>;
  deleteProject: (id: string) => Promise<void>;
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local fallback defaults until fetched
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
    email: "maliyagigs@gmail.com",
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
    buyerEmail: "maliyagigs@gmail.com",
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
    buyerEmail: "maliyagigs@gmail.com",
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [gigs, setGigs] = useState<Gig[]>(DEFAULT_GIGS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(DEFAULT_INQUIRIES);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    paidToSellersCount: 2,
    activeBuyersCount: 10
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("melagent_current_v2");
    return stored ? JSON.parse(stored) : null;
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("melagent_theme");
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  const [activeView, setActiveView] = useState<"dashboard" | "profile" | "admin">("dashboard");

  // Pull database state from Express on mount
  useEffect(() => {
    let active = true;
    const fetchDatabase = async () => {
      try {
        if (!DATABASE_ID || DATABASE_ID === "melagent_db") {
           console.warn("Appwrite Database ID not configured! Using local temporary schema.");
           // Mock data if appwrite is not configured
           return;
        }

        const [usersRes, gigsRes, inquiriesRes, ordersRes, notificationsRes, projectsRes, settingsRes] = await Promise.all([
          databases.listDocuments(DATABASE_ID, USERS_COL),
          databases.listDocuments(DATABASE_ID, GIGS_COL),
          databases.listDocuments(DATABASE_ID, INQUIRIES_COL),
          databases.listDocuments(DATABASE_ID, ORDERS_COL),
          databases.listDocuments(DATABASE_ID, NOTIFICATIONS_COL),
          databases.listDocuments(DATABASE_ID, PROJECTS_COL),
          databases.listDocuments(DATABASE_ID, SETTINGS_COL)
        ]);
        
        if (active) {
          setUsers(usersRes.documents as any);
          setGigs(gigsRes.documents as any);
          setInquiries(inquiriesRes.documents as any);
          setOrders(ordersRes.documents as any);
          setNotifications(notificationsRes.documents as any);
          setProjects(projectsRes.documents as any);
          if (settingsRes.documents.length > 0) {
            setSettings(settingsRes.documents[0] as any);
          }
        }
      } catch (err) {
        console.error("Appwrite DB synchronization error. Check .env config.", err);
      }
    };

    fetchDatabase();
    return () => {
      active = false;
    };
  }, []);

  // Theme support
  useEffect(() => {
    localStorage.setItem("melagent_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Current session cache support
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("melagent_current_v2", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("melagent_current_v2");
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  // REST authenticators
  const LOCAL_ADMIN_USER: User = {
    id: "u_admin",
    email: "maliyagigs@gmail.com",
    name: "Maliya Admin",
    role: "admin",
    category: "buyer",
    joinedDate: "2026-01-01",
  };

  const login = async (
    email: string,
    pass: string,
    isAdminForm?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (DATABASE_ID !== "melagent_db") {
         await account.createEmailPasswordSession(email, pass);
         const prefs = await account.getPrefs();
         const userDoc = await databases.listDocuments(DATABASE_ID, USERS_COL, [Query.equal("email", email)]);
         let usr = userDoc.documents[0] as any;
         setCurrentUser(usr);
         if (usr.role === "admin") setActiveView("admin");
         return { success: true, message: "Logged in via Appwrite Engine!" };
      }
      return { success: false, message: "Appwrite not configured to handle Auth yet." };
    } catch (err: any) {
      console.error(err);
      if (err.message === "Failed to fetch") {
        return { success: false, message: "Auth Failed (CORS Issue): Please add this app's preview URL as a Web Platform in your Appwrite Project settings to allow CORS." };
      }
      return { success: false, message: "Auth Failed: " + err.message };
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    isAdminForm?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (DATABASE_ID !== "melagent_db") {
         const newAccount = await account.create(ID.unique(), email, pass, name);
         await account.createEmailPasswordSession(email, pass);
         
         const newUser = await databases.createDocument(DATABASE_ID, USERS_COL, newAccount.$id, {
            email, name, role: isAdminForm ? "admin" : "user", category: "buyer", joinedDate: new Date().toISOString()
         });
         setCurrentUser(newUser as any);
         if (isAdminForm) setActiveView("admin");
         
         return { success: true, message: "Registered via Appwrite Engine!" };
      }
      return { success: false, message: "Appwrite not configured to handle Auth yet." };
    } catch (err: any) {
      console.error(err);
      if (err.message === "Failed to fetch") {
        return { success: false, message: "Auth Failed (CORS Issue): Please add this app's preview URL as a Web Platform in your Appwrite Project settings to allow CORS." };
      }
      return { success: false, message: "Auth Failed: " + err.message };
    }
  };

  const googleLogin = async (credential: string, isAdminForm?: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(API_BASE_URL + "/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, isAdminForm }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        return { success: false, message: `Server connection error (${res.status}).` };
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        setUsers((prev) => {
          const match = prev.find((u) => u.id === data.user.id);
          if (match) {
            return prev.map((u) => (u.id === data.user.id ? data.user : u));
          } else {
            return [...prev, data.user];
          }
        });
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Failed Google sign in." };
    } catch (err) {
      console.error("Google login fetch error:", err);
      return { success: false, message: "Server connection failed: " + (err instanceof Error ? err.message : String(err)) };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Toggle user view mode persistently
  const toggleCategory = async () => {
    if (!currentUser) return;
    const nextCategory: UserCategory = currentUser.category === "buyer" ? "seller" : "buyer";
    
    // Update local state first
    const updated = { ...currentUser, category: nextCategory };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));

    // Send async write update to the Express database
    try {
      await fetch(API_BASE_URL + "/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, portfolio: currentUser.portfolio, sellerStatus: currentUser.sellerStatus, category: nextCategory }),
      });
    } catch (err) {
      console.error("Failed to persist view toggle:", err);
    }
  };

  // Create a new Gig listing
  const addGig = async (
    gigData: Omit<
      Gig,
      | "id"
      | "sellerId"
      | "sellerName"
      | "createdAt"
      | "views"
      | "inquiryCount"
      | "rating"
      | "ratingCount"
    >,
  ) => {
    if (!currentUser) return;
    
    try {
      const payload = {
        ...gigData,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
      };

      if (!DATABASE_ID || DATABASE_ID === "melagent_db") {
         const newGig = { ...payload, id: `g_${Date.now()}`, views: 0, inquiryCount: 0, rating: 5, ratingCount: 1, createdAt: new Date().toISOString() };
         setGigs((prev) => [newGig, ...prev]);
         return;
      }

      const doc = await databases.createDocument(
        DATABASE_ID,
        GIGS_COL,
        ID.unique(),
        {
          ...payload,
          views: 0, inquiryCount: 0, rating: 5, ratingCount: 1, createdAt: new Date().toISOString()
        }
      );
      setGigs((prev) => [doc as any, ...prev]);
    } catch (err) {
      console.error("Failed to transmit gig listing to Appwrite:", err);
    }
  };


  // Submit modern service inquiry
  const submitInquiry = async (
    gigId: string,
    budget: number,
    message: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return {
        success: false,
        message: "Please authenticate to submit an inquiry.",
      };
    }

    const payload = {
      gigId,
      proposedBudget: budget,
      message,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
    };

    try {
      const res = await fetch(API_BASE_URL + "/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => [data.inquiry, ...prev]);
        // Adjust local gig inquiry count immediately
        setGigs((prev) =>
          prev.map((g) =>
            g.id === gigId ? { ...g, inquiryCount: g.inquiryCount + 1 } : g,
          ),
        );
        return { success: true, message: "Inquiry successfully transmitted!" };
      }
      return { success: false, message: data.error || "Failed sending inquiry." };
    } catch (err) {
      return { success: false, message: "Network connection error." };
    }
  };

  // Profile management
  const updatePortfolio = async (portfolio: SellerPortfolio) => {
    if (!currentUser) return;
    const updated = { ...currentUser, portfolio };
    
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));

    try {
      await fetch(API_BASE_URL + "/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, portfolio }),
      });
    } catch (err) {
      console.error("Error updating portfolio:", err);
    }
  };

  const submitSellerApplication = async (portfolio: SellerPortfolio) => {
    if (!currentUser) return;
    const updated = { ...currentUser, portfolio, sellerStatus: "pending" as const };
    
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));

    try {
      await fetch(API_BASE_URL + "/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, portfolio, sellerStatus: "pending" }),
      });
    } catch (err) {
      console.error("Error submitting seller application:", err);
    }
  };

  const approveSellerApplication = async (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, sellerStatus: "approved", category: "seller" };
        }
        return u;
      }),
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, sellerStatus: "approved", category: "seller" } : null,
      );
    }

    try {
      await fetch(`${API_BASE_URL}/api/seller-application/${userId}/approve`, { method: "POST" });
    } catch (err) {
      console.error("Error approving seller:", err);
    }
  };

  const rejectSellerApplication = async (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, sellerStatus: "rejected" };
        }
        return u;
      }),
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, sellerStatus: "rejected" } : null,
      );
    }

    try {
      await fetch(`${API_BASE_URL}/api/seller-application/${userId}/reject`, { method: "POST" });
    } catch (err) {
      console.error("Error rejecting seller:", err);
    }
  };

  const incrementViews = async (gigId: string) => {
    const targetGig = gigs.find(g => g.id === gigId || (g as any).$id === gigId);
    if (!targetGig) return;
    const newViews = targetGig.views + 1;
    
    setGigs((prev) => prev.map((g) => (g.id === gigId || (g as any).$id === gigId ? { ...g, views: newViews } : g)));

    try {
      if (DATABASE_ID !== "melagent_db") {
        await databases.updateDocument(DATABASE_ID, GIGS_COL, gigId, { views: newViews });
      }
    } catch (err) {
      console.error("Error incrementing views Appwrite:", err);
    }
  };

  const deleteGig = async (gigId: string) => {
    setGigs((prev) => prev.filter((g) => g.id !== gigId && (g as any).$id !== gigId));

    try {
      if (DATABASE_ID !== "melagent_db") {
        await databases.deleteDocument(DATABASE_ID, GIGS_COL, gigId);
      }
    } catch (err) {
      console.error("Error deleting gig in Appwrite:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (currentUser?.id === userId) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setGigs((prev) => prev.filter((g) => g.sellerId !== userId));

    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const sendNotification = async (
    title: string,
    message: string,
    targetUserId?: string,
  ) => {
    try {
      const res = await fetch(API_BASE_URL + "/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, senderName: currentUser?.name || "Admin", targetUserId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { method: "POST" });
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);

    try {
      await fetch(API_BASE_URL + "/api/notifications/clear", { method: "DELETE" });
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const clearInquiries = async () => {
    setInquiries([]);

    try {
      await fetch(API_BASE_URL + "/api/inquiries/clear", { method: "DELETE" });
    } catch (err) {
      console.error("Error clearing inquiries:", err);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));

    try {
      await fetch(`${API_BASE_URL}/api/inquiries/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  };

  const respondToInquiry = async (id: string, message: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText: message }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setInquiries((prev) =>
            prev.map((inq) => (inq.id === id ? data.inquiry : inq)),
          );
          setNotifications((prev) => [data.notification, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error responding to inquiry:", err);
    }
  };

  const rateGig = async (gigId: string, userRating: number) => {
    setGigs((prev) =>
      prev.map((g) => {
        if (g.id === gigId) {
          const newCount = g.ratingCount + 1;
          const newRating = Number(((g.rating * g.ratingCount + userRating) / newCount).toFixed(1));
          return { ...g, rating: newRating, ratingCount: newCount };
        }
        return g;
      }),
    );

    try {
      await fetch(`${API_BASE_URL}/api/gigs/${gigId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: userRating }),
      });
    } catch (err) {
      console.error("Error rating gig:", err);
    }
  };

  const submitOrder = async (
    gigId: string,
    price: number,
    sellerId: string,
    sellerName: string,
    gigTitle: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: "Please sign in to place an order." };
    }

    const payload = {
      gigId,
      price,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId,
      sellerName,
      gigTitle,
    };

    try {
      const res = await fetch(API_BASE_URL + "/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => [data.order, ...prev]);
        return { success: true, message: "Order placed successfully! Waiting for seller confirmation." };
      }
      return { success: false, message: data.error || "Failed to place order." };
    } catch (err) {
      return { success: false, message: "Network connection error." };
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/accept`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        }
      }
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  const deliverOrder = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/deliver`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        }
      }
    } catch (err) {
      console.error("Error delivering order:", err);
    }
  };

  const completeAndRateOrder = async (orderId: string, rating: number, comment?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, ratingComment: comment }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
          
          // Re-fetch database to get fresh ratings/gigs in state
          const freshRes = await fetch(API_BASE_URL + "/api/db");
          if (freshRes.ok) {
            const freshData = await freshRes.json();
            if (freshData.gigs) setGigs(freshData.gigs);
            if (freshData.notifications) setNotifications(freshData.notifications);
          }
        }
      }
    } catch (err) {
      console.error("Error completing order:", err);
    }
  };

  const disputeOrder = async (orderId: string, reason: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disputeReason: reason }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        }
      }
    } catch (err) {
      console.error("Error disputing order:", err);
    }
  };

  const updateUserProfile = async (
    fields: Partial<User>
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: "No active user logged in" };
    try {
      const res = await fetch(API_BASE_URL + "/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, ...fields }),
      });
      if (!res.ok) throw new Error("Server update failed");
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("melagent_current_v2", JSON.stringify(data.user));
        setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? data.user : u)));
        return { success: true, message: "Profile successfully updated!" };
      }
      return { success: false, message: data.error || "Update unsuccessful" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error updating details" };
    }
  };

  const addProject = async (
    title: string,
    description: string,
    url: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!DATABASE_ID || DATABASE_ID === "melagent_db") {
        const newProj = { id: `proj_${Date.now()}`, title, description, url };
        setProjects((prev) => [...prev, newProj]);
        return { success: true, message: "Project preview added locally (Appwrite missing)!" };
      }
      
      const newProj = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_COL,
        ID.unique(),
        { title, description, url }
      );
      setProjects((prev) => [...prev, newProj as any]);
      return { success: true, message: "Project preview added to Appwrite!" };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: "Appwrite connection failed: " + err.message };
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      if (DATABASE_ID !== "melagent_db") {
        await databases.deleteDocument(DATABASE_ID, PROJECTS_COL, id);
      }
      setProjects((prev) => prev.filter((p) => (p as any).$id !== id && p.id !== id));
    } catch (err) {
      console.error("Error deleting project in Appwrite:", err);
    }
  };

  const updateSettings = async (
    updates: Partial<SiteSettings>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const payload = {
        paidToSellersCount: updates.paidToSellersCount !== undefined ? Number(updates.paidToSellersCount) : settings.paidToSellersCount,
        activeBuyersCount: updates.activeBuyersCount !== undefined ? Number(updates.activeBuyersCount) : settings.activeBuyersCount
      };

      const res = await fetch(API_BASE_URL + "/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        return { success: true, message: "Platform stats updated successfully!" };
      }
      return { success: false, message: data.error || "Could not save platform stats." };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed connection to backend." };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        gigs,
        inquiries,
        orders,
        notifications,
        theme,
        toggleTheme,
        login,
        googleLogin,
        register,
        logout,
        toggleCategory,
        addGig,
        submitInquiry,
        submitOrder,
        acceptOrder,
        deliverOrder,
        completeAndRateOrder,
        disputeOrder,
        updatePortfolio,
        submitSellerApplication,
        approveSellerApplication,
        rejectSellerApplication,
        incrementViews,
        deleteGig,
        deleteUser,
        sendNotification,
        markNotificationAsRead,
        clearNotifications,
        clearInquiries,
        deleteInquiry,
        respondToInquiry,
        rateGig,
        activeView,
        setActiveView,
        updateUserProfile,
        projects,
        addProject,
        deleteProject,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

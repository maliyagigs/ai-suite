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
} from "../types";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  gigs: Gig[];
  inquiries: Inquiry[];
  notifications: Notification[];
  theme: "light" | "dark";
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  googleLogin: (credential: string) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    pass: string,
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local fallback defaults until fetched
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [gigs, setGigs] = useState<Gig[]>(DEFAULT_GIGS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(DEFAULT_INQUIRIES);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("melagent_current_v2");
    return stored ? JSON.parse(stored) : null;
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("melagent_theme");
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  // Pull database state from Express on mount
  useEffect(() => {
    let active = true;
    const fetchDatabase = async () => {
      try {
        const res = await fetch("/api/db");
        if (!res.ok) throw new Error("Could not fetch remote server data");
        const data = await res.json();
        if (active) {
          if (data.users && data.users.length > 0) setUsers(data.users);
          if (data.gigs && data.gigs.length > 0) setGigs(data.gigs);
          if (data.inquiries && data.inquiries.length > 0) setInquiries(data.inquiries);
          if (data.notifications && data.notifications.length > 0) setNotifications(data.notifications);

          // Keep local cached user in sync with remote fields
          const cached = localStorage.getItem("melagent_current_v2");
          if (cached) {
            const parsed = JSON.parse(cached) as User;
            const fresh = (data.users as User[]).find((u) => u.id === parsed.id);
            if (fresh) {
              setCurrentUser(fresh);
            }
          }
        }
      } catch (err) {
        console.error("Express DB synchronization error:", err);
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
  const login = async (
    email: string,
    pass: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });

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
      return { success: false, message: data.message || "Failed signing in." };
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pass }),
      });

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
      return { success: false, message: data.message || "Failed registration." };
    } catch (err) {
      return { success: false, message: "Server connection failed." };
    }
  };

  const googleLogin = async (credential: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

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
      return { success: false, message: "Server connection failed." };
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
      await fetch("/api/portfolio", {
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
    
    // Create payload
    const payload = {
      ...gigData,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
    };

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.gig) {
          setGigs((prev) => [data.gig, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to transmit gig listing:", err);
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
      const res = await fetch("/api/inquiries", {
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
      await fetch("/api/portfolio", {
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
      await fetch("/api/portfolio", {
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
      await fetch(`/api/seller-application/${userId}/approve`, { method: "POST" });
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
      await fetch(`/api/seller-application/${userId}/reject`, { method: "POST" });
    } catch (err) {
      console.error("Error rejecting seller:", err);
    }
  };

  const incrementViews = async (gigId: string) => {
    setGigs((prev) =>
      prev.map((g) => (g.id === gigId ? { ...g, views: g.views + 1 } : g)),
    );

    try {
      await fetch(`/api/gigs/${gigId}/view`, { method: "POST" });
    } catch (err) {
      console.error("Error incrementing views:", err);
    }
  };

  const deleteGig = async (gigId: string) => {
    setGigs((prev) => prev.filter((g) => g.id !== gigId));

    try {
      await fetch(`/api/gigs/${gigId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting gig:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (currentUser?.id === userId) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setGigs((prev) => prev.filter((g) => g.sellerId !== userId));

    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
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
      const res = await fetch("/api/notifications", {
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
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);

    try {
      await fetch("/api/notifications/clear", { method: "DELETE" });
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const clearInquiries = async () => {
    setInquiries([]);

    try {
      await fetch("/api/inquiries/clear", { method: "DELETE" });
    } catch (err) {
      console.error("Error clearing inquiries:", err);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));

    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  };

  const respondToInquiry = async (id: string, message: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/respond`, {
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
      await fetch(`/api/gigs/${gigId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: userRating }),
      });
    } catch (err) {
      console.error("Error rating gig:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        gigs,
        inquiries,
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

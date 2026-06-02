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
  activeView: "dashboard" | "profile";
  setActiveView: (view: "dashboard" | "profile") => void;
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

const DEFAULT_USERS: User[] = [];

const DEFAULT_GIGS: Gig[] = [];

const DEFAULT_INQUIRIES: Inquiry[] = [];

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
  const [orders, setOrders] = useState<Order[]>([]);
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

  const [activeView, setActiveView] = useState<"dashboard" | "profile">("dashboard");

  // Pull database state from Express on mount
  useEffect(() => {
    let active = true;
    const fetchDatabase = async () => {
      try {
        const res = await fetch("/api/db");
        if (!res.ok) throw new Error("Could not fetch remote server data");
        const data = await res.json();
        if (active) {
          if (data.users !== undefined) setUsers(data.users);
          if (data.gigs !== undefined) setGigs(data.gigs);
          if (data.inquiries !== undefined) setInquiries(data.inquiries);
          if (data.orders !== undefined) setOrders(data.orders);
          if (data.notifications !== undefined) setNotifications(data.notifications);
          if (data.projects !== undefined) setProjects(data.projects);
          if (data.settings !== undefined) setSettings(data.settings);

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
    isAdminForm?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass, isAdminForm }),
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
    isAdminForm?: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pass, isAdminForm }),
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

  const googleLogin = async (credential: string, isAdminForm?: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, isAdminForm }),
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
      const res = await fetch("/api/orders", {
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
      const res = await fetch(`/api/orders/${orderId}/accept`, { method: "POST" });
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
      const res = await fetch(`/api/orders/${orderId}/deliver`, { method: "POST" });
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
      const res = await fetch(`/api/orders/${orderId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, ratingComment: comment }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
          
          // Re-fetch database to get fresh ratings/gigs in state
          const freshRes = await fetch("/api/db");
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
      const res = await fetch(`/api/orders/${orderId}/dispute`, {
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
      const res = await fetch("/api/user/update", {
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
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [...prev, data]);
        return { success: true, message: "Project preview added successfully!" };
      }
      return { success: false, message: data.error || "Could not save project." };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed connection to backend." };
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
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

      const res = await fetch("/api/settings", {
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

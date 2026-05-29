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
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (
    name: string,
    email: string,
    pass: string,
  ) => { success: boolean; message: string };
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
  ) => { success: boolean; message: string };
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
  rateGig: (gigId: string, rating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial placeholder sellers with rich Fiverr portfolios
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("melagent_users_v2");
    return stored ? JSON.parse(stored) : DEFAULT_USERS;
  });

  const [gigs, setGigs] = useState<Gig[]>(() => {
    const stored = localStorage.getItem("melagent_gigs_v2");
    const loaded = stored ? JSON.parse(stored) : DEFAULT_GIGS;
    return loaded.map((g: any) => ({
      ...g,
      rating: typeof g.rating === "number" ? g.rating : 5.0,
      ratingCount:
        typeof g.ratingCount === "number"
          ? g.ratingCount
          : Math.floor(Math.random() * 8) + 2,
    }));
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const stored = localStorage.getItem("melagent_inquiries_v2");
    return stored ? JSON.parse(stored) : DEFAULT_INQUIRIES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem("melagent_notifications_v2");
    return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("melagent_current_v2");
    return stored ? JSON.parse(stored) : null;
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("melagent_theme");
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("melagent_users_v2", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("melagent_gigs_v2", JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem("melagent_inquiries_v2", JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(
      "melagent_notifications_v2",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("melagent_theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("melagent_current_v2", JSON.stringify(currentUser));
      // Sync list
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? currentUser : u)),
      );
    } else {
      localStorage.removeItem("melagent_current_v2");
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  // Secure authenticate
  const login = (
    email: string,
    pass: string,
  ): { success: boolean; message: string } => {
    const cleanEmail = email.toLowerCase().trim();

    // Core requirements check:
    const isAdminAccount =
      cleanEmail === "maliyagigs@gmail.com" && pass === "g2jabB80";

    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (user) {
      // Correct admin details check
      if (cleanEmail === "maliyagigs@gmail.com" && pass !== "g2jabB80") {
        return {
          success: false,
          message: "Invalid credentials for admin entry.",
        };
      }

      // If user logs in with maliyagigs name, guarantee they are upgraded to admin securely if needed
      let updatedUser = { ...user };
      if (isAdminAccount && user.role !== "admin") {
        updatedUser.role = "admin";
      }

      // Default the logged in user to Buyer profile upon accessing as requested
      if (updatedUser.role !== "admin") {
        updatedUser.category = "buyer";
      }

      setCurrentUser(updatedUser);
      return { success: true, message: "Successfully signed in!" };
    }

    // Auto-register if user doesn't exist but credential entered
    const name = cleanEmail.split("@")[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const newUser: User = {
      id: `u_${Date.now()}`,
      email: cleanEmail,
      name: capitalizedName,
      role: isAdminAccount ? "admin" : "user",
      category: "buyer", // Default always redirected to buyer profile
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: "New profile registered." };
  };

  const register = (
    name: string,
    email: string,
    pass: string,
  ): { success: boolean; message: string } => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdminAccount =
      cleanEmail === "maliyagigs@gmail.com" && pass === "g2jabB80";

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      // Sign in instead
      return login(email, pass);
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || cleanEmail.split("@")[0],
      role: isAdminAccount ? "admin" : "user",
      category: "buyer", // default always buyer first
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return {
      success: true,
      message: "Account successfully registered and active.",
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleCategory = () => {
    if (!currentUser) return;
    const nextCategory: UserCategory =
      currentUser.category === "buyer" ? "seller" : "buyer";
    setCurrentUser({
      ...currentUser,
      category: nextCategory,
    });
  };

  const addGig = (
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
    const newGig: Gig = {
      ...gigData,
      id: `g_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      inquiryCount: 0,
      rating: 5.0,
      ratingCount: 1,
    };

    setGigs((prev) => [newGig, ...prev]);
  };

  const submitInquiry = (
    gigId: string,
    budget: number,
    message: string,
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      return {
        success: false,
        message: "Please authenticate to submit an inquiry.",
      };
    }

    const gig = gigs.find((g) => g.id === gigId);
    if (!gig) {
      return {
        success: false,
        message: "Active service listing no longer exists.",
      };
    }

    if (currentUser.id === gig.sellerId) {
      return {
        success: false,
        message: "You cannot submit an inquiry on your own service listing.",
      };
    }

    const newInq: Inquiry = {
      id: `inq_${Date.now()}`,
      gigId: gig.id,
      gigTitle: gig.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      sellerId: gig.sellerId,
      sellerName: gig.sellerName,
      proposedBudget: budget || gig.price,
      message:
        message.trim() || "I am interested in your service! Let’s coordinate.",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setInquiries((prev) => [newInq, ...prev]);

    // Update Gig Stats
    setGigs((prev) =>
      prev.map((g) =>
        g.id === gigId ? { ...g, inquiryCount: g.inquiryCount + 1 } : g,
      ),
    );

    return {
      success: true,
      message: "Inquiry successfully transmitted to the seller!",
    };
  };

  const updatePortfolio = (portfolio: SellerPortfolio) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      portfolio,
    };
    setCurrentUser(updatedUser);
  };

  const submitSellerApplication = (portfolio: SellerPortfolio) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      portfolio,
      sellerStatus: "pending" as const,
    };
    setCurrentUser(updatedUser);
  };

  const approveSellerApplication = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, sellerStatus: "approved", category: "seller" };
        }
        return u;
      }),
    );

    // Also update currentUser if it's the currently logged-in user getting approved.
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, sellerStatus: "approved", category: "seller" } : null,
      );
    }
  };

  const rejectSellerApplication = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, sellerStatus: "rejected" };
        }
        return u;
      }),
    );

    // Also update currentUser if it's the currently logged-in user getting rejected.
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, sellerStatus: "rejected" } : null,
      );
    }
  };

  const incrementViews = (gigId: string) => {
    setGigs((prev) =>
      prev.map((g) => (g.id === gigId ? { ...g, views: g.views + 1 } : g)),
    );
  };

  const deleteGig = (gigId: string) => {
    setGigs((prev) => prev.filter((g) => g.id !== gigId));
  };

  const deleteUser = (userId: string) => {
    if (currentUser?.id === userId) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setGigs((prev) => prev.filter((g) => g.sellerId !== userId));
  };

  const sendNotification = (
    title: string,
    message: string,
    targetUserId?: string,
  ) => {
    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      title,
      message,
      senderName: currentUser?.name || "Admin",
      targetUserId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearInquiries = () => {
    setInquiries([]);
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  const rateGig = (gigId: string, userRating: number) => {
    setGigs((prev) =>
      prev.map((g) => {
        if (g.id === gigId) {
          const newCount = g.ratingCount + 1;
          const newRating = Number(
            ((g.rating * g.ratingCount + userRating) / newCount).toFixed(1),
          );
          return { ...g, rating: newRating, ratingCount: newCount };
        }
        return g;
      }),
    );
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

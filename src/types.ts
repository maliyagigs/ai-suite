export type UserRole = 'admin' | 'user';
export type UserCategory = 'buyer' | 'seller';

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface SellerPortfolio {
  title: string;
  description: string;
  skills: string[];
  education: string;
  linkedin: string;
  businessLink: string;
  contactEmail: string;
  contactPhone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  category: UserCategory;
  joinedDate: string;
  portfolio?: SellerPortfolio;
  sellerStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  avatarUrl?: string;
  bio?: string;
  customThemeColor?: string;
}

export interface Gig {
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  senderName: string;
  targetUserId?: string; // empty means direct broadcast to "All Users"
  isRead: boolean;
  createdAt: string;
}

export interface Inquiry {
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
  status: 'pending' | 'responded' | 'archived';
  sellerResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

export type OrderStatus = 'pending_seller' | 'in_progress' | 'delivered' | 'completed' | 'disputed';

export interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: OrderStatus;
  disputeReason?: string;
  rating?: number; // 1-5
  ratingComment?: string;
  createdAt: string;
  deliveredAt?: string;
  completedAt?: string;
}


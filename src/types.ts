export type BranchType = 'all' | 'seafood' | 'syrian';

export type DishCategory =
  | 'all'
  | 'meals'
  | 'sandwiches'
  | 'casseroles'
  | 'appetizers'
  | 'grills'
  | 'shawarma'
  | 'fatila'
  | 'crepes'
  | 'sides';

export interface DishSizeOption {
  name: string;
  price: number;
  badge?: string;
  description?: string;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  category?: 'sauce' | 'cheese' | 'sides' | 'drinks' | 'bread';
}

export interface DishItem {
  id: string;
  name: string;
  nameEn: string;
  branch: 'seafood' | 'syrian';
  category: DishCategory;
  price: number;
  originalPrice?: number;
  sizes?: DishSizeOption[];
  description: string;
  image: string;
  badge?: 'bestseller' | 'hot' | 'new' | 'chef-choice' | 'signature';
  badgeText?: string;
  hasSteam?: boolean; // Enables realistic rising steam particle animation
  spicyLevel?: 0 | 1 | 2 | 3;
  prepTimeMinutes?: number;
  calories?: number;
  ingredients?: string[];
  available: boolean;
  availableExtras?: ExtraOption[];
}

export interface CartItem {
  dish: DishItem;
  quantity: number;
  selectedSize?: string;
  selectedSizePrice?: number;
  selectedExtras?: ExtraOption[];
  notes?: string;
}

export interface AdminCredentials {
  isAuthenticated: boolean;
  userRole?: 'admin' | 'guest';
}

export type ChatMessageTopic = 'general' | 'complaint' | 'suggestion' | 'order_inquiry' | 'compliment';

export interface CustomerProfile {
  id: string; // unique ID or normalized email
  name: string;
  email: string;
  phone?: string;
  avatarColor?: string;
  registeredAt: string;
  lastActive: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // customer id/email
  sender: 'customer' | 'admin';
  senderName: string;
  senderEmail?: string;
  text: string;
  topic?: ChatMessageTopic;
  timestamp: number;
  readByAdmin?: boolean;
  readByCustomer?: boolean;
}

export interface ConversationThread {
  id: string;
  customer: CustomerProfile;
  messages: ChatMessage[];
  unreadCountForAdmin: number;
  unreadCountForCustomer: number;
  updatedAt: number;
  status: 'open' | 'resolved' | 'pending';
}

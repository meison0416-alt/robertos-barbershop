export interface Haircut {
  id: string;
  name: string;
  description: string;
  category: "men" | "women" | "children";
  imageUrl: string;
  price: number;
  duration: number; // in minutes
  details: string; // expanded overview
  likes: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  haircutId: string;
  haircutName: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:MM
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  haircutId: string;
  createdAt: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  specialty: string;
}

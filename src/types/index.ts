export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  placeCount: number;
}

export interface PlaceImage {
  id: string;
  url: string;
  altText: string;
  isCover: boolean;
}

export interface PlaceSummary {
  id: string;
  name: string;
  slug: string;
  priceMin: number;
  priceMax: number;
  contactPhone: string;
  landmark: string;
  ratingAvg: string; // Prisma Decimal is serialized as a string over JSON
  reviewCount: number;
  category: { name: string; slug: string; icon: string };
  images: PlaceImage[];
  isFavorited: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  note: string | null;
}

export interface BusinessHour {
  dayOfWeek: string;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
}

export interface PlaceDetail extends PlaceSummary {
  description: string;
  contactPhone2: string | null;
  menuItems: MenuItem[];
  hours: BusinessHour[];
  reviews: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "OWNER" | "ADMIN";
  avatarUrl: string | null;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  failed?: boolean;
  url?: string; // set once the staging upload succeeds
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

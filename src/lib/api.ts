export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
  location: string;
}

export const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Clothing",
  "Vehicles",
  "Sports",
  "Home & Garden",
  "Books",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Mid-Century Modern Armchair",
    description: "Beautiful walnut frame armchair with original green velvet upholstery. Minor wear consistent with age. Very comfortable.",
    price: 320,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    createdAt: "2026-02-15T10:00:00Z",
    location: "Brooklyn, NY",
  },
  {
    id: "2",
    title: "iPhone 15 Pro Max 256GB",
    description: "Like new condition, natural titanium. Comes with original box, cable, and a clear case. Battery health 98%.",
    price: 899,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop",
    createdAt: "2026-02-14T14:30:00Z",
    location: "Manhattan, NY",
  },
  {
    id: "3",
    title: "Vintage Levi's 501 Jeans",
    description: "Authentic vintage 501s from the 90s. W32 L34. Great fade and distressing. No rips or tears.",
    price: 85,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop",
    createdAt: "2026-02-14T09:15:00Z",
    location: "Austin, TX",
  },
  {
    id: "4",
    title: "Trek Domane SL 5 Road Bike",
    description: "2024 model, size 56cm. Shimano 105 groupset. Under 500 miles. Includes bottle cages and pedals.",
    price: 2200,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop",
    createdAt: "2026-02-13T16:00:00Z",
    location: "Portland, OR",
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Headphones",
    description: "Excellent noise cancelling headphones. Silver color. Includes carrying case and cable. Like new.",
    price: 220,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
    createdAt: "2026-02-13T11:00:00Z",
    location: "Chicago, IL",
  },
  {
    id: "6",
    title: "Monstera Deliciosa Plant",
    description: "Large healthy monstera with 3 splits. About 3 feet tall. Comes in ceramic pot. Pet-free home.",
    price: 45,
    category: "Home & Garden",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=400&fit=crop",
    createdAt: "2026-02-12T08:00:00Z",
    location: "San Francisco, CA",
  },
];

let listings = [...mockListings];

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getListings(category?: string): Promise<Listing[]> {
  await delay(400);
  if (!category || category === "All") return [...listings];
  return listings.filter((l) => l.category === category);
}

export async function createListing(data: Omit<Listing, "id" | "createdAt">): Promise<Listing> {
  await delay(500);
  const newListing: Listing = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  listings = [newListing, ...listings];
  return newListing;
}

export async function analyzeImage(_imageFile: File): Promise<{
  title: string;
  description: string;
  category: Category;
  price: number;
}> {
  // Mock AI analysis – in real app this would call a vision model
  await delay(1500);
  return {
    title: "Vintage Item",
    description: "A unique item in great condition. Shows minimal signs of wear. Perfect for collectors or everyday use.",
    category: "Other",
    price: 50,
  };
}

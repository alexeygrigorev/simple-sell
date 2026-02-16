const API_BASE = "http://localhost:8000";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
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

interface BackendListing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
}

function toListing(b: BackendListing): Listing {
  return {
    id: String(b.id),
    title: b.title,
    description: b.description,
    price: b.price,
    category: b.category,
    imageUrl: b.image_url,
    createdAt: b.created_at,
  };
}

export async function getListings(category?: string): Promise<Listing[]> {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  const url = `${API_BASE}/api/listings${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch listings");
  const data: BackendListing[] = await res.json();
  return data.map(toListing);
}

export async function createListing(data: {
  title: string;
  description: string;
  price: number;
  category: string;
  image: File;
}): Promise<Listing> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("category", data.category);
  formData.append("image", data.image);

  const res = await fetch(`${API_BASE}/api/listings`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create listing");
  const result: BackendListing = await res.json();
  return toListing(result);
}

export async function analyzeImage(imageFile: File): Promise<{
  title: string;
  description: string;
  category: Category;
  price: number;
}> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to analyze image");
  return res.json();
}

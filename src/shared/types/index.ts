// src/shared/types/index.ts
import { ProductStatus, ProductCategory } from "@prisma/client";

export interface ProductDTO {
  id: string;
  title: string;
  slug: string;
  originalPrice: number; // Converted from Decimal
  price: number; // Converted from Decimal
  discount: number; // Converted from Decimal
  currency: string;
  salesCount: number;
  averageRating: number; // Converted from Decimal
  shortDescription: string | null;
  longDescription: string | null;
  thumbnailUrl: string | null;
  isHighResolution: boolean;
  isWidgetReady: boolean;
  layout: string | null;
  fileSize: string | null;
  framework: string | null;
  category: ProductCategory;
  subcategory: string | null;
  status: ProductStatus;
  publishedAt: string | null; // serialized date
  lastUpdate: string; // serialized date
  createdAt: string; // serialized date
  updatedAt: string; // serialized date
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  productCount: number;
  createdAt: string; // serialized date
  updatedAt: string; // serialized date
}


// Navigational structure for admin panel / start
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section: string;
}
// Navigational structure for admin panel / end
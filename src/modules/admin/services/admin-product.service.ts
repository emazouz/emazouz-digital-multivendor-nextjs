import prisma from "@/shared/lib/prisma";
import { Product, ProductCategory, ProductStatus } from "@prisma/client";

// ============================
// Types
// ============================
export interface AdminProductDTO {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  originalPrice: number;
  discount: number;
  salesCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  sortBy?: "title" | "price" | "createdAt" | "salesCount";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedProductsResult {
  products: AdminProductDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================
// Mappers
// ============================
export const mapProductToAdminDTO = (product: Product): AdminProductDTO => {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    thumbnailUrl: product.thumbnailUrl,
    category: product.category,
    status: product.status,
    price: product.price?.toNumber() ?? 0,
    originalPrice: product.originalPrice?.toNumber() ?? 0,
    discount: product.discount ?? 0,
    salesCount: product.salesCount,
    averageRating: product.averageRating?.toNumber() ?? 0,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
};

// ============================
// Admin Product Service Functions
// ============================

/**
 * Get single product by slug for admin
 */
export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      productFiles: true,
      productImages: {
        orderBy: { displayOrder: "asc" },
      },
      productTags: {
        include: { tag: true },
      },
      productFeatures: {
        include: { feature: true },
      },
      productCompatibles: {
        include: { compatible: true },
      },
      productSoftwareVersions: {
        include: { softwareVersion: true },
      },
      productBrowsers: {
        include: { browser: true },
      },
    },
  });

  return product;
};

/**
 * Get paginated products list for admin dashboard
 */
export const getAdminProducts = async (
  params: ProductsListParams = {},
): Promise<PaginatedProductsResult> => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  // Get total count
  const total = await prisma.product.count({ where });

  // Get products
  const products = await prisma.product.findMany({
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  return {
    products: products.map(mapProductToAdminDTO),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get single product by ID for admin
 */
export const getAdminProductById = async (
  id: string,
): Promise<AdminProductDTO | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return null;

  return mapProductToAdminDTO(product);
};

/**
 * Delete product by ID
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Get product statistics for admin dashboard
 */
export const getProductStats = async () => {
  const [total, published, draft, archived] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: ProductStatus.PUBLISHED } }),
    prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
    prisma.product.count({ where: { status: ProductStatus.ARCHIVED } }),
  ]);

  return {
    total,
    published,
    draft,
    archived,
  };
};

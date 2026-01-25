import prisma from "@/shared/lib/prisma";
import { Product, ProductCategory, ProductStatus } from "@prisma/client";

import { ProductDTO } from "@/shared/types";

export const mapProductToDTO = (product: Product): ProductDTO => {
  return {
    ...product,
    originalPrice: product.originalPrice?.toNumber() ?? 0,
    price: product.price?.toNumber() ?? 0,
    discount: product.discount?.toNumber() ?? 0,
    averageRating: product.averageRating?.toNumber() ?? 0,
    currency: "USD", // Default currency - change as needed
    publishedAt: product.publishedAt ? product.publishedAt.toISOString() : null,
    lastUpdate: product.lastUpdate
      ? product.lastUpdate.toISOString()
      : new Date().toISOString(),
    createdAt: product.createdAt
      ? product.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: product.updatedAt
      ? product.updatedAt.toISOString()
      : new Date().toISOString(),
  };
};

export const getFeaturedProducts = async (): Promise<ProductDTO[]> => {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.PUBLISHED,
    },
    orderBy: {
      salesCount: "desc",
    },
    take: 10,
  });

  return products.map(mapProductToDTO);
};

export const getProductsByCategory = async (
  category: ProductCategory,
): Promise<ProductDTO[]> => {
  const products = await prisma.product.findMany({
    where: {
      category: category,
    },
    orderBy: {
      salesCount: "desc",
    },
    take: 10,
  });

  return products.map(mapProductToDTO);
};

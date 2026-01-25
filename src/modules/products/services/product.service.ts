import prisma from "@/shared/lib/prisma";
import { Product, ProductCategory, ProductStatus } from "@prisma/client";

import { ProductDTO } from "@/shared/types";

export const mapProductToDTO = (product: Product): ProductDTO => {
  return {
    ...product,
    price: product.price.toNumber(),
    averageRating: product.averageRating.toNumber(),
    publishedAt: product.publishedAt ? product.publishedAt.toISOString() : null,
    lastUpdate: product.lastUpdate.toISOString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
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

"use server";

import { ProductCategory } from "@prisma/client";
import { getAllCategories } from "../services/categories.service";
import {
  getFeaturedProducts,
  getProductsByCategory,
} from "../services/product.service";
import { ProductDTO } from "@/shared/types";

export async function fetchProductsAction(): Promise<ProductDTO[]> {
  const products = await getFeaturedProducts();
  return products;
}

export async function fetchProductsByCategoryAction(
  category: ProductCategory,
): Promise<ProductDTO[]> {
  const products = await getProductsByCategory(category);
  return products;
}

// Get all categories
export async function fetchCategoriesAction(): Promise<ProductCategory[]> {
  const categories = await getAllCategories();
  return categories;
}

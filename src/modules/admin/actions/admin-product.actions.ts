"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminProducts,
  getProductStats,
  deleteProduct,
  ProductsListParams,
} from "../services/admin-product.service";

/**
 * Get paginated products list
 */
export async function getProductsAction(params: ProductsListParams = {}) {
  try {
    const result = await getAdminProducts(params);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

/**
 * Get product statistics
 */
export async function getProductStatsAction() {
  try {
    const stats = await getProductStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return { success: false, error: "Failed to fetch product stats" };
  }
}

/**
 * Delete a product
 */
export async function deleteProductAction(id: string) {
  try {
    const success = await deleteProduct(id);
    if (success) {
      revalidatePath("/admin/products");
      return { success: true };
    }
    return { success: false, error: "Product not found" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

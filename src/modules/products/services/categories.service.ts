import { ProductCategory } from "@prisma/client";

export const getAllCategories = (): ProductCategory[] => {
  return Object.values(ProductCategory);
};

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/shared/lib/prisma";
import {
  createProductSchema,
  CreateProductInput,
} from "../schemas/product.schema";

export type ActionState = {
  success?: boolean;
  error?: string | null;
  fieldErrors?: Record<string, string[]> | null;
};

export async function createProductAction(
  data: CreateProductInput,
): Promise<ActionState> {
  const result = createProductSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    slug,
    price,
    originalPrice,
    discount,
    category,
    status,
    shortDescription,
    longDescription,
    thumbnailUrl,
    isHighResolution,
    isWidgetReady,
    fileUrl,
    fileName,
    fileSize,
  } = result.data;

  try {
    // Check for unique slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return {
        success: false,
        error:
          "A product with this slug already exists. Please choose a different one.",
      };
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        price,
        originalPrice,
        discount,
        category,
        status,
        shortDescription,
        longDescription,
        thumbnailUrl: thumbnailUrl || null,
        isHighResolution,
        isWidgetReady,
      },
    });

    if (fileUrl) {
      // Infer file type from extension
      const extension = fileName?.split(".").pop()?.toLowerCase() || "unknown";
      
      // Create product file record if file is uploaded
      await prisma.productFile.create({
        data: {
          productId: newProduct.id,
          fileName: fileName || "Product File",
          fileUrl: fileUrl,
          fileType: extension,
          fileSizeBytes: fileSize ? BigInt(fileSize) : BigInt(0),
        },
      });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating the product.",
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

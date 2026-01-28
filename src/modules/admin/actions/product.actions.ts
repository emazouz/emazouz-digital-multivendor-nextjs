"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import {
  createProductSchema,
  CreateProductInput,
  updateProductSchema,
  UpdateProductInput,
} from "../schemas/product.schema";

export type ActionState = {
  success?: boolean;
  error?: string | null;
  fieldErrors?: Record<string, string[]> | null;
};

export async function createProductAction(
  data: CreateProductInput,
): Promise<ActionState> {
  // 1. Authentication Check
  const session = await auth();
  
  if (!session?.user) {
    return {
      success: false,
      error: "Authentication required. Please sign in.",
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Unauthorized. Admin access required.",
    };
  }

  // 2. Validation
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
    subcategory,
    status,
    shortDescription,
    longDescription,
    thumbnailUrl,
    isHighResolution,
    isWidgetReady,
    layout,
    framework,
    fileUrl,
    fileName,
    fileSize,
  } = result.data;

  try {
    // 3. Check for unique slug
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

    // 4. File validation
    if (fileUrl && fileName) {
      const extension = fileName.split(".").pop()?.toLowerCase() || "";
      const allowedExtensions = ["zip", "rar", "pdf"];
      
      if (!allowedExtensions.includes(extension)) {
        return {
          success: false,
          error: "Invalid file type. Only ZIP, RAR, and PDF files are allowed.",
        };
      }
    }

    // 5. Create product with transaction
    const newProduct = await prisma.$transaction(async (tx) => {
      // Determine publishedAt based on status
      const publishedAt = status === "PUBLISHED" ? new Date() : null;

      // Create product
      const product = await tx.product.create({
        data: {
          title,
          slug,
          price,
          originalPrice,
          discount,
          category,
          subcategory: subcategory || null,
          status,
          shortDescription,
          longDescription,
          thumbnailUrl: thumbnailUrl || null,
          isHighResolution,
          isWidgetReady,
          layout: layout || null,
          framework: framework || null,
          publishedAt,
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      });

      // Create product file if uploaded
      if (fileUrl && fileName && fileSize) {
        const extension = fileName.split(".").pop()?.toLowerCase() || "unknown";
        
        await tx.productFile.create({
          data: {
            productId: product.id,
            fileName: fileName,
            fileUrl: fileUrl,
            fileType: extension,
            fileSizeBytes: BigInt(fileSize),
          },
        });
      }

      return product;
    });

    revalidatePath("/admin/products");
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Duplicate entry detected. The slug might already exist.",
        };
      }
      if (error.code === "P2003") {
        return {
          success: false,
          error: "Invalid reference. Please check related data.",
        };
      }
    }

    // Generic error
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred while creating the product.",
    };
  }
}

export async function updateProductAction(
  data: UpdateProductInput,
): Promise<ActionState> {
  // 1. Authentication Check
  const session = await auth();
  
  if (!session?.user) {
    return {
      success: false,
      error: "Authentication required. Please sign in.",
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Unauthorized. Admin access required.",
    };
  }

  // 2. Validation
  const result = updateProductSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const {
    id,
    title,
    slug,
    price,
    originalPrice,
    discount,
    category,
    subcategory,
    status,
    shortDescription,
    longDescription,
    thumbnailUrl,
    isHighResolution,
    isWidgetReady,
    layout,
    framework,
    fileUrl,
    fileName,
    fileSize,
  } = result.data;

  try {
    // 3. Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    // 4. Check for slug uniqueness (excluding current product)
    const slugExists = await prisma.product.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (slugExists) {
      return {
        success: false,
        error: "A product with this slug already exists. Please choose a different one.",
      };
    }

    // 5. File validation
    if (fileUrl && fileName) {
      const extension = fileName.split(".").pop()?.toLowerCase() || "";
      const allowedExtensions = ["zip", "rar", "pdf"];
      
      if (!allowedExtensions.includes(extension)) {
        return {
          success: false,
          error: "Invalid file type. Only ZIP, RAR, and PDF files are allowed.",
        };
      }
    }

    // 6. Update product with transaction
    await prisma.$transaction(async (tx) => {
      // Determine publishedAt based on status change
      const publishedAtUpdate: { publishedAt?: Date | null } = {};
      
      if (status === "PUBLISHED" && existingProduct.status !== "PUBLISHED") {
        publishedAtUpdate.publishedAt = new Date();
      } else if (status !== "PUBLISHED" && existingProduct.status === "PUBLISHED") {
        publishedAtUpdate.publishedAt = null;
      }

      // Update product
      await tx.product.update({
        where: { id },
        data: {
          title,
          slug,
          price,
          originalPrice,
          discount,
          category,
          subcategory: subcategory || null,
          status,
          shortDescription,
          longDescription,
          thumbnailUrl: thumbnailUrl || null,
          isHighResolution,
          isWidgetReady,
          layout: layout || null,
          framework: framework || null,
          ...publishedAtUpdate,
          updatedBy: session.user.id,
        },
      });

      // Handle new file upload
      if (fileUrl && fileName && fileSize) {
        const extension = fileName.split(".").pop()?.toLowerCase() || "unknown";
        
        // Delete old files if exists
        await tx.productFile.deleteMany({
          where: { productId: id },
        });
        
        // Create new file
        await tx.productFile.create({
          data: {
            productId: id,
            fileName: fileName,
            fileUrl: fileUrl,
            fileType: extension,
            fileSizeBytes: BigInt(fileSize),
          },
        });
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${slug}`);
    revalidatePath(`/admin/products/${slug}/view`);
    revalidatePath(`/admin/products/${slug}/edit`);
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error updating product:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Duplicate entry detected. The slug might already exist.",
        };
      }
      if (error.code === "P2003") {
        return {
          success: false,
          error: "Invalid reference. Please check related data.",
        };
      }
    }

    // Generic error
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred while updating the product.",
    };
  }
}

import { z } from "zod";
import { ProductCategory, ProductStatus } from "@prisma/client";

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens",
    ),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0, "Original price must be positive"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
  category: z.nativeEnum(ProductCategory),
  status: z.nativeEnum(ProductStatus),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isHighResolution: z.boolean().default(false),
  isWidgetReady: z.boolean().default(false),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

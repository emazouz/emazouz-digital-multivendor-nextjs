import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getProductBySlug } from "@/modules/admin/services/admin-product.service";
import AdminProductForm from "@/modules/admin/components/admin-product-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `Edit: ${product.title} | Admin`,
    description: `Edit product: ${product.title}`,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get the first file if exists
  const existingFile = product.productFiles[0];

  // Transform product data to match form inputs
  const initialData = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription || "",
    longDescription: product.longDescription || "",
    price: Number(product.price),
    originalPrice: Number(product.originalPrice),
    discount: product.discount,
    category: product.category,
    subcategory: product.subcategory || "",
    status: product.status,
    thumbnailUrl: product.thumbnailUrl || "",
    isHighResolution: product.isHighResolution,
    isWidgetReady: product.isWidgetReady,
    layout: product.layout || "",
    framework: product.framework || "",
    fileUrl: existingFile?.fileUrl || "",
    fileName: existingFile?.fileName || "",
    fileSize: existingFile ? String(existingFile.fileSizeBytes) : "0",
  };

  return (
    <div className="section">
      <AdminProductForm mode="edit" initialData={initialData} />
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Package,
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  Download,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { getProductBySlug } from "@/modules/admin/services/admin-product.service";

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
    title: `View: ${product.title} | Admin`,
    description: product.shortDescription || undefined,
  };
}

export default async function ViewProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: string | number) => {
    return Number(price || 0).toFixed(2);
  };

  return (
    <div className="space-y-6 section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.title}
            </h1>
            <p className="text-muted-foreground">
              Product Details • {product.slug}
            </p>
          </div>
        </div>
        <Link href={`/admin/products/${product.slug}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Main Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Title
                </label>
                <p className="text-base">{product.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Slug
                </label>
                <p className="text-base font-mono text-sm">
                  /products/{product.slug}
                </p>
              </div>

              {product.shortDescription && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Short Description
                  </label>
                  <p className="text-base">{product.shortDescription}</p>
                </div>
              )}

              {product.longDescription && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Description
                  </label>
                  <p className="text-base whitespace-pre-wrap">
                    {product.longDescription}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features & Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    High Resolution
                  </label>
                  <p className="text-base">
                    {product.isHighResolution ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Widget Ready
                  </label>
                  <p className="text-base">
                    {product.isWidgetReady ? "Yes" : "No"}
                  </p>
                </div>

                {product.layout && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Layout
                    </label>
                    <p className="text-base">{product.layout}</p>
                  </div>
                )}

                {product.framework && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Framework
                    </label>
                    <p className="text-base">{product.framework}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Files */}
          {product.productFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Product Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.productFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.fileType.toUpperCase()} •{" "}
                            {(Number(file.fileSizeBytes) / 1024 / 1024).toFixed(
                              2,
                            )}{" "}
                            MB
                          </p>
                        </div>
                      </div>
                      {file.version && (
                        <Badge variant="secondary">v{file.version}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Images */}
          {product.productImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {product.productImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-video overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={img.imageUrl}
                        alt={`Product image ${img.displayOrder}`}
                        fill
                        className="object-cover"
                      />
                      {img.isPreview && (
                        <Badge className="absolute top-2 right-2">
                          Preview
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  product.status === "PUBLISHED"
                    ? "default"
                    : product.status === "DRAFT"
                      ? "secondary"
                      : "outline"
                }
                className="text-base px-3 py-1"
              >
                {product.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Current Price
                </label>
                <p className="text-2xl font-bold">
                  ${formatPrice(product.price?.toString() ?? 0)}
                </p>
              </div>

              {product.originalPrice &&
                product.originalPrice.toNumber() >
                  (product.price?.toNumber() ?? 0) && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Original Price
                      </label>
                      <p className="text-lg line-through text-muted-foreground">
                        ${formatPrice(product.originalPrice.toString())}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Discount
                      </label>
                      <p className="text-lg font-semibold text-green-600">
                        {product.discount}% OFF
                      </p>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Main Category
                </label>
                <p className="text-base">{product.category}</p>
              </div>

              {product.subcategory && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Subcategory
                  </label>
                  <p className="text-base">{product.subcategory}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail */}
          {product.thumbnailUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Sales Count
                </label>
                <p className="text-2xl font-bold">{product.salesCount}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </label>
                <p className="text-2xl font-bold">
                  {formatPrice(product.averageRating?.toString() ?? 0)} / 5.00
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">
                  Published At
                </label>
                <p>{formatDate(product.publishedAt)}</p>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">
                  Created At
                </label>
                <p>{formatDate(product.createdAt)}</p>
              </div>

              <div>
                <label className="font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p>{formatDate(product.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

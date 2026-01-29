"use client";

import React, {
  useState,
  useTransition,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ProductCategory, ProductStatus } from "@prisma/client";
import { Loader2, Save, X, File, Image as ImageIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  createProductSchema,
  CreateProductInput,
  updateProductSchema,
  UpdateProductInput,
} from "../schemas/product.schema";
import {
  createProductAction,
  updateProductAction,
} from "../actions/product.actions";
import { ImageUpload } from "@/shared/components/image-upload";
import { FileUpload } from "@/shared/components/file-upload";
import { toast } from "sonner"; // Or your preferred toast library
import Image from "next/image";

// Types
type UploadResponse = {
  url: string;
  name: string;
  size: number;
};

type FormError = {
  message: string;
  field?: string;
};

// Constants
const CATEGORY_DISPLAY_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.THEME]: "Theme",
  [ProductCategory.PLUGIN]: "Plugin",
  [ProductCategory.WORDPRESS]: "WordPress",
  [ProductCategory.GRAPHIC]: "Graphic",
  [ProductCategory.HTML]: "Html",
  [ProductCategory.JS_MOBILE]: "JavaScript - Mobile App",
  [ProductCategory.JS_WEB]: "JavaScript - Website",
  [ProductCategory.PHP]: "PHP",
  [ProductCategory.OTHER]: "Other",
};

// Utilities
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const formatFileSize = (bytes: number | string): string => {
  const numBytes = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (numBytes === 0 || isNaN(numBytes)) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return Math.round((numBytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const validateFileType = (url: string, allowedTypes: string[]): boolean => {
  const extension = url.split(".").pop()?.toLowerCase();
  return !!extension && allowedTypes.includes(extension);
};

const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toUpperCase() || "FILE";
};

export default function AdminProductForm({
  mode = "create",
  initialData,
}: {
  mode?: "create" | "edit";
  initialData?: UpdateProductInput;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<FormError | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const isEditMode = mode === "edit";
  const schema = isEditMode ? updateProductSchema : createProductSchema;

  const form = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(schema) as Resolver<
      CreateProductInput | UpdateProductInput
    >,
    defaultValues: initialData || {
      title: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      category: ProductCategory.THEME,
      subcategory: "",
      status: ProductStatus.DRAFT,
      thumbnailUrl: "",
      isHighResolution: false,
      isWidgetReady: false,
      layout: "",
      framework: "",
      fileUrl: "",
      fileName: "",
      fileSize: "0",
    },
  });

  const isDirty = form.formState.isDirty;
  const isFormValid = form.formState.isValid;

  // Watch uploaded files
  // eslint-disable-next-line react-hooks/incompatible-library
  const thumbnailUrl = form.watch("thumbnailUrl");
  const fileUrl = form.watch("fileUrl");
  const fileName = form.watch("fileName");
  const fileSize = form.watch("fileSize");

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Auto-calculate discount based on prices
  const watchPrice = form.watch("price");
  const watchOriginalPrice = form.watch("originalPrice");

  useEffect(() => {
    if (watchPrice && watchOriginalPrice && watchOriginalPrice > watchPrice) {
      const calculatedDiscount = Math.round(
        ((watchOriginalPrice - watchPrice) / watchOriginalPrice) * 100,
      );
      form.setValue("discount", calculatedDiscount, { shouldDirty: false });
    } else if (watchPrice >= watchOriginalPrice) {
      form.setValue("discount", 0, { shouldDirty: false });
    }
  }, [watchPrice, watchOriginalPrice, form]);

  // Memoized category options
  const categoryOptions = useMemo(
    () =>
      Object.values(ProductCategory).map((category) => ({
        value: category,
        label: CATEGORY_DISPLAY_NAMES[category] || category,
      })),
    [],
  );

  // Handlers
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      form.setValue("title", title);
      const slug = generateSlug(title);
      form.setValue("slug", slug);
    },
    [form],
  );

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (confirmed) {
        router.back();
      }
    } else {
      router.back();
    }
  }, [isDirty, router]);

  const handleDeleteThumbnail = useCallback(() => {
    form.setValue("thumbnailUrl", "");
    toast.success("Thumbnail removed");
  }, [form]);

  const handleDeleteFile = useCallback(() => {
    form.setValue("fileUrl", "");
    form.setValue("fileName", "");
    form.setValue("fileSize", "0");
    toast.success("File removed");
  }, [form]);

  const onSubmit = useCallback(
    (values: CreateProductInput | UpdateProductInput) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = isEditMode
            ? await updateProductAction(values as UpdateProductInput)
            : await createProductAction(values as CreateProductInput);

          if (!result.success && result.error) {
            setError({ message: result.error });
            toast.error(result.error);
          } else if (result.success) {
            toast.success(
              isEditMode
                ? "Product updated successfully!"
                : "Product created successfully!",
            );
            router.push("/admin/products");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError({ message: errorMessage });
          toast.error(errorMessage);
        }
      });
    },
    [router, isEditMode],
  );

  const isSubmitDisabled =
    isPending || isUploadingImage || isUploadingFile || !isFormValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Update product information and settings."
                : "Create a new product to add to your catalog."}
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              aria-label="Cancel and go back"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              aria-label="Save product"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? "Update Product" : "Save Product"}
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm font-medium"
          >
            {error.message}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px]">
          {/* Main Column (Left/Center) */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Basic details about your product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-md">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Modern WordPress Theme"
                          aria-label="Product name"
                          aria-required="true"
                          {...field}
                          onChange={handleTitleChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                            /products/
                          </span>
                          <Input
                            placeholder="modern-wordpress-theme"
                            className="rounded-l-none"
                            aria-label="Product URL slug"
                            aria-describedby="slug-description"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription id="slug-description">
                        Unique identifier for the product URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief summary of the product..."
                          className="h-20 resize-none"
                          aria-label="Short product description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of features and usage..."
                          className="min-h-50"
                          aria-label="Full product description"
                          aria-describedby="long-description-help"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription id="long-description-help">
                        Detailed information about the product. Markdown is
                        supported.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features & Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isHighResolution"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label="High resolution product"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>High Resolution</FormLabel>
                          <FormDescription>
                            This product includes high-res assets.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isWidgetReady"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label="Widget ready product"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Widget Ready</FormLabel>
                          <FormDescription>
                            Compatible with widget systems.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Select layout type">
                            <SelectValue placeholder="Select layout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Responsive">Responsive</SelectItem>
                          <SelectItem value="Fixed">Fixed</SelectItem>
                          <SelectItem value="Fluid">Fluid</SelectItem>
                          <SelectItem value="Adaptive">Adaptive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the layout design type
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Framework</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Underscores, Bootstrap, Custom"
                          aria-label="Product framework"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The framework or starter used for development
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (Right) */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Select product status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ProductStatus.DRAFT}>
                            Draft
                          </SelectItem>
                          <SelectItem value={ProductStatus.PUBLISHED}>
                            Published
                          </SelectItem>
                          <SelectItem value={ProductStatus.ARCHIVED}>
                            Archived
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          aria-label="Product price in dollars"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          aria-label="Original price before discount"
                          aria-describedby="original-price-help"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription id="original-price-help">
                        Strike-through price for sales.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          aria-label="Discount percentage"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Auto-calculated based on price difference
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Select product category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Corporate, Blog, Portfolio"
                          aria-label="Product subcategory"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional subcategory for better organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
              </CardHeader>
              <CardContent className="space-md">
                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        {!thumbnailUrl ? (
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isPending || isUploadingImage}
                            onUploadStart={() => setIsUploadingImage(true)}
                            onUploadComplete={() => setIsUploadingImage(false)}
                          />
                        ) : (
                          <div className="space-y-3">
                            {/* Image Preview */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                              <Image
                                src={thumbnailUrl}
                                alt="Product thumbnail"
                                fill
                                className="h-full w-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 h-8 w-8"
                                onClick={handleDeleteThumbnail}
                                disabled={isPending}
                                aria-label="Delete thumbnail"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {/* Change Image Button */}
                            <div className="flex items-center justify-between rounded-md border p-3">
                              <div className="flex items-center gap-3">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">
                                    Thumbnail uploaded
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Click delete to change
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </FormControl>
                      <FormDescription>
                        Upload a high-quality image for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {mode === "edit" && (
              <Card>
                <CardHeader>
                  <CardTitle>Digital Product</CardTitle>
                  <CardDescription>
                    Upload the main product file (ZIP, RAR, PDF).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-md">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product File</FormLabel>
                        <FormControl>
                          {!fileUrl ? (
                            <FileUpload
                              endpoint="productFile"
                              value={field.value}
                              onClientUploadComplete={(
                                res?: UploadResponse,
                              ) => {
                                setIsUploadingFile(false);
                                if (!res) return;

                                // Validate file type
                                if (
                                  !validateFileType(res.url, [
                                    "zip",
                                    "rar",
                                    "pdf",
                                  ])
                                ) {
                                  setError({
                                    message:
                                      "Invalid file type. Only ZIP, RAR, and PDF files are allowed.",
                                    field: "fileUrl",
                                  });
                                  toast.error("Invalid file type");
                                  return;
                                }

                                field.onChange(res.url);
                                form.setValue("fileName", res.name);
                                form.setValue("fileSize", res.size.toString());
                                toast.success("File uploaded successfully");
                              }}
                              onUploadError={(error: Error) => {
                                setIsUploadingFile(false);
                                const errorMessage = `Upload failed: ${error.message}`;
                                setError({
                                  message: errorMessage,
                                  field: "fileUrl",
                                });
                                toast.error(errorMessage);
                              }}
                              onUploadBegin={() => {
                                setIsUploadingFile(true);
                                setError(null);
                              }}
                            />
                          ) : (
                            <div className="space-y-3">
                              {/* File Preview */}
                              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 shrink-0">
                                    <File className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {fileName || "Product file"}
                                    </p>
                                    <div className="flex items-center gap-sm text-xs text-muted-foreground">
                                      <span className="font-medium">
                                        {getFileExtension(fileName || "")}
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {formatFileSize(
                                          (fileSize as string) || 0,
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                  onClick={handleDeleteFile}
                                  disabled={isPending}
                                  aria-label="Delete file"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {/* File Info */}
                              <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 p-3">
                                <div className="flex items-center gap-sm">
                                  <div className="h-2 w-2 rounded-full bg-green-500" />
                                  <p className="text-xs font-medium text-green-900 dark:text-green-100">
                                    File uploaded successfully
                                  </p>
                                </div>
                                <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                                  Click the X button above to upload a different
                                  file
                                </p>
                              </div>
                            </div>
                          )}
                        </FormControl>
                        <FormDescription>
                          Allowed formats: ZIP, RAR, PDF. Max size: 1GB.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}

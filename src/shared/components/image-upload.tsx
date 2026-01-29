"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import getCroppedImg from "@/shared/utils/canvas-utils";
import { uploadImage } from "@/modules/admin/actions/upload.actions";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  onUploadStart,
  onUploadComplete,
}: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isBitUploading, setIsBitUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dropzone handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setIsDialogOpen(true);
      });
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: disabled || isBitUploading,
  });

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsBitUploading(true);
      onUploadStart?.();
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Create FormData to send to server action
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped-image.jpg");

      const result = await uploadImage(formData);

      if (result.success && result.url) {
        onChange(result.url);
        setIsDialogOpen(false);
        setImageSrc(null); // Reset source
      } else {
        console.error("Upload failed:", result.error);
        // We could add a toast here for error
      }
    } catch (e) {
      console.error("Error cropping/uploading:", e);
    } finally {
      setIsBitUploading(false);
      onUploadComplete?.();
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-md">
      {/* If we have a value (URL), show preview */}
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted group">
          <Image
            src={value}
            alt="Product thumbnail"
            fill
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Otherwise show Dropzone */
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-10 cursor-pointer text-center hover:bg-muted/50 transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-sm text-muted-foreground">
            <div className="p-2 bg-muted rounded-full">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-xs">JPG, PNG, WEBP (max 10MB)</p>
          </div>
        </div>
      )}

      {/* Cropper Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Adjust user image before uploading.
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-[400px] w-full bg-black/5 mt-4 rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9} // Enforce 16:9 aspect ratio for product thumbnails usually
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="space-md mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setImageSrc(null);
              }}
              disabled={isBitUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isBitUploading}>
              {isBitUploading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

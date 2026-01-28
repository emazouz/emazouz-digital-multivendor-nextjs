"use client";

import { UploadDropzone } from "@/shared/lib/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { X, FileIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

interface FileUploadProps {
  endpoint: keyof OurFileRouter;
  value?: string;
  onClientUploadComplete: (
    res: { url: string; name: string; size: number } | undefined,
  ) => void;
  onUploadError?: (error: Error) => void;
  onUploadBegin?: () => void;
}

export const FileUpload = ({
  endpoint,
  value,
  onClientUploadComplete,
  onUploadError,
  onUploadBegin,
}: FileUploadProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  if (value) {
    return (
      <div className="relative flex items-center p-4 mt-2 rounded-md border bg-muted/50">
        <FileIcon className="h-10 w-10 fill-blue-200 stroke-blue-400" />
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-blue-900 break-all">
            {fileName || value.split("/").pop() || "Uploaded File"}
          </p>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            View File
          </a>
        </div>
        <Button
          onClick={() => {
            // In a real app we might want to delete from UT here too,
            // but for now we just clear the state
            onClientUploadComplete(undefined);
          }}
          type="button"
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-slate-200 transition-colors"
        >
          <X className="h-4 w-4 text-slate-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50/50 transition-colors">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            onClientUploadComplete({
              url: res[0].url,
              name: res[0].name,
              size: res[0].size,
            });
            setFileName(res[0].name);
          }
        }}
        onUploadError={(error: Error) => {
          if (onUploadError) {
            onUploadError(error);
          } else {
            console.log(error);
            alert(`ERROR! ${error.message}`);
          }
        }}
        onUploadBegin={() => {
          if (onUploadBegin) {
            onUploadBegin();
          }
        }}
        appearance={{
          button: "bg-primary text-primary-foreground hover:bg-primary/90",
          container: "w-full border-0 p-0",
          label: "text-muted-foreground hover:text-primary",
        }}
      />
    </div>
  );
};

"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface SimpleUploadButtonProps {
  endpoint: "imageUploader" | "pdfUploader" | "resumeUploader" | "documentUploader" | "applicationAttachment";
  onUploadComplete?: (url: string, fileName: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function SimpleUploadButton({
  endpoint,
  onUploadComplete,
  onUploadError,
  className,
}: SimpleUploadButtonProps) {
  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          onUploadComplete?.(res[0].ufsUrl, res[0].name);
        }
      }}
      onUploadError={(error: Error) => {
        onUploadError?.(error);
      }}
      className={cn(className)}
      appearance={{
        button: cn(
          "ut-ready:bg-blue-600 ut-ready:hover:bg-blue-700",
          "ut-uploading:bg-blue-400 ut-uploading:cursor-not-allowed",
          "after:bg-blue-700",
          "dark:ut-ready:bg-blue-500 dark:ut-ready:hover:bg-blue-600"
        ),
        allowedContent: "text-slate-500 dark:text-slate-400",
      }}
    />
  );
}

interface SimpleUploadDropzoneProps {
  endpoint: "imageUploader" | "pdfUploader" | "resumeUploader" | "documentUploader" | "applicationAttachment";
  onUploadComplete?: (urls: string[], fileNames: string[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function SimpleUploadDropzone({
  endpoint,
  onUploadComplete,
  onUploadError,
  className,
}: SimpleUploadDropzoneProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          const urls = res.map((file) => file.ufsUrl);
          const names = res.map((file) => file.name);
          onUploadComplete?.(urls, names);
        }
      }}
      onUploadError={(error: Error) => {
        onUploadError?.(error);
      }}
      className={cn(className)}
      appearance={{
        container: cn(
          "border-2 border-dashed rounded-xl transition-colors",
          "border-slate-300 dark:border-slate-600",
          "bg-slate-50 dark:bg-slate-800/50",
          "hover:border-blue-400 dark:hover:border-blue-500"
        ),
        uploadIcon: "text-slate-400 dark:text-slate-500",
        label: "text-slate-700 dark:text-slate-300",
        allowedContent: "text-slate-500 dark:text-slate-400",
        button: cn(
          "ut-ready:bg-blue-600 ut-ready:hover:bg-blue-700",
          "ut-uploading:bg-blue-400 ut-uploading:cursor-not-allowed",
          "after:bg-blue-700",
          "dark:ut-ready:bg-blue-500 dark:ut-ready:hover:bg-blue-600"
        ),
      }}
    />
  );
}

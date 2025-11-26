"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { X, Upload, FileText, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  endpoint: "imageUploader" | "pdfUploader" | "resumeUploader" | "documentUploader" | "applicationAttachment";
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  accept?: "image" | "pdf" | "both";
  disabled?: boolean;
}

interface UploadedFile {
  url: string;
  name: string;
  type: string;
}

export function FileUpload({
  endpoint,
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  className,
  accept = "both",
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((url) => ({
        url,
        name: url.split("/").pop() || "file",
        type: url.includes(".pdf") ? "application/pdf" : "image",
      }));
    }
    return [
      {
        url: value,
        name: value.split("/").pop() || "file",
        type: value.includes(".pdf") ? "application/pdf" : "image",
      },
    ];
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setUploadProgress(100);
      if (res) {
        const newFiles = res.map((file) => ({
          url: file.ufsUrl,
          name: file.name,
          type: file.type,
        }));
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);
        onChange(multiple ? updatedFiles.map((f) => f.url) : updatedFiles[0]?.url || "");
      }
      setTimeout(() => setUploadProgress(0), 1000);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      if (!multiple && files.length >= 1) {
        setError("Remove existing file before uploading a new one");
        setTimeout(() => setError(null), 3000);
        return;
      }
      if (multiple && files.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        setTimeout(() => setError(null), 3000);
        return;
      }

      setError(null);
      setIsUploading(true);
      await startUpload(acceptedFiles);
    },
    [files, multiple, maxFiles, startUpload]
  );

  const removeFile = (urlToRemove: string) => {
    const updatedFiles = files.filter((f) => f.url !== urlToRemove);
    setFiles(updatedFiles);
    onChange(multiple ? updatedFiles.map((f) => f.url) : "");
  };

  const acceptConfig = {
    image: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    pdf: { "application/pdf": [".pdf"] },
    both: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "application/pdf": [".pdf"],
    },
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig[accept],
    maxFiles: multiple ? maxFiles - files.length : 1,
    disabled: disabled || isUploading || (!multiple && files.length >= 1),
  });

  const isPdf = (file: UploadedFile) =>
    file.type === "application/pdf" || file.url.toLowerCase().includes(".pdf");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer",
          "hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
          isDragActive && "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
          isUploading && "pointer-events-none opacity-60",
          disabled && "opacity-50 cursor-not-allowed",
          !multiple && files.length >= 1 && "opacity-50 cursor-not-allowed",
          "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {isUploading ? (
            <>
              <div className="relative">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Uploading...</p>
              <div className="w-full max-w-xs h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  or click to browse
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                {(accept === "image" || accept === "both") && (
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> Images
                  </span>
                )}
                {(accept === "pdf" || accept === "both") && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> PDF
                  </span>
                )}
                {multiple && <span>• Up to {maxFiles} files</span>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Uploaded {files.length === 1 ? "file" : "files"}
          </p>
          <div className={cn("grid gap-3", multiple ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
            {files.map((file) => (
              <div
                key={file.url}
                className="group relative flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
              >
                {/* File Preview */}
                {isPdf(file) ? (
                  <div className="flex-shrink-0 h-12 w-12 bg-red-50 dark:bg-red-950/50 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Uploaded
                  </div>
                </div>

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeFile(file.url)}
                    className="absolute top-2 right-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/50"
                  >
                    <X className="h-4 w-4 text-slate-500 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized components for common use cases
export function ImageUpload(props: Omit<FileUploadProps, "endpoint" | "accept">) {
  return <FileUpload {...props} endpoint="imageUploader" accept="image" />;
}

export function PdfUpload(props: Omit<FileUploadProps, "endpoint" | "accept">) {
  return <FileUpload {...props} endpoint="pdfUploader" accept="pdf" />;
}

export function ResumeUpload(props: Omit<FileUploadProps, "endpoint" | "accept" | "multiple" | "maxFiles">) {
  return <FileUpload {...props} endpoint="resumeUploader" accept="pdf" multiple={false} maxFiles={1} />;
}

export function DocumentUpload(props: Omit<FileUploadProps, "endpoint">) {
  return <FileUpload {...props} endpoint="documentUploader" accept="both" />;
}

export function ApplicationAttachmentUpload(props: Omit<FileUploadProps, "endpoint">) {
  return <FileUpload {...props} endpoint="applicationAttachment" accept="both" />;
}

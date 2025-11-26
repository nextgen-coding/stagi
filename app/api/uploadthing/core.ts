import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Image uploader for profile pictures, etc.
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // PDF uploader for resumes, cover letters, etc.
  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  // Resume uploader - accepts PDF and common document formats
  resumeUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resume upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl, fileName: file.name };
    }),

  // Document uploader - accepts multiple document types
  documentUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
    image: { maxFileSize: "8MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl, fileName: file.name };
    }),

  // Application attachment uploader - for internship applications
  applicationAttachment: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 3 },
    image: { maxFileSize: "4MB", maxFileCount: 3 },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Application attachment upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId, url: file.ufsUrl, fileName: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

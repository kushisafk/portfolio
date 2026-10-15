import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { listPortfolioAssets, savePortfolioAsset } from "./db";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;
const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"] as const;

const imageUploadInput = z.object({
  title: z.string().trim().min(1).max(160),
  originalName: z.string().trim().min(1).max(255),
  mimeType: z.enum(allowedMimeTypes),
  dataBase64: z.string()
    .min(4)
    .max(MAX_BASE64_LENGTH)
    .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
});

export function detectSupportedImage(buffer: Buffer): { mimeType: (typeof allowedMimeTypes)[number]; extension: string } | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mimeType: "image/png", extension: "png" };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return { mimeType: "image/webp", extension: "webp" };
  }
  return null;
}

export const portfolioRouter = router({
  list: publicProcedure.query(() => listPortfolioAssets()),

  upload: adminProcedure.input(imageUploadInput).mutation(async ({ ctx, input }) => {
    const data = Buffer.from(input.dataBase64, "base64");
    if (!data.length || data.length > MAX_IMAGE_BYTES || data.toString("base64") !== input.dataBase64) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Choose a valid image smaller than 10 MB." });
    }

    const image = detectSupportedImage(data);
    if (!image || image.mimeType !== input.mimeType) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "The file contents do not match a supported PNG, JPEG, or WebP image." });
    }

    const safeOriginalName = input.originalName.replace(/[\\/]/g, "_").slice(0, 255);
    const requestedKey = `portfolio/${ctx.user.id}/${randomUUID()}.${image.extension}`;

    try {
      const stored = await storagePut(requestedKey, data, image.mimeType);
      return await savePortfolioAsset({
        title: input.title,
        originalName: safeOriginalName,
        storageKey: stored.key,
        url: stored.url,
        mimeType: image.mimeType,
        sizeBytes: data.byteLength,
        uploadedBy: ctx.user.id,
      });
    } catch (error) {
      console.error("[Portfolio] Image upload failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "The image could not be saved. Please try again.",
      });
    }
  }),
});

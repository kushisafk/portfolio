import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { detectSupportedImage } from "./portfolio";

function createContext(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "portfolio-test-user",
      name: "Portfolio Test User",
      email: "portfolio@example.com",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const uploadInput = {
  title: "Test work",
  originalName: "test.png",
  mimeType: "image/png" as const,
  dataBase64: pngSignature.toString("base64"),
};

describe("portfolio image storage", () => {
  it("recognizes PNG, JPEG, and WebP byte signatures", () => {
    expect(detectSupportedImage(pngSignature)).toEqual({ mimeType: "image/png", extension: "png" });
    expect(detectSupportedImage(Buffer.from([0xff, 0xd8, 0xff, 0x00]))).toEqual({ mimeType: "image/jpeg", extension: "jpg" });
    expect(detectSupportedImage(Buffer.from("RIFF0000WEBP", "ascii"))).toEqual({ mimeType: "image/webp", extension: "webp" });
  });

  it("rejects unknown file signatures", () => {
    expect(detectSupportedImage(Buffer.from("not an image"))).toBeNull();
  });

  it("denies uploads from authenticated non-admin users", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.portfolio.upload(uploadInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects image data that does not match the declared MIME type before storage", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    await expect(caller.portfolio.upload({
      ...uploadInput,
      dataBase64: Buffer.from("not an image").toString("base64"),
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

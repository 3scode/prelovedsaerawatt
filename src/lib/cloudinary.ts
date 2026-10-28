import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "@/lib/env";

export function configureCloudinary(): boolean {
  const config = getCloudinaryConfig();
  if (!config) return false;
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
  return true;
}

export function isCloudinaryUrl(url: string): boolean {
  const config = getCloudinaryConfig();
  if (!config) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.startsWith(`/${config.cloudName}/`)
    );
  } catch {
    return false;
  }
}

export function isAllowedImageRef(url: string): boolean {
  if (url.startsWith("/images/")) return true;
  if (url.startsWith("data:image/")) return true;
  return isCloudinaryUrl(url);
}

export function extractPublicId(url: string): string | null {
  const config = getCloudinaryConfig();
  if (!config) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const afterUpload = parts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    const publicParts = versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;
    return publicParts.join("/").replace(/\.[a-zA-Z0-9]+$/, "") || null;
  } catch {
    return null;
  }
}

export function signCloudinaryUpload(folder: string) {
  if (!configureCloudinary()) return null;
  const config = getCloudinaryConfig();
  if (!config) return null;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    timestamp,
    folder,
    allowed_formats: "jpg,png,webp",
  };
  const signature = cloudinary.utils.api_sign_request(params, config.apiSecret);
  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    timestamp,
    folder,
    allowedFormats: params.allowed_formats,
    signature,
  };
}

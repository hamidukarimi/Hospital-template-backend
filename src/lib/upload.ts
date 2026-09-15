import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const categories = [
  "hero",
  "about",
  "services",
  "help",
  "lab-tests",
  "doctors",
  "articles",
  "site",
] as const;

for (const category of categories) {
  fs.mkdirSync(path.join(uploadRoot, category), { recursive: true });
}

const normalizeCategory = (rawCategory?: string) => {
  const value = (rawCategory || "site").trim().toLowerCase();
  return categories.includes(value as (typeof categories)[number])
    ? value
    : "site";
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const category = normalizeCategory(
      typeof req.body?.category === "string" ? req.body.category : undefined,
    );
    const destination = path.join(uploadRoot, category);
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: (_req, file, cb) => {
    const extension = path
      .extname(file.originalname || "image.jpg")
      .toLowerCase();
    const safeName = `${crypto.randomUUID()}${extension}`;
    cb(null, safeName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed."));
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export const getPublicUploadPath = (category: string, filename: string) => {
  const safeCategory = normalizeCategory(category);
  return `/uploads/${safeCategory}/${filename}`;
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AdminTokenPayload {
  adminId: string;
  role: string;
}

export const generateAdminToken = (
  payload: AdminTokenPayload
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyAdminToken = (
  token: string
): AdminTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
};
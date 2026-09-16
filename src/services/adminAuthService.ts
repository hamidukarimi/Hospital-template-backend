import prisma from "../lib/prisma.js";
import { comparePassword } from "../utils/password.js";
import { generateAdminToken } from "../utils/jwt.js";

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await comparePassword(
    password,
    admin.passwordHash
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateAdminToken({
    adminId: admin.id,
    role: admin.role,
  });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};
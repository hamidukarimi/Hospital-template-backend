import { Request, Response } from "express";
import { getAdminProfile, loginAdmin } from "../services/adminAuthService.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const adminLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginAdmin(email, password);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};

export const adminMe = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const adminId = req.admin?.adminId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const admin = await getAdminProfile(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("ADMIN ME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
    });
  }
};
import { Request, Response } from "express";
import { getDoctors } from "../services/doctors.service.js";

export const getDoctorsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const doctors = await getDoctors();

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Failed to get doctors:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get doctors",
    });
  }
};
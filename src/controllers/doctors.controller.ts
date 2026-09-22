import { Request, Response } from "express";
import { getDoctorBySlug, getDoctors } from "../services/doctors.service.js";

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

export const getDoctorBySlugController = async (
  req: Request,
  res: Response
) => {
  try {
    const doctor = await getDoctorBySlug(req.params.slug as string);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Failed to get doctor:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get doctor",
    });
  }
};

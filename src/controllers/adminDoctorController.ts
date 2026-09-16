import type { Request, Response } from "express";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from "../services/adminDoctorService.js";

export const getDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await getAllDoctors();

    return res.json({
      success: true,
      data: doctors,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

export const getDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await getDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.json({
      success: true,
      data: doctor,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
    });
  }
};

export const addDoctor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      specialty,
      description,
      image,
      profileUrl,
      category,
      isActive,
      sortOrder,
    } = req.body;

    if (!name || !specialty || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const doctor = await createDoctor({
      name,
      specialty,
      description,
      image,
      profileUrl,
      category,
      isActive,
      sortOrder,
    });

    return res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to create doctor",
    });
  }
};

export const editDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await updateDoctor(req.params.id, req.body);

    return res.json({
      success: true,
      data: doctor,
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};

export const removeDoctor = async (req: Request, res: Response) => {
  try {
    await deleteDoctor(req.params.id);

    return res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }
};
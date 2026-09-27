import type { Request, Response } from "express";
import { AppointmentError } from "../services/appointment.service.js";
import {
  addDoctorUnavailabilityAdmin,
  getDoctorSchedulesAdmin,
  removeDoctorUnavailabilityAdmin,
  replaceDoctorSchedulesAdmin,
} from "../services/adminDoctorScheduleService.js";

const handleError = (res: Response, error: unknown, fallback: string) => {
  if (error instanceof AppointmentError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(fallback, error);
  return res.status(500).json({
    success: false,
    message: fallback,
  });
};

export const getDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const data = await getDoctorSchedulesAdmin(String(req.params.doctorId));
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load doctor schedule.");
  }
};

export const putDoctorSchedule = async (req: Request, res: Response) => {
  try {
    const schedules = Array.isArray(req.body)
      ? req.body
      : req.body?.schedules;

    const data = await replaceDoctorSchedulesAdmin(
      String(req.params.doctorId),
      schedules,
    );
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to update doctor schedule.");
  }
};

export const addUnavailability = async (req: Request, res: Response) => {
  try {
    const data = await addDoctorUnavailabilityAdmin(
      String(req.params.doctorId),
      req.body,
    );
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to add unavailability.");
  }
};

export const removeUnavailability = async (req: Request, res: Response) => {
  try {
    await removeDoctorUnavailabilityAdmin(
      String(req.params.doctorId),
      String(req.params.unavailabilityId),
    );
    return res.json({
      success: true,
      message: "Unavailability removed.",
    });
  } catch (error) {
    return handleError(res, error, "Failed to remove unavailability.");
  }
};

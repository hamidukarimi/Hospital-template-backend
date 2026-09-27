import type { Request, Response } from "express";
import {
  AppointmentError,
  cancelAppointmentPublic,
  createAppointment,
  getAppointmentByReferencePublic,
  getBookableDoctors,
  getBookableServices,
  getDoctorAvailability,
} from "../services/appointment.service.js";

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

export const listBookableDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await getBookableDoctors();
    return res.json({ success: true, data: doctors });
  } catch (error) {
    return handleError(res, error, "Failed to load doctors.");
  }
};

export const listBookableServices = async (_req: Request, res: Response) => {
  try {
    const services = await getBookableServices();
    return res.json({ success: true, data: services });
  } catch (error) {
    return handleError(res, error, "Failed to load services.");
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const doctorId = String(req.params.doctorId || "");
    const date =
      typeof req.query.date === "string" ? req.query.date : undefined;

    const data = await getDoctorAvailability(doctorId, date);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load availability.");
  }
};

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await createAppointment(req.body);
    return res.status(201).json({
      success: true,
      data: appointment,
      message: "Appointment booked successfully.",
    });
  } catch (error) {
    return handleError(res, error, "Failed to book appointment.");
  }
};

export const lookupAppointment = async (req: Request, res: Response) => {
  try {
    const reference = String(req.params.reference || "");
    const data = await getAppointmentByReferencePublic(reference);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to look up appointment.");
  }
};

export const cancelPublicAppointment = async (req: Request, res: Response) => {
  try {
    const reference = String(req.params.reference || "");
    const { email, reason } = req.body as {
      email?: string;
      reason?: string;
    };

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to cancel an appointment.",
      });
    }

    const data = await cancelAppointmentPublic(reference, email, reason);
    return res.json({
      success: true,
      data,
      message: "Appointment cancelled successfully.",
    });
  } catch (error) {
    return handleError(res, error, "Failed to cancel appointment.");
  }
};

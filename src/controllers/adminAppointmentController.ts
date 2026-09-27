import type { Request, Response } from "express";
import { AppointmentError } from "../services/appointment.service.js";
import {
  getAppointmentAdmin,
  getAppointmentStatsAdmin,
  listAppointmentsAdmin,
  rescheduleAppointmentAdmin,
  updateAppointmentStatusAdmin,
} from "../services/adminAppointmentService.js";

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

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const data = await listAppointmentsAdmin({
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      status: typeof req.query.status === "string" ? req.query.status : undefined,
      doctorId:
        typeof req.query.doctorId === "string" ? req.query.doctorId : undefined,
      dateFrom:
        typeof req.query.dateFrom === "string" ? req.query.dateFrom : undefined,
      dateTo:
        typeof req.query.dateTo === "string" ? req.query.dateTo : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });

    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load appointments.");
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const data = await getAppointmentAdmin(String(req.params.id));
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load appointment.");
  }
};

export const getAppointmentStats = async (_req: Request, res: Response) => {
  try {
    const data = await getAppointmentStatsAdmin();
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load appointment stats.");
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status, adminNotes, cancellationReason } = req.body as {
      status?: string;
      adminNotes?: string;
      cancellationReason?: string;
    };

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const data = await updateAppointmentStatusAdmin(String(req.params.id), status, {
      adminNotes,
      cancellationReason,
    });

    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to update appointment status.");
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentDate, startTime } = req.body as {
      appointmentDate?: string;
      startTime?: string;
    };

    if (!appointmentDate || !startTime) {
      return res.status(400).json({
        success: false,
        message: "appointmentDate and startTime are required.",
      });
    }

    const data = await rescheduleAppointmentAdmin(
      String(req.params.id),
      appointmentDate,
      startTime,
    );

    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to reschedule appointment.");
  }
};

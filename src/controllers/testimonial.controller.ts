import { Request, Response } from "express";
import { getTestimonials } from "../services/testimonial.service.js";

export const getTestimonialsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const testimonials = await getTestimonials();

    return res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Failed to get testimonials:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get testimonials",
    });
  }
};
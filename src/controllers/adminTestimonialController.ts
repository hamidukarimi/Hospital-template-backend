import type { Request, Response } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
} from "../services/adminTestimonialService.js";

export const getTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await getAllTestimonials();

    return res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("GET TESTIMONIALS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
};

export const getTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await getTestimonialById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("GET TESTIMONIAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
    });
  }
};

export const addTestimonial = async (req: Request, res: Response) => {
  try {
    const {
      name,
      role,
      content,
      image,
      rating,
      sortOrder,
      isActive,
    } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Name and content are required",
      });
    }

    const testimonial = await createTestimonial({
      name,
      role,
      content,
      image,
      rating,
      sortOrder,
      isActive,
    });

    return res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("CREATE TESTIMONIAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
    });
  }
};

export const editTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await updateTestimonial(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("UPDATE TESTIMONIAL ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }
};

export const removeTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteTestimonial(req.params.id);

    return res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TESTIMONIAL ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Testimonial not found",
    });
  }
};
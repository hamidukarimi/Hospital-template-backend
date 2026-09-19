import { Request, Response } from "express";
import { createContactSubmission, getSiteContactInfo } from "../services/contact.service.js";

export const handleContactSubmit = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, department, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields.",
      });
    }

    const submission = await createContactSubmission({
      name,
      email,
      phone,
      department,
      message,
    });

    return res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting your message.",
    });
  }
};

export const handleGetContactInfo = async (_req: Request, res: Response) => {
  try {
    const contactInfo = await getSiteContactInfo();

    return res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching contact info.",
    });
  }
};
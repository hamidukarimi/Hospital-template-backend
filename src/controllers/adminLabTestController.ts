import type { Request, Response } from "express";
import {
  createLabTest,
  deleteLabTest,
  getAllLabTests,
  getLabTestById,
  updateLabTest,
} from "../services/adminLabTestService.js";

export const getLabTests = async (_req: Request, res: Response) => {
  try {
    const labTests = await getAllLabTests();

    return res.json({
      success: true,
      data: labTests,
    });
  } catch (error) {
    console.error("GET LAB TESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lab tests",
    });
  }
};

export const getLabTest = async (req: Request, res: Response) => {
  try {
    const labTest = await getLabTestById(req.params.id as string as string);

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      });
    }

    return res.json({
      success: true,
      data: labTest,
    });
  } catch (error) {
    console.error("GET LAB TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lab test",
    });
  }
};

export const addLabTest = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      image,
      discount,
      price,
      buttonText,
      buttonUrl,
      color,
      isActive,
      sortOrder,
    } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      !buttonText ||
      !buttonUrl ||
      !color
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const labTest = await createLabTest({
      title,
      description,
      image,
      discount,
      price,
      buttonText,
      buttonUrl,
      color,
      isActive,
      sortOrder,
    });

    return res.status(201).json({
      success: true,
      data: labTest,
    });
  } catch (error) {
    console.error("CREATE LAB TEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lab test",
    });
  }
};

export const editLabTest = async (req: Request, res: Response) => {
  try {
    const labTest = await updateLabTest(
      req.params.id as string,
      req.body
    );

    return res.json({
      success: true,
      data: labTest,
    });
  } catch (error) {
    console.error("UPDATE LAB TEST ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Lab test not found",
    });
  }
};

export const removeLabTest = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteLabTest(req.params.id as string);

    return res.json({
      success: true,
      message: "Lab test deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LAB TEST ERROR:", error);

    return res.status(404).json({
      success: false,
      message: "Lab test not found",
    });
  }
};
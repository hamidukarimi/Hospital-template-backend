import { Request, Response } from "express";
import { getLabTests } from "../services/labTests.service";

export const getLabTestsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const labTests = await getLabTests();

    return res.status(200).json({
      success: true,
      data: labTests,
    });
  } catch (error) {
    console.error("Failed to get lab tests:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get lab tests",
    });
  }
};
import { subjectModel } from "../models/subject.model";
import { sendResponse } from "../utils/sendResponse";

const createSubjectController = async (req: any, res: any) => {
  try {
    const subject = req.body;
    const result = await subjectModel.createSubject(subject);
    sendResponse(res, 201, "Subject created successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to create subject", null);
  }
};

const getSubjectController = async (req: any, res: any) => {
  try {
    const result = await subjectModel.getSubjects();
    sendResponse(res, 200, "Subjects retrieved successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to retrieve subjects", null);
  }
};

const getSubjectByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await subjectModel.getSubjectById(id);
    sendResponse(res, 200, "Subject retrieved successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to retrieve subject", null);
  }
};

const updateSubjectByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const subject = req.body;
    const result = await subjectModel.updateSubjectById(id, subject);
    sendResponse(res, 200, "Subject updated successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to update subject", null);
  }
};

const deleteSubjectByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await subjectModel.deleteSubjectById(id);
    sendResponse(res, 200, "Subject deleted successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to delete subject", null);
  }
};

export {
  createSubjectController,
  deleteSubjectByIdController,
  getSubjectByIdController,
  getSubjectController,
  updateSubjectByIdController,
};

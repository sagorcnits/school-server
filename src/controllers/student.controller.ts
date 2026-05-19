import db from "../config/database";

import { Request, Response } from "express";
import { createStudent } from "../models/student.model";
import { sendResponse } from "../utils/sendResponse";

const createStudentController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const student = req.body;
    const result = await createStudent(student);
    if (result?.insertId) {
      sendResponse(res, 201, "Student created successfully", null);
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to create student", null);
  }
};

const getStudentController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const sql = `SELECT * FROM students`;
    const [result] = await db.query(sql);
    sendResponse(res, 200, "Students retrieved successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve students", null);
  }
};

const getStudentByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM students WHERE id = ?`;
    const [result] = await db.query(sql, id);
    sendResponse(res, 200, "Student retrieved successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve student", null);
  }
};

const deleteStudentByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM students WHERE id = ?`;
    const [result] = await db.query(sql, id);
    sendResponse(res, 200, "Student deleted successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to delete student", null);
  }
};

export {
  createStudentController,
  deleteStudentByIdController,
  getStudentByIdController,
  getStudentController,
};

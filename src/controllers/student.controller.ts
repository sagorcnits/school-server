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

    if (result === false) {
      sendResponse(res, 400, "Student already used to number or email", null);
    }

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
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM students`;
    let values = [];

    if (search) {
      sql += ` where name like ? or email like ? or phone like ?`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` group by id order by name asc limit ? offset ?`;
    values.push(limit, offset);

    const [result] = await db.query(sql, values);
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
    const [result]: any = await db.query(sql, [id]);

    sendResponse(res, 200, "Student retrieved successfully", result[0]);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve student", null);
  }
};

const updateStudentByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const student = req.body;
    const sql = `
    UPDATE students 
    SET name = ?, email = ?, phone = ?, age = ? 
    WHERE id = ?`;
    // save
    const [result] = await db.query(sql, [
      student.name,
      student.email,
      student.phone,
      student.age,
      id,
    ]);
    sendResponse(res, 200, "Student updated successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to update student", null);
  }
};

const deleteStudentByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;

    const existSql = `SELECT * FROM students WHERE id = ?`;

    const [existingStudent] = await db.query(existSql, id);

    if (Array.isArray(existingStudent) && existingStudent.length === 0) {
      sendResponse(res, 404, "Student not found", null);
    }

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
  updateStudentByIdController,
};

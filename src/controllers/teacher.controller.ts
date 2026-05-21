import db from "../config/database";
import { createTeacher } from "../models/teacher.model";
import { sendResponse } from "../utils/sendResponse";

import { Request, Response } from "express";

const createTeacherController = async (req: any, res: any) => {
  try {
    const teacher = req.body;
    const result = await createTeacher(teacher);
    sendResponse(res, 201, "Teacher created successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to create teacher", null);
  }
};

const getTeacherController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    let sql = `
      SELECT t.id, t.name as teacher_name, t.phone, t.email, t.age, group_concat(s.name) as subject_name FROM teachers as t

       LEFT JOIN teachers_subjects ts
        ON t.id = ts.teacher_id

      LEFT JOIN subjects as s
        ON ts.subject_id = s.id
    `;

    const values = [];

    if (search) {
      sql += ` WHERE name LIKE ? OR email LIKE ? `;
      values.push(`%${search}%`, `%${search}%`);
    }

    sql += `group by t.id order by t.name asc limit ? offset ?`;

    values.push(limit, offset);

    const [result] = await db.query(sql, values);

    sendResponse(res, 200, "Teachers retrieved successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve teachers", null);
  }
};

const getTeacherByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const sql = `
SELECT 
  t.id,
  t.name AS teacher_name,
  t.phone,
  t.email,
  t.age,
  GROUP_CONCAT(s.name) AS subjects
FROM teachers t
JOIN teachers_subjects ts
  ON t.id = ts.teacher_id
JOIN subjects s
  ON ts.subject_id = s.id
WHERE t.id = ?
GROUP BY t.id, t.name, t.phone, t.email, t.age;
    
    
    `;

    const [rows] = await db.query(sql, [id]);

    const result =
      Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;

    if (!result) {
      sendResponse(res, 404, "Teacher not found", null);
      return;
    }

    const formatted = {
      ...result,
      subjects: result.subjects ? (result.subjects as string).split(",") : [],
    };
    sendResponse(res, 200, "Teacher retrieved successfully", formatted);
  } catch (error) {
    sendResponse(res, 500, "Failed to retrieve teacher", null);
  }
};

const updateTeacherByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const teacher = req.body;
    const sql = `
    UPDATE teachers 
    SET name = ?, email = ? 
    WHERE id = ?`;
    // save
    const [result] = await db.query(sql, [teacher.name, teacher.email, id]);
    sendResponse(res, 200, "Teacher updated successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to update teacher", null);
  }
};

const deleteTeacherByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const existSql = `SELECT * FROM teachers WHERE id = ?`;

    const [existingTeacher] = await db.query(existSql, id);

    if (Array.isArray(existingTeacher) && existingTeacher.length === 0) {
      sendResponse(res, 404, "Teacher not found", null);
    }

    const sql = `DELETE FROM teachers WHERE id = ?`;
    const [result] = await db.query(sql, id);
    sendResponse(res, 200, "Teacher deleted successfully", result);
  } catch (error) {
    sendResponse(res, 500, "Failed to delete teacher", null);
  }
};

export {
  createTeacherController,
  deleteTeacherByIdController,
  getTeacherByIdController,
  getTeacherController,
  updateTeacherByIdController,
};

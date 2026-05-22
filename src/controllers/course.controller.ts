import { Request, Response } from "express";
import db from "../config/database";
import courseModel from "../models/course.model";
import { sendResponse } from "../utils/sendResponse";

const createCourseController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const course = req.body;
    const result: any = await courseModel.createCourse(course);

    if (result?.insertId) {
      sendResponse(res, 201, "Course created successfully", null);
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to create course", null);
  }
};

const getCourseController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM courses`;
    let values = [];

    if (search) {
      sql += ` where course_name like ? or title like ? or description like ?`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` group by id order by course_name asc limit ? offset ?`;
    values.push(limit, offset);

    const [result] = await db.query(sql, values);
    sendResponse(res, 200, "Courses retrieved successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve courses", null);
  }
};

const getCourseByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const sql = `SELECT 
    c.id,
    c.course_name,
    c.title,
    c.description,
    c.price,
    c.tags,

    (
        SELECT JSON_ARRAYAGG(teacher_name)
        FROM  (
          SELECT DISTINCT t.name as teacher_name
         FROM courses_teacher ct
        INNER JOIN teachers t 
            ON ct.teacher_id = t.id
        WHERE ct.course_id = c.id
        ) as unique_teachers
    ) AS teachers,

   (
        SELECT JSON_ARRAYAGG(subject_name)
        FROM (
            SELECT DISTINCT s.name AS subject_name
            FROM courses_teacher ct
            INNER JOIN teachers_subjects ts 
                ON ct.teacher_id = ts.teacher_id
            INNER JOIN subjects s 
                ON ts.subject_id = s.id
            WHERE ct.course_id = c.id
        ) AS unique_subjects
    ) AS subject_names

FROM courses c
WHERE c.id = ?;
`;

    const [result]: any = await db.query(sql, [id]);

    sendResponse(res, 200, "Course retrieved successfully", result[0]);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve course", null);
  }
};

const updateCourseByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const course = req.body;
    const sql = `
    UPDATE courses 
    SET course_name = ?, title = ?, description = ?, price = ?, tags = ? 
    WHERE id = ?`;
    // save
    const [result] = await db.query(sql, [
      course.course_name,
      course.title,
      course.description,
      course.price,
      course.tags,
      id,
    ]);
    sendResponse(res, 200, "Course updated successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to update course", null);
  }
};

const deleteCourseByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;

    const existSql = `SELECT * FROM courses WHERE id = ?`;

    const [existingCourse] = await db.query(existSql, id);

    if (Array.isArray(existingCourse) && existingCourse.length === 0) {
      sendResponse(res, 404, "Course not found", null);
    }

    const sql = `DELETE FROM courses WHERE id = ?`;
    const [result] = await db.query(sql, id);
    sendResponse(res, 200, "Course deleted successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to delete course", null);
  }
};

export {
  createCourseController,
  deleteCourseByIdController,
  getCourseByIdController,
  getCourseController,
  updateCourseByIdController,
};

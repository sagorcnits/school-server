import { Request, Response } from "express";
import db from "../config/database";
import enrollModel from "../models/enroll.model";
import { sendResponse } from "../utils/sendResponse";

const createEnrollController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const enroll = req.body;
    const result: any = await enrollModel.createEnroll(enroll);

    if (result?.insertId) {
      sendResponse(res, 201, "Enroll created successfully", null);
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to create enroll", null);
  }
};

const getEnrollController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM course_enroll`;
    let values = [];

    if (search) {
      sql += ` where payment_status like ? or enroll_id like ?`;
      values.push(`%${search}%`, `%${search}%`);
    }

    sql += ` group by id order by enroll_id asc limit ? offset ?`;
    values.push(limit, offset);

    const [result] = await db.query(sql, values);
    sendResponse(res, 200, "Enrolls retrieved successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve enrolls", null);
  }
};

const getEnrollByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const sql = `SELECT 
    ce.id,
    ce.enroll_id,
    ce.payment_status,

    JSON_OBJECT(
        'course_name', c.course_name,
        'price', c.price
    ) AS course,

    JSON_OBJECT(
        'name', s.name,
        'phone', s.phone,
        'email', s.email
    ) AS student

FROM course_enroll ce

INNER JOIN courses c 
    ON ce.course_id = c.id

INNER JOIN students s 
    ON ce.student_id = s.id

WHERE ce.id = ?;
`;
    const [result]: any = await db.query(sql, [id]);

    sendResponse(res, 200, "Enroll retrieved successfully", result[0]);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve enroll", null);
  }
};

const getStudentEnrollsByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { student_id } = req.params;
    const sql = `SELECT 
    ce.id,
    ce.enroll_id,
    ce.payment_status,

    JSON_OBJECT(
        'course_name', c.course_name,
        'price', c.price
    ) AS course,

    JSON_OBJECT(
        'name', s.name,
        'phone', s.phone,
        'email', s.email
    ) AS student

FROM course_enroll ce

INNER JOIN courses c 
    ON ce.course_id = c.id

INNER JOIN students s 
    ON ce.student_id = s.id

WHERE ce.student_id = ?;
`;
    const [result]: any = await db.query(sql, [student_id]);

    sendResponse(
      res,
      200,
      "Your course enrolls retrieved successfully",
      result[0],
    );
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to retrieve enroll", null);
  }
};

const updateEnrollByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const enroll = req.body;
    const sql = `
    UPDATE course_enroll 
    SET course_name = ?, title = ?, description = ?, price = ?, tags = ? 
    WHERE id = ?`;
    // save
    const [result] = await db.query(sql, [
      enroll.course_name,
      enroll.title,
      enroll.description,
      enroll.price,
      enroll.tags,
      id,
    ]);
    sendResponse(res, 200, "Enroll updated successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to update enroll", null);
  }
};

const deleteEnrollByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;

    const existSql = `SELECT * FROM enroll WHERE id = ?`;

    const [existingEnroll] = await db.query(existSql, id);

    if (Array.isArray(existingEnroll) && existingEnroll.length === 0) {
      sendResponse(res, 404, "Enroll not found", null);
    }

    const sql = `DELETE FROM enroll WHERE id = ?`;
    const [result] = await db.query(sql, id);
    sendResponse(res, 200, "Enroll deleted successfully", result);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to delete enroll", null);
  }
};

export {
  createEnrollController,
  deleteEnrollByIdController,
  getEnrollByIdController,
  getEnrollController,
  getStudentEnrollsByIdController,
  updateEnrollByIdController,
};

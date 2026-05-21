import db from "../config/database";
import { Student } from "../types/student";

const createStudent = async (data: Student): Promise<any> => {
  const { id, name, email, phone, age } = data;

  const existSql = `SELECT * FROM students WHERE email = ? OR phone = ?`;

  const [existingStudent] = await db.query(existSql, [email, phone]);

  if (Array.isArray(existingStudent) && existingStudent.length > 0) {
    return false;
  }

  const sql = `INSERT INTO students (id, name, email, phone, age) VALUES (?, ?, ?, ?, ?)`;

  ``;

  const [result] = await db.query(sql, [id, name, email, phone, age]);

  return result;
};

export { createStudent };

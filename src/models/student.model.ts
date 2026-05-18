import db from "../config/database";
import { Student } from "../types/student";

const createStudent = async (data: Student): Promise<any> => {
  const { id, name, email, phone, age } = data;

  const sql = `INSERT INTO students (id, name, email, phone, age) VALUES (?, ?, ?, ?, ?)`;

  ``;

  const [result] = await db.query(sql, [id, name, email, phone, age]);

  return result;
};

export { createStudent };

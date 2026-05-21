import db from "../config/database";
import { sendResponse } from "../utils/sendResponse";

export const createTeacher = async (data: any) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { name, email, phone, age, subject_ids } = data;

    // 1. teacher create
    const [teacherResult] = (await connection.execute(
      "INSERT INTO teachers (name, email, phone, age) VALUES (?, ?)",
      [name, email, phone, age],
    )) as any;

    const teacher_id = (teacherResult as any).insertId;

    // 2. mapping insert
    const values = subject_ids.map((subId: number) => [teacher_id, subId]);

    if (values.length > 0) {
      await connection.query(
        "INSERT INTO teachers_subjects (teacher_id, subject_id) VALUES ?",
        [values],
      );
    }

    await connection.commit();

    return teacherResult;
  } catch (error) {
    await connection.rollback();
    return sendResponse(error, 500, "Failed to create teacher", null);
  } finally {
    connection.release();
  }
};

import db from "../config/database";

const generateId = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const enrollModel = {
  createEnroll: async (data: any) => {
    try {
      const { student_id, course_id, payment_status } = data;
      const enroll_id = generateId();

      //    create enroll
      const values = [enroll_id, payment_status, course_id, student_id];
      const sql = `INSERT INTO course_enroll (enroll_id, payment_status,course_id,student_id) VALUES (?, ? ,? ,?)`;

      const [result] = await db.query(sql, values);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};

export default enrollModel;

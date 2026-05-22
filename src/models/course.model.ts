import db from "../config/database";

const courseModel = {
  createCourse: async (data: any) => {
    const connection = await db.getConnection();

    const { course_name, title, description, price, tags, teacher_id } = data;
    try {
      await connection.beginTransaction();
      // 1. course create
      const values = [course_name, title, description, price, tags];
      const sql = `INSERT INTO courses (course_name, title, description, price, tags) VALUES (?, ?, ?, ?, ?)`;
      const [result] = await connection.query(sql, values);
      const course_id = (result as any).insertId;

      // 2. create course teacher
      teacher_id.forEach((teacherId: number) => {
        const values2 = [course_id, teacherId];
        const sql2 = `INSERT INTO courses_teacher (course_id, teacher_id) VALUES (?, ?)`;
        connection.query(sql2, values2);
      });

      //   commit
      await connection.commit();

      return result;
    } catch (error) {
      console.log(error);
      await connection.rollback();
    } finally {
      connection.release();
    }
  },
};

export default courseModel;

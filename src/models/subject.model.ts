import db from "../config/database";

export const subjectModel = {
  createSubject: async (data: any) => {
    const { name } = data;
    try {
      const sql = `INSERT INTO subjects (name) VALUES (?)`;
      const [result] = await db.query(sql, [name]);
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  getSubjects: async () => {
    try {
      const sql = `SELECT * FROM subjects`;
      const [result] = await db.query(sql);
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  getSubjectById: async (id: any) => {
    try {
      const sql = `SELECT * FROM subjects WHERE id = ?`;
      const [result] = await db.query(sql, id);
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  updateSubjectById: async (id: any, data: any) => {
    try {
      const { name } = data;
      const sql = `UPDATE subjects SET name = ? WHERE id = ?`;
      const [result] = await db.query(sql, [name, id]);
      return result;
    } catch (error) {
      console.log(error);
    }
  },

  deleteSubjectById: async (id: any) => {
    try {
      const sql = `DELETE FROM subjects WHERE id = ?`;
      const [result] = await db.query(sql, id);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};

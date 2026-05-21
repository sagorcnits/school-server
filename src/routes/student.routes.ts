import { Router } from "express";
import {
  createStudentController,
  deleteStudentByIdController,
  getStudentByIdController,
  getStudentController,
  updateStudentByIdController,
} from "../controllers/student.controller";

const router = Router();

router.post("/students", createStudentController);
router.get("/students", getStudentController);
router.get("/students/:id", getStudentByIdController);
router.delete("/students/:id", deleteStudentByIdController);
router.put("/students/:id", updateStudentByIdController);

export default router;

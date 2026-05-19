import { Router } from "express";
import {
  createStudentController,
  deleteStudentByIdController,
  getStudentByIdController,
  getStudentController,
} from "../controllers/student.controller";

const router = Router();

router.post("/students", createStudentController);
router.get("/students", getStudentController);
router.get("/students/:id", getStudentByIdController);
router.delete("/students/:id", deleteStudentByIdController);

export default router;

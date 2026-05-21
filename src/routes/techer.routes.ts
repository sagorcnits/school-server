import { Router } from "express";
import {
  createTeacherController,
  deleteTeacherByIdController,
  getTeacherByIdController,
  getTeacherController,
  updateTeacherByIdController,
} from "../controllers/teacher.controller";

const router = Router();

router.post("/teachers", createTeacherController);
router.get("/teachers", getTeacherController);
router.get("/teachers/:id", getTeacherByIdController);
router.delete("/teachers/:id", deleteTeacherByIdController);
router.put("/teachers/:id", updateTeacherByIdController);

export default router;

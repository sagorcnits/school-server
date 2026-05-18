import { Router } from "express";
import {
  createStudentController,
  getStudentController,
} from "../controllers/student.controller";

const router = Router();

router.post("/students", createStudentController);
router.get("/students", getStudentController);

export default router;

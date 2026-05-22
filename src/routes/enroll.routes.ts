import { Router } from "express";
import {
  createEnrollController,
  deleteEnrollByIdController,
  getEnrollByIdController,
  getEnrollController,
  getStudentEnrollsByIdController,
  updateEnrollByIdController,
} from "../controllers/enroll.controller";

const router = Router();

router.get("/enrolls", getEnrollController);
router.get("/enrolls/:id", getEnrollByIdController);
router.post("/enrolls", createEnrollController);
router.put("/enrolls/:id", updateEnrollByIdController);
router.delete("/enrolls/:id", deleteEnrollByIdController);
router.get("/enrolls/myenrolls/:student_id", getStudentEnrollsByIdController);

export default router;

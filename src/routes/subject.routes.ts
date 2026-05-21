import { Router } from "express";
import {
  createSubjectController,
  deleteSubjectByIdController,
  getSubjectByIdController,
  getSubjectController,
  updateSubjectByIdController,
} from "../controllers/subject.controller";

const router = Router();

router.post("/subjects", createSubjectController);
router.get("/subjects", getSubjectController);
router.get("/subjects/:id", getSubjectByIdController);
router.delete("/subjects/:id", deleteSubjectByIdController);
router.put("/subjects/:id", updateSubjectByIdController);

export default router;

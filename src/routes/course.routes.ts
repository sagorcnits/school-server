import { Router } from "express";
import {
  createCourseController,
  deleteCourseByIdController,
  getCourseByIdController,
  getCourseController,
  updateCourseByIdController,
} from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.get("/", getCourseController);
courseRouter.get("/:id", getCourseByIdController);
courseRouter.post("/", createCourseController);
courseRouter.put("/:id", updateCourseByIdController);
courseRouter.delete("/:id", deleteCourseByIdController);

export default courseRouter;

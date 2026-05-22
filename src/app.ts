import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { errorHandler, notFound } from "./middleware/errorHandler";
import courseRoutes from "./routes/course.routes";
import enrollRoutes from "./routes/enroll.routes";
import studentRoutes from "./routes/student.routes";
import subjectRoutes from "./routes/subject.routes";
import teacherRoutes from "./routes/techer.routes";
//
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/v1", studentRoutes);
app.use("/api/v1", subjectRoutes);
app.use("/api/v1", teacherRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1", enrollRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;

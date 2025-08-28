import express from "express";
import {
  fetchEnrolledCourses,
  totalStudentsEnrolledPerCourse,
  totalStudentsEnrolledUnderATrainer,
} from "../controllers/enrolledCourseController";

const router = express.Router();


router.get("/totalEnrolledStudents", totalStudentsEnrolledUnderATrainer);
router.get("/totalEnrolledStudentsPerCourse", totalStudentsEnrolledPerCourse);
router.get("/:studentId", fetchEnrolledCourses);

export default router;

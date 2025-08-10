import express from "express";
import { createCourse,getCourses,getCourse,updateCourse, deleteCourse } from "../controllers/course.controller";
import { protect,authorizeRole } from "../middleware/authMiddleware";
const router= express.Router();

router.post('/create',protect,authorizeRole('TRAINER'),createCourse);
router.get('/getCourses', protect, authorizeRole('TRAINER'),getCourses);
router.get('/get/:courseId',getCourse);
router.put('/update',protect,authorizeRole('TRAINER'),updateCourse);
router.delete('/delete',deleteCourse);

export default router;

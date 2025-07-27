import express from "express";
import { createCourse,getCourses,updateCourse, deleteCourse } from "../controllers/course.controller";
import { protect,authorizeRole } from "../middleware/authMiddleware";
const router= express.Router();

router.post('/create',protect,authorizeRole('TRAINER'),createCourse);
router.get('/getCourses', protect, authorizeRole('TRAINER'),getCourses);
router.put('/update',protect,authorizeRole('TRAINER'),updateCourse);
router.delete('/delete',deleteCourse);

export default router;

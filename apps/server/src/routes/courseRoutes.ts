import express from "express";
import { createCourse,getCourses,getCourse,updateCourse, deleteCourse,getAllCourses, searchCourse, getCourseByCategory} from "../controllers/course.controller";
import { protect,authorizeRole } from "../middleware/authMiddleware";
const router= express.Router();

router.post('/create',protect,authorizeRole('TRAINER'),createCourse);
router.get('/getCourses',getCourses);
router.get('/',getAllCourses);
router.get('/get/:courseId',getCourse);
router.get('/search',searchCourse);
router.get('/getCourseByCategory/:category',getCourseByCategory);
router.put('/update',protect,authorizeRole('TRAINER'),updateCourse);
router.delete('/delete',deleteCourse);


export default router;

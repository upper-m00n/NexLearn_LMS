import express from "express";
import { createCourse,getCourses,getCourse,updateCourse, deleteCourse,getAllCourses, searchCourse, getCourseByCategory} from "../controllers/course.controller";
import { protect,authorizeRole } from "../middleware/authMiddleware";
import { generateThumbnail } from "../libs/gemini";
const router= express.Router();

router.post('/create',protect,authorizeRole('TRAINER'),createCourse);
router.post('/generate-thumbnail',generateThumbnail);
router.get('/getCourses',getCourses);
router.get('/',getAllCourses);
router.get('/get/:courseId',getCourse);
router.get('/search',searchCourse);
router.get('/getCourseByCategory/:category',getCourseByCategory);
router.put('/update',protect,authorizeRole('TRAINER'),updateCourse);
router.delete('/delete',deleteCourse);


export default router;

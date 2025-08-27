import express from 'express'
import { fetchEnrolledCourses } from '../controllers/enrolledCourseController';

const router=express.Router();

router.get('/',fetchEnrolledCourses);

export default router;
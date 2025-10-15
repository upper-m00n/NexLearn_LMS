import express from 'express';
import { checkLectureStatus, getCourseProgress, markLecture } from '../controllers/progress.Controller';

const router = express.Router();

router.post('/complete', markLecture);
router.get('/check', checkLectureStatus); 
router.get('/calculate', getCourseProgress);

export default router;
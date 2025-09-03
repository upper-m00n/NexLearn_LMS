import express from 'express'
import { getCourseProgress, markLectureAsComplete } from '../controllers/progress.Controller';

const router= express.Router();

router.post('/complete',markLectureAsComplete);
router.post('/calculate',getCourseProgress);

export default router;
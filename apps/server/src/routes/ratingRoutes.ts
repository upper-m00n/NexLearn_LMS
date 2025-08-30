import express from 'express'
import { getCourseRatingByStudent, setCourseRating } from '../controllers/rating.controllers';

const router= express.Router();

router.put('/setCourseRating/:courseId',setCourseRating);
router.post('/ratingByStudent/:courseId',getCourseRatingByStudent)

export default router;
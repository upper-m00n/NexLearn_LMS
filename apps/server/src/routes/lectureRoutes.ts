import express from 'express';
import { createLecture,getLectures,deleteLecture } from '../controllers/lectureController';
import { authorizeRole, protect } from '../middleware/authMiddleware';

const router= express.Router();

router.post('/create',protect,createLecture);
router.get('/get',getLectures);
router.delete('/delete/:lectureId',deleteLecture);

export default router;
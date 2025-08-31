import express from 'express';
import { createLecture,getLectures,deleteLecture, getLecture,generateUploadSignature, processLecture } from '../controllers/lectureController';
import { authorizeRole, protect } from '../middleware/authMiddleware';

const router= express.Router();
//generate signature route

router.get('/generate-upload-signature',generateUploadSignature);

// lecture routes
router.post('/create',protect,createLecture);
router.post('/process/lectureId',processLecture);
router.get('/get',getLectures);
router.delete('/delete/:lectureId',deleteLecture);
router.get('/get-lecture/:lectureId',getLecture);

export default router;
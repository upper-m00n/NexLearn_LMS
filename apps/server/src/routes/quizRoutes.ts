import express from 'express'
import { createQuiz } from '../controllers/quiz.Controller';

const router=express.Router();

router.post('/generate/:lectureId',createQuiz);

export default router;
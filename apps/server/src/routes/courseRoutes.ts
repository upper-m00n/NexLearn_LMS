import express from "express";
import { createCourse } from "../controllers/course.controller";
import { protect,authorizeRole } from "../middleware/authMiddleware";
const router= express.Router();

router.post('/create',protect,authorizeRole('TRAINER'),createCourse);

export default router;

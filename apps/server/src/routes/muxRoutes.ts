import express from 'express'
import multer from "multer"
import {createMuxVideo} from '../controllers/course.controller'

const upload= multer().none();

const router= express.Router();

router.post('/upload',upload,createMuxVideo);

export default router
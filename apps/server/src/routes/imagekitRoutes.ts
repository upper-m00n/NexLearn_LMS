import express from 'express'
import { getImagekitAuth } from '../controllers/imagekit.controller';

const router= express.Router();

router.get('/imagekit-auth',getImagekitAuth)

export default router;
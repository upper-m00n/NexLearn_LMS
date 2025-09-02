import express from 'express'
import { login,register } from '../controllers/authController'
import { verifyOtp } from '../controllers/verifyOtp.Controller';

const router= express.Router();

router.post('/login',login);
router.post('/verify-otp',verifyOtp);
router.post('/register',register)

export default router;
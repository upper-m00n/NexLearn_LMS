import express from 'express'
import { processPayment, verifyPayment } from '../controllers/paymentController';

const router= express.Router();

router.post("/create-order",processPayment)
router.post("/verify",verifyPayment)

export default router;
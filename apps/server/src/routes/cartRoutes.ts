import express from "express";
import { addToCart, removeCartItem, viewCart } from "../controllers/cart.controller";

const router= express.Router();

router.get('/:studentId',viewCart);
router.post('/add',addToCart);
router.delete('/delete/:courseId',removeCartItem);

export default router;
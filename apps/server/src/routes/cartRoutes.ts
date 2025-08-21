import express from "express";
import { addToCart, removeCartItem, viewCart } from "../controllers/cart.controller";

const router= express.Router();

router.get('/',viewCart);
router.post('/add',addToCart);
router.delete('/delete',removeCartItem);

export default router;
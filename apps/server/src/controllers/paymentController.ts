import { Request,Response } from "express";
import { razorpay } from "../utils/razorpay";
import prisma from "../prisma/client";
import crypto from "crypto";

export const processPayment= async (req:Request,res:Response)=>{
    try {
        const {studentId, cartItems,totalAmount}=req.body;

        const razorpayOrder= await razorpay.orders.create({
            amount:totalAmount * 100,
            currency:"INR",
            receipt: `receipt_${Date.now()}`
        })

        const order= await prisma.order.create({
            data:{
                studentId,
                items:{
                    create:cartItems.map((item:any)=>({
                        courseId:item.courseId,
                        price:item.course.price
                    }))
                },
                payment:{
                    create:{
                        amount:totalAmount,
                        status:"PENDING",
                        provider:"RAZORPAY",
                        razorpayOrderId:razorpayOrder.id
                    }
                }
            },
            include:{items:true,payment:true}
        });

        
        res.json({
            success:true,
            razorpayOrder,
            order
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Payment initiation failed" });
    }
}

export const verifyPayment= async(req:Request,res:Response)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
        console.log(razorpay_order_id)
        const sign=razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign=crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET_KEY!)
        .update(sign.toString())
        .digest("hex");

        if(expectedSign === razorpay_signature){
            await prisma.payment.update({
                where:{
                    razorpayOrderId:razorpay_order_id
                },
                data:{
                    status:"SUCCESS",
                    
                }
            })
            res.status(200).json({success:true,message:"Payment verified successfully!"})
        }
        else{
            res.status(400).json({success:false,message:"Invalid signature"})
        }

    } catch (error) {
         console.error(error);
        res.status(500).json({ success: false, error: "Verification failed" });
    }
}
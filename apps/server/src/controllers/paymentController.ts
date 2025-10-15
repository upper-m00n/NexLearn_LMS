import { Request,Response } from "express";
import { razorpay } from "../utils/razorpay";
import prisma from "../prisma/client";
import crypto from "crypto";
import { Item } from "../types/item";
import { sendEmail } from "../utils/mailer";
import { Order,Course, OrderItem } from "../generated/prisma";

export const processPayment= async (req:Request,res:Response)=>{
    try {
        const {studentId, cartItems,totalAmount}=req.body;
        const cartId=cartItems[0]?.cartId;

        //console.log("CartId",cartId);

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

type VerifiedOrderItem = OrderItem & {
    course: Course;
};
type VerifiedOrder = Order & {
    items: VerifiedOrderItem[];
};


export const verifyPayment= async(req:Request,res:Response)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,studentEmail}=req.body;
        console.log(razorpay_order_id)
        
        const sign=razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSign=crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET_KEY!)
        .update(sign.toString())
        .digest("hex");

        if(expectedSign === razorpay_signature){
            const payment = await prisma.payment.update({
                where:{
                    razorpayOrderId:razorpay_order_id
                },
                data:{
                    status:"SUCCESS",
                },
                include:{
                    order:{
                        include:{
                            items:{
                                include:{
                                    course:true
                                }
                            }
                        }
                    }
                }
            })

            const order=payment.order as VerifiedOrder;

            console.log("order items:",payment.order);

            const purchasedCoursesHtml = order.items.map((item) => `
                <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; align-items: center;">
                <div>
                    <h3 style="margin: 0; font-size: 16px;">${item.course?.title}</h3>
                    <img src="${item.course?.thumbnail}" alt="${item.course?.title}" style="width:150px; height:auto; margin-top:5px; border-radius:5px;">
                    <p style="margin: 5px 0 0; color: #555;">Price: ₹${item.course?.price}</p>
                </div>
                </div>
            `).join('');

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4A90E2;">Thank You for Your Order!</h1>
                <p>Your payment was successful. You are now enrolled in the following course(s) and can access them in your "My Courses" section.</p>
                <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Your Courses</h2>
                ${purchasedCoursesHtml}
                <p style="margin-top: 20px;">Happy learning!</p>
                <p style="font-weight: bold;">- The NexLearn Team</p>
                </div>
            `;

            await sendEmail(studentEmail,`Payment Successful, Your payment was successful. You are now enrolled in the course(s), order : ${payment.order}.`,emailHtml)


            //enroll course
            await prisma.enrollment.createMany({
                data:order.items.map((item:OrderItem)=>({
                    studentId:order.studentId,
                    courseId:item.courseId
                })),
                skipDuplicates:true
            })

            //empty cart
            await prisma.cartItem.deleteMany({
                where:{
                    courseId:{
                        in:order.items.map((item:OrderItem)=> item.courseId)
                    },
                    cart:{
                        studentId:order.studentId
                    }
                }
            })

            res.status(200).json({success:true,message:"Payment verified and course enrolled successfully!"})
        }
        else{
            res.status(400).json({success:false,message:"Invalid signature"})
        }

    } catch (error) {
         console.error(error);
        res.status(500).json({ success: false, error: "Verification failed" });
    }
}
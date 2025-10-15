import prisma from "../prisma/client";
import {Request, Response} from 'express'

export const addToCart= async(req:Request, res:Response)=>{
    try {
        const studentId= req.body.studentId as string;
        const {courseId}= req.body;
        //console.log(req.user?.id)
        
        let cart= await prisma.cart.findFirst({where:{studentId}});

        if(!cart){
            cart= await prisma.cart.create({
                data:{studentId},
            })
        }

        const existingItem= await prisma.cartItem.findFirst({
            where:{
                cartId:cart.id,
                courseId
            }
        })

        if(existingItem){
            return res.status(400).json({message:"Course already in cart"})
        }

        const newItem= await prisma.cartItem.create({
            data:{cartId:cart.id,courseId},
            include:{course:true},
        }) 

        res.status(200).json({message:"Added to cart", item:newItem})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add to cart" });
    }
}

export const removeCartItem= async(req:Request,res:Response)=>{
    try {
        const studentId= req.query.studentId as string;
        const courseId =req.params.courseId;

        const cart= await prisma.cart.findUnique({where:{studentId}})
        if(!cart){
            return res.status(404).json({message:"cart not found"});
        }

        await prisma.cartItem.delete({
            where:{
                cartId_courseId:{
                    cartId: cart.id,
                    courseId:courseId,
                }
            }
        })
        
        res.status(200).json({message:"Removed from cart"})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove from cart" });
    }
}

// view cart
export const viewCart= async(req:Request,res:Response)=>{
    try {
        const studentId= req.params?.studentId;
        
        const cart= await prisma.cart.findUnique({
            where:{studentId},
            include:{
                items:{
                    include:{
                        course:true
                    }
                }
            }
        })

        if(!cart){
            return res.status(404).json({items:[],total:0})
        }

        // const total= cart.items.reduce(
        //     (sum,item)=> sum + item.course.price
        // )

        // res.json({items:cart.items,total})

        res.status(200).json({cart});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
}
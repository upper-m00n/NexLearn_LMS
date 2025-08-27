import { Request,Response } from "express";
import prisma from "../prisma/client";

export const fetchEnrolledCourses= async(req:Request,res:Response)=>{
    try {
        const studentId= req.params;
        if(!studentId){
            return res.status(400).json({message:"Login required"})
        } 

        const enrolledCourses= await prisma.enrollment.findMany({
            where:{
                studentId
            }
        })

        if(!enrolledCourses)return res.status(404).json({message:"No enrolled courses found"});

        res.status(200).json({enrolledCourses,message:"Enrolled courses fetched successfully!"});

    } catch (error) {
        console.log("Error while fetching enrolled courses",error);
        res.status(500).json({message:"Error while fetching enrolled courses"})
    }
}
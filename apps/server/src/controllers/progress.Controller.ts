import {Request, Response} from 'express';
import prisma from '../prisma/client';

export const markLectureAsComplete= async(req:Request,res:Response)=>{
    const {userId, lectureId}=req.body;

    if(!userId || !lectureId){
        return res.status(400).json({
            message:"User or lecture id is required."
        })
    }

    try {
        const completion= await prisma.lectureCompletion.upsert({
            where:{
                userId_lectureId:{
                    userId,
                    lectureId
                }
            },
            update:{},
            create:{
                userId,
                lectureId
            }
        })

        res.status(200).json({message:"Lecture marked as completed successfully!",completion});
    } catch (error) {
        console.log("Error while marking lecture as completed",error);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const getCourseProgress= async(req:Request,res:Response)=>{
    const {userId,courseId}= req.body;

    if(!userId || !courseId){
        return res.status(400).json("User and courseId is required");
    }

    try {
        const totalLectures=await prisma.lecture.count({
            where:{
                courseId
            }
        });

        if(totalLectures === 0){
            return res.status(200).json({progressPercentage:100, completedCount:0, totalCount:0});
        }

        const completedLecture= await prisma.lectureCompletion.count({
            where:{
                userId,
                lecture:{
                    courseId
                }
            }
        });

        const progressPercentage=(completedLecture/totalLectures)*100;

        res.status(200).json({
            progressPercentage:Math.round(progressPercentage),
            completedCount:completedLecture,
            totalCount:totalLectures
        })

    } catch (error) {
        console.error('Error getting course progress:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
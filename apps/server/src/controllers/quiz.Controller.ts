import { Request,Response } from "express";
import prisma from "../prisma/client";
import { generateQuizForLecture } from "../libs/gemini";

export const createQuiz= async(req:Request,res:Response)=>{
    try {
        const {lectureId}=req.params;

        const existingQuiz= await prisma.quiz.findUnique({
            where:{
                lectureId
            },
            include:{
                questions:true
            }
        })
        
        if(existingQuiz){
            return res.status(200).json({quiz:existingQuiz});
        }

        const newQuiz= await generateQuizForLecture(lectureId);
        res.status(201).json({quiz:newQuiz});
    } catch (error) {
        console.error('Error in createQuiz controller:', error);
        res.status(500).json({ error: 'Failed to generate quiz.' });
    }
}
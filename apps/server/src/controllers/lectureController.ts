import { Request,Response } from "express";
import  prisma  from "../prisma/client";
import {v4 as uuidv4} from 'uuid'
import cloudinary from "../libs/cloudinary";

// generate cloudinary signature

export const generateUploadSignature=async (req:Request,res:Response)=>{
    try{
        const timestamp= Math.round(new Date().getTime()/1000);

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp:timestamp,
                folder: 'lecture_videos', // Must match frontend if used
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
            },
            process.env.CLOUDINARY_API_SECRET as string
        );

        res.json({timestamp,signature});
    }
    catch(error){
        console.log("Error while generating uploadsignature", error);
        res.status(500).json({message:"Unable to generate upload signature."});
    }
}


// create lecture 
export const createLecture = async(req:Request,res:Response)=>{
    try {
        const {title, description, videoUrl, pdfUrl, courseId}= req.body

        if(!title || !videoUrl || !courseId){
            return res.status(400).json({message:"Missing required fields"});
        }
        //console.log("Lecture data :",title);

        let noteId= null;

        if(pdfUrl){
            const note = await prisma.note.create({
                data:{
                    id:uuidv4(),
                    title: `${title} Notes`,
                    pdfUrl,
                    courseId,
                }
            });
            noteId=note.id;
        }

        const lecture = await prisma.lecture.create({
            data:{
                id:uuidv4(),
                title,
                description,
                videoUrl,
                courseId,
                noteId,
            },
            include:{note:true}
        })

        return res.status(201).json({lecture, message:"Lecture created successfully!"})
        } catch (error) {
            console.log("Error creating lecture",error);
            return res.status(500).json({message:"Server error while creating a lecture."})
        }
}

// get lectures

export const getLectures= async(req:Request, res:Response)=>{
    try {
        const {courseId}= req.query;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const lectures= await prisma.lecture.findMany({
            where:{courseId: courseId as string}
        })

        //console.log("Lectures",lectures)

        if(lectures.length===0){
            return res.status(404).json({message:"Lectures not found."})
        }

        res.status(200).json({lectures, message:"Successfully fetched lectures."})

    } catch (error) {
        res.status(500).json({message:"Internal Server Error."});
        console.log("Error while fecthing lectures",error);

    }
}

// delete Lecture

export const deleteLecture= async(req:Request, res:Response)=>{
    try{
        const {lectureId}= req.params;

        if(!lectureId){
            return res.status(400).json({message:"LectureId is required."})
        }

        const deleteLecture= await prisma.lecture.delete({
            where:{
                id:lectureId as string
            }
        })
        res.status(200).json({message:"Lecture deleted successfully."});

    }
    catch(error){
        console.log("Error while deleting lecture",error);
        res.status(500).json({message:"Internal server error."})
    }
}

// get single lecture

export const getLecture= async(req:Request,res:Response)=>{
    try {
        const {lectureId}=req.params;

        if(!lectureId) return res.status(400).json({message:"LectureId is required"});

        const lec= await prisma.lecture.findUnique({
            where:{id:lectureId as string}
        })
        //console.log("Lecture",lec);
        const noteId= lec?.noteId;

        const note= await prisma.note.findUnique({
            where:{id:noteId as string}
        })

        console.log("lecture",lec)
        res.status(200).json({lec,note,message:"Successfully fetched lecture."})
      
    } catch (error) {
        console.log("Error while fetching lecture.",error);
        res.status(500).json({message:"Internal Server Error"})
    }
}
import { Request, Response } from "express";
import prisma from "../prisma/client";

//course creation
export const createCourse = async(req:Request, res:Response)=>{
    try {
        const {title, description, thumbnail, price,category}= req.body;
        const userId= req.user?.id;

        if(!userId){
          return res.status(401).json({error:"Unauthorized. No user id found."})
        }

        const newCourse= await prisma.course.create({
            data:{
                title,
                description,
                thumbnail,
                trainerId:userId,
                price,
                category
            }
        })

        res.status(200).json({message:"course created successfully", newCourse})
    } catch (error) {
        console.error("course creation error:", error);
        res.status(500).json({ error: "Could create course" });
    }
}

// get courses
export const getCourses = async(req:Request, res:Response)=>{
  const trainerId= req.query.trainerId as string;

  if(!trainerId){
    return res.status(401).json({error:"Unauthorized. No user id found."});
  }

  try {
    const courses= await prisma.course.findMany({
      where:{trainerId},
    })

    if(!courses){
      return res.status(404).json({error:"Trainer not found,"})
    }

    res.status(200).json(courses);
  } catch (error) {
    console.log("Error while fetching course",error);
    res.status(500).json({message:"Internal server error"})
  }
}

export const getAllCourses = async(req:Request, res:Response)=>{
  
  try {
    const courses= await prisma.course.findMany();

    if(!courses){
      return res.status(404).json({error:"Trainer not found,"})
    }

    res.status(200).json(courses);
  } catch (error) {
    console.log("Error while fetching course",error);
    res.status(500).json({message:"Internal server error"})
  }
}

// get single course
export const getCourse = async(req:Request, res:Response)=>{
  const courseId= req.params.courseId as string;

  if(!courseId){
    return res.status(400).json({error:" Course Id is required."});
  }

  try {
    const course= await prisma.course.findUnique({
      where:{id:courseId},
    })

    if(!course){
      return res.status(404).json({error:"Course not found,"})
    }

    res.status(200).json(course);
  } catch (error) {
    console.log("Error while fetching course",error);
    res.status(500).json({message:"Internal server error"})
  }
}

// course updates
export const updateCourse = async(req:Request, res:Response)=>{
  const trainerId= req.query.trainerId as string;
  const courseId = req.query.courseId as string;

  const {title, description, thumbnail,price, category}=req.body;

  if(!trainerId){
    return res.status(401).json({error:"Unauthorized. No user id found."});
  }

  try {
    const updatedCourse= await prisma.course.update({
      where:{
        id:courseId,
        trainerId
      },
      data:{
        title,
        description,
        thumbnail,
        price,
        category
      }
    })

    if(!updatedCourse){
      return res.status(404).json({message:"Trainer not found,"})
    }

    res.status(200).json({updatedCourse,message:"Course updated successfully!"});
    
  } catch (error) {
    console.log("Error while fetching course",error);
    res.status(500).json({message:"Internal server error"})
  }
}

// delete course

export const deleteCourse = async(req:Request,res:Response)=>{
  const courseId = req.query.courseId as string;

  try {
    const deleteCourse = await prisma.course.delete({
      where:{id:courseId}
    })

    if(!deleteCourse){
      return res.status(400).json({message:"Error: Course is not deleted"})
    }

    res.status(200).json({message:"Course deleted Successfully!"})
  } catch (error) {
    console.log("Error deleting course",error);
    res.status(500).json({message:"Internal server error"})
  }
}



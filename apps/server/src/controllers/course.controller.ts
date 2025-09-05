import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Category } from "../generated/prisma";
import { Prisma } from '@prisma/client';

//course creation
export const createCourse = async(req:Request, res:Response)=>{
    try {
        const {title, description, thumbnail, price,category}= req.body;
        const userId= req.user?.id;

        if(!userId){
          return res.status(401).json({error:"Unauthorized. No user id found."})
        }

        const user= await prisma.user.findUnique({
            where:{id:userId}
        })

        const newCourse= await prisma.course.create({
            data:{
                title,
                description,
                thumbnail,
                trainerId:userId,
                price,
                category,
                instructor:user?.username || "Unknown"
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
  const page= parseInt(req.query.page as string) || 1;
  const limit= parseInt(req.query.limit as string) || 6;

  const skip=(page - 1) * limit;
  
  try {
    const [totalCourses, courses]= await prisma.$transaction([
      prisma.course.count(),
      prisma.course.findMany({
        skip:skip,
        take:limit,
        orderBy:{
          createdAt:'desc'
        }
      })
    ])

    const totalPages= Math.ceil(totalCourses/limit);

    res.status(200).json({
      courses,
      totalPages,
      currentPage:page,
    })

  } catch (error) {
    console.log("Error while fetching courses with pagination",error);
    res.status(500).json({message:"Failed to fetch courses."})
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

export const deleteCourse = async (req: Request, res: Response) => {
  const courseId = req.query.courseId as string;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required." });
  }

  try {
    const deletedCourseData = await prisma.$transaction(async (tx) => {
      
      await tx.lectureCompletion.deleteMany({
        where: { lecture: { courseId: courseId } },
      });
      await tx.quiz.deleteMany({
        where: { lecture: { courseId: courseId } },
      });
      
 
      await tx.lecture.deleteMany({
        where: { courseId: courseId },
      });

    
      await tx.rating.deleteMany({ where: { courseId: courseId } });
      await tx.enrollment.deleteMany({ where: { courseId: courseId } });
      await tx.cartItem.deleteMany({ where: { courseId: courseId } });
      await tx.orderItem.deleteMany({ where: { courseId: courseId } });
      await tx.note.deleteMany({ where: { courseId: courseId } });

      const deletedCourse = await tx.course.delete({
        where: { id: courseId },
      });
      
      return deletedCourse;
    });

    res.status(200).json({ 
      message: "Course and all related data deleted successfully.", 
      course: deletedCourseData 
    });

  } catch (error) {
    console.log("Error deleting course", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ message: `Course with ID ${courseId} not found.` });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};


// search course

const formatQuery= (query:string)=>{
  if(!query || typeof query !== 'string')return '';
  return query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
}

export const searchCourse=async(req:Request,res:Response)=>{
  const {q}=req.query;

  if(!q){
    return res.status(400).json({message:"Search query is required"});
  }

  const formattedQuery=formatQuery(q as string);

  try {
    const courses=await prisma.course.findMany({
      where:{
        OR:[
          {
            title:{contains:q as string,
              mode:'insensitive'
            }
          },
          {
            trainer: {
              username: {
                contains: q as string,
                mode: 'insensitive',
              },
            },
          },
          // {
          //   category:{
          //     equals:formattedQuery,
          //   }
          // }
        ]
      },
      include:{
        trainer:{
          select:{
            username:true,
            profilePic:true,
          }
        }
      }
    })

    res.status(200).json({courses});
  } catch (error) {
    console.error("Failed to search courses:", error);
    res.status(500).json({ message: 'Something went wrong on the server.' });
  }
}

// get courses by category

export const getCourseByCategory= async(req:Request,res:Response)=>{
  const category= req.params.category;

  try {
    const courses= await prisma.course.findMany({
      where:{
        category: category as Category
      },
      include:{
        trainer:{
          select:{
            username:true,
          }
        }
      }
    })

    if(courses.length === 0){
      res.status(200).json({message:"No courses found in this category."});
    }

    res.status(200).json({courses});
  } catch (error) {
    console.error("Failed to Fetch courses:", error);
    res.status(500).json({ message: 'Something went wrong on the server.' });
  }
}


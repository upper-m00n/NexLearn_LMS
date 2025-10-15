import { Request,Response } from "express";
import prisma from "../prisma/client";


//fetch enrolled courses
export const fetchEnrolledCourses = async (req: Request, res: Response) => {
  try {
    console.log("hit");

    const studentId = req.params.studentId as string;

    if (!studentId) {
      return res.status(400).json({ message: "Login required" });
    }

    const enrolledCourses = await prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true },
    });

    // Always return 200 with array, even if empty
    return res.status(200).json({
      enrolledCourses,
      message:
        enrolledCourses.length === 0
          ? "No enrolled courses found"
          : "Enrolled courses fetched successfully!",
    });
  } catch (error) {
    console.log("Error while fetching enrolled courses", error);
    res
      .status(500)
      .json({ message: "Error while fetching enrolled courses" });
  }
};
// fetch total no of students enrolled under a trainer

export const totalStudentsEnrolledUnderATrainer= async (req:Request,res:Response)=>{
    try {
        console.log("hit");
        const {trainerId}=req.query;

        if(!trainerId) return res.status(400).json({message:"Not logged in."});

        const students= await prisma.enrollment.findMany({
            where:{
                course:{
                    trainerId:trainerId as string
                }
            },
            distinct:['studentId'],
            select:{
                studentId:true
            }
        })

        res.status(200).json({students,message:"successfully fetch no of students enrolled under a trainer"})

    } catch (error) {
        console.log("Error while fetching enrolled students.",error);
        res.status(500).json({message:"Error while fetching enrolled students."})
    }
}

// no. of student enrolled per course
export const totalStudentsEnrolledPerCourse = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.query;

    if (!trainerId) return res.status(400).json({ message: "Not logged in." });

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          trainerId: trainerId as string,
        },
      },
      select: {
        courseId: true,
        studentId: true,
      },
    });

    // group students by courseId
    const grouped = enrollments.reduce((acc, cur) => {
      acc[cur.courseId] = (acc[cur.courseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({ students: grouped });
  } catch (error) {
    console.log("Error while fetching enrolled students per course", error);
    res.status(500).json({ message: "Error while fetching enrolled students." });
  }
};

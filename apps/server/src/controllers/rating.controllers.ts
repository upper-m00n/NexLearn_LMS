import { Request,Response } from "express";
import prisma from "../prisma/client";

// set or update course rating
export const setCourseRating = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    
    const { value,studentId } = req.body; 

    if (!studentId) {
      return res.status(401).json({ message: "You must be logged in to rate a course." });
    }

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Invalid rating value. Must be between 1 and 5." });
    }

    // Use a transaction to ensure both operations succeed or fail together
    const updatedCourse = await prisma.$transaction(async (tx) => {

      await tx.rating.upsert({
        where: {
          
          studentId_courseId: {
            studentId: studentId,
            courseId: courseId,
          },
        },
        update: { value: value }, 
        create: {
          value: value,
          studentId: studentId,
          courseId: courseId,
        }, 
      });

      
      const allRatingsForCourse = await tx.rating.findMany({
        where: { courseId: courseId },
      });

      const ratingCount = allRatingsForCourse.length;
      
      const totalRating = allRatingsForCourse.reduce((acc, rating) => acc + rating.value, 0);

      const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

      const courseWithNewRating = await tx.course.update({
        where: { id: courseId },
        data: {
          rating: parseFloat(averageRating.toFixed(2)), 
          ratingCount: ratingCount,
        },
      });
      
      return courseWithNewRating;
    });

    res.status(200).json(updatedCourse);

  } catch (error) {
    console.log("Error while updating ratings", error);
    res.status(500).json({ message: "Error while updating ratings." });
  }
};

// get rating by student for a course
export const getCourseRatingByStudent = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(401).json({ message: "Student ID is required." });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
    });

    if (existingRating) {
     
      res.status(200).json({ hasRated: true, rating: existingRating.value });
    } else {
      
      res.status(200).json({ hasRated: false, rating: null });
    }
  } catch (error) {
    console.log("Error fetching student rating:", error);
    res.status(500).json({ message: "Error fetching student rating." });
  }
};
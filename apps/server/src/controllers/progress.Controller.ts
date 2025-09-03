import { Request, Response } from 'express';
import prisma from '../prisma/client';

// ✅ FIXED: mark lecture status
export const markLecture = async (req: Request, res: Response) => {
    const { userId, lectureId, status } = req.body;

    if (!userId || !lectureId || typeof status !== 'boolean') {
        return res.status(400).json({ message: "User ID, Lecture ID, and a boolean status are required." });
    }

    try {
        const completion = await prisma.lectureCompletion.upsert({
            where: {
                userId_lectureId: { userId, lectureId }
            },
            update: {
                status,
                // Optionally update completedAt only when status becomes true
                completedAt: status ? new Date() : null,
            },
            create: {
                userId,
                lectureId,
                // FIX: Use the status from the request, don't hardcode `true`.
                status,
                completedAt: status ? new Date() : null,
            }
        });
        const message = status ? "Lecture marked as complete!" : "Lecture marked as incomplete.";
        res.status(200).json({ message, completion });
    } catch (error) {
        console.log("Error while marking lecture as completed", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}

//check lecture status
export const checkLectureStatus = async (req: Request, res: Response) => {
    
    const { userId, lectureId } = req.query as { userId: string, lectureId: string };

    if (!userId || !lectureId) {
        return res.status(400).json({ message: "User or lecture id is required." });
    }
    try {
        const check = await prisma.lectureCompletion.findUnique({
            where: { userId_lectureId: { userId, lectureId } }
        });
        res.status(200).json({ message: "Lecture status fetched!", check });
    } catch (error) {
        console.log("Error while fetching lecture status", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}

// get course progress
export const getCourseProgress = async (req: Request, res: Response) => {
    const { userId, courseId } = req.query as {userId:string, courseId:string };

    if (!userId || !courseId) {
        return res.status(400).json("User and courseId are required");
    }

    try {
        const totalLectures = await prisma.lecture.count({
            where: { courseId }
        });

        if (totalLectures === 0) {
            return res.status(200).json({ progressPercentage: 0, completedCount: 0, totalCount: 0 });
        }

        const completedLectures = await prisma.lectureCompletion.count({
            where: {
                userId,
                lecture: { courseId },
                status: true
            }
        });

        const progressPercentage = (completedLectures / totalLectures) * 100;

        res.status(200).json({
            progressPercentage: Math.round(progressPercentage),
            completedCount: completedLectures,
            totalCount: totalLectures
        });
    } catch (error) {
        console.error('Error getting course progress:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
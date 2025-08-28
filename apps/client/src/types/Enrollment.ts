import { Course } from "./course";
export type Enrollment = {
  id: string;
  courseId: string;
  studentId: string;
  createdAt: string; // ISO date string
  course:Course;
};

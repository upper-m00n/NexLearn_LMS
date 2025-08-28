'use client'

import { BASE_URL } from "@/axios/axios";
import { EnrolledCoursesCard } from "@/components/EnrolledCourseCard";
import { useAuth } from "@/context/AuthContext";
import { Enrollment } from "@/types/Enrollment";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MyCourses = () => {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchEnrolledCourses = async () => {
    try {
      const studentId = user?.id;
      console.log("studentId", studentId);
      const res = await axios.get(`${BASE_URL}/api/enrolled-courses/${studentId}`);
      console.log(res.data);
      setEnrolled(res.data.enrolledCourses);
      toast.success("Your enrolled courses fetched successfully");
    } catch (error: any) {
      console.log("Error while fetching enrolled courses", error);
      
      
      if (error.response?.status === 404) {
        setEnrolled([]);
        toast.info("You haven't enrolled in any courses yet");
      } else {
        toast.error("Couldn't fetch enrolled courses");
      }
    } finally {
      setLoading(false);
    }
  };
  if (user) fetchEnrolledCourses();
}, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-full text-white p-10 shadow-lg">
        <h1 className="text-4xl font-bold">📚 My Courses</h1>
        <p className="text-lg opacity-90 mt-2">
          Welcome back, {user?.username|| "Learner"}! Here are your enrolled courses.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <p className="text-gray-600 text-lg">Loading your courses...</p>
          </div>
        ) : enrolled.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              You haven’t enrolled in any courses yet.
            </h2>
            <p className="text-gray-500 mt-2">
              Browse our catalog and start learning today!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolled.map((enrollment) => (
              <EnrolledCoursesCard key={enrollment.courseId} course={enrollment.course} />
            ))} 
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

'use client';

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CourseCard } from "@/components/CourseCard";

export default function Courses(){
    const {user,token,loading}= useAuth();
    const router = useRouter();

    console.log("user from",user)

    const [courses,setCourses]= useState<any[]>([]);


    useEffect(() => {
  if (loading) return;

  if (!user || !token) {
    router.push('/login');
    return;
  }

  if (user.role !== 'TRAINER') {
    router.push('/unauthorized');
    return;
  }

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/course/getCourses', {
        params: { trainerId: user.id },
        headers:{
            Authorization: `Bearer ${token}`
        }

      });

      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  fetchCourses();
}, [user, token, loading, router]);


    return (
        <div>
            <h1>Your Courses</h1>
            {
                courses.map((course)=>(
                    <CourseCard course={course}/>
                ))
            }
        </div>
    )
}
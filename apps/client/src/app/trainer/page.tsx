"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard"; // adjust path as needed
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

// Dummy data - replace with fetched data or props
export default function TrainerDashboard() {
  const router = useRouter();
  const [courses,setCourses]= useState([]);
  const {user,token,loading}= useAuth();

  useEffect(()=>{
    if(loading) return;
    if (!user || !token) {
        router.push('/login');
        return;
    }

    if (user.role !== 'TRAINER') {
        router.push('/unauthorized');
        return;
    }
    const fetchCourses =async()=>{
        try {
            const res = await axios.get('http://localhost:4000/api/course/getCourses',{
                params:{trainerId:user?.id},
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            setCourses(res.data);
            toast(res.data.message)

        } catch (error) {
            toast('Error fetching courses')
            console.log("error fetching courses on dashboared",error);
        }
    }

    fetchCourses();
  },[courses,user,token,loading])

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Trainer Dashboard</h1>
        <Button onClick={() => router.push("/trainer/courses/create")}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">342</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹56,700</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((course,ind) => (
            <CourseCard key={ind} course={course} />
          ))}
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Analytics (Coming Soon)</h2>
        <div className="p-6 border rounded-md text-muted-foreground">
          Stats like views, completion rate, and earnings will appear here.
        </div>
      </div>
    </main>
  );
}

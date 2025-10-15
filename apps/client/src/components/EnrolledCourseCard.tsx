'use client';

import { BASE_URL } from "@/axios/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/types/course";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress"; 
import { useAuth } from "@/context/AuthContext";
import { StarRating } from "./RatingStars"; 
import { ArrowRight } from "lucide-react";

type CardDemoProps = {
  course: Course;
};

export function EnrolledCoursesCard({ course }: CardDemoProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
     
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchCourseProgress = async () => {
    
      if (!user.id || !course.id) return;
      
      try {
        const res = await axios.get(`${BASE_URL}/api/progress/calculate`, {
          params: { userId: user.id, courseId: course.id }
        });
        setProgressValue(res.data.progressPercentage);
      } catch (error) {
        console.error("Failed to fetch course progress", error);
      
      }
    };
    
    fetchCourseProgress();
    
 
  }, [user, authLoading, course.id, router]);

  return (

    <Card className="w-full max-w-sm overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      
  
      <div className="relative aspect-video w-full">
        <img
          src={course.thumbnail || "/fallback.png"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

 
      <div className="p-4 flex flex-col flex-grow">
        <CardHeader className="p-0">
          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
            {course.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-4 flex-grow space-y-4">
         
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <span className="text-sm font-bold text-indigo-600">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2"/>
          </div>
          
    
          <div className="pt-2">
             <StarRating courseId={course.id as string}/>
          </div>
        </CardContent>

    
        <CardFooter className="p-0 mt-6">
          <Button
            type="button"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold flex items-center gap-2"
            onClick={() => router.push(`/student/my-courses/${course.id}`)}
          >
            Continue Learning <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
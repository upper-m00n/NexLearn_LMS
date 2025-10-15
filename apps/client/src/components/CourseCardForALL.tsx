import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import RatingsStarsForUnEnrolled from "./RatingsStarsForUnEnrolled"
import { ArrowRight } from "lucide-react"



type CourseCardProps ={
  course:{
    id?:string;
    title:string;
    description:string;
    thumbnail:string;
    price:number;
    rating?:number;
    category:string
  }
}

export function CourseCardForALL({course}:CourseCardProps) {
  const {user}=useAuth();
  const router= useRouter();
  const[message,setMessage]=useState('');

  
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
        <h2 className="font-semibold text-gray-600">{course.category}</h2>
        <CardContent className="p-0 mt-4 flex-grow space-y-4">
        
    
          <div className="pt-2">
            <h2>Course Rating</h2>
             <RatingsStarsForUnEnrolled totalRating={course.rating ?? 0}/>
          </div>
        </CardContent>

    
        <CardFooter className="p-0 mt-6">
          <Button
            type="button"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold flex items-center gap-2"
            onClick={() => router.push(`/student/course/${course.id}`)}
          >
            View Course<ArrowRight size={16} />
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

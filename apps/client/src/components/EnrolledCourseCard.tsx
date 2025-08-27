import { BASE_URL } from "@/axios/axios"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Course } from "@/types/course"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type CardDemoProps = {
  courseId: string;
}

export function EnrolledCoursesCard({courseId}:CardDemoProps) {
    const router=useRouter();

    const [course,setCourse]=useState<Course>({
        title: "",
        description: "",
        price: 0,
        rating: "",
        createdAt: "",
        id:"",
        category:"",
    })
    const [thumbnail,setThumbnailUrl]=useState('');
    useEffect(()=>{
        const fetchCourse = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/course/get/${courseId}`);
            setCourse(res.data);
            setThumbnailUrl(res.data.thumbnail);
            toast.success("Course fetched successfully!");
        } catch (error) {
            toast.error("Unable to fetch course.");
        }
    };
    fetchCourse();
},[courseId])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-black">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
                <img src={thumbnail} alt="" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={()=> (router.push(`/student/my-courses/${courseId}`))}>
          View 
        </Button>
        <Button variant="outline" className="w-full">
          Rate course
        </Button>
      </CardFooter>
    </Card>
  )
}

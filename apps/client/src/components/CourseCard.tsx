import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useRouter } from "next/navigation"



type CourseCardProps ={
  course:{
    id:string;
    title:string;
    description:string;
    thumbnail:string;
  }
}

export function CourseCard({course}:CourseCardProps) {
  const router= useRouter();

  const handleUpdate=(course:CourseCardProps["course"])=>{
    const query= new URLSearchParams({
        id:course.id,
        title:course.title,
        description:course.description,
        thumbnail:course.thumbnail
    }).toString();

    router.push(`/trainer/courses/update?${query}`)
  }
  
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>
          {course.description}
        </CardDescription>
        <CardAction>
          <Button variant="outline" className="bg-red-500" >Delete</Button>
          <Button variant="outline" className="bg-yellow-500" onClick={()=> handleUpdate(course)}>Update</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <img src={course.thumbnail} alt="" className="w-full rounded"/>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full">
          View Course
        </Button>
      </CardFooter>
    </Card>
  )
}

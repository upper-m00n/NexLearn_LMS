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
import { StarRating } from "./RatingStars"


type CardDemoProps = {
  course: Course;
}

export function EnrolledCoursesCard({ course }: CardDemoProps) {
    const router=useRouter();  

  return (
     <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-black">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <img src="/fallback.png" alt="Default course thumbnail" />
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="button"
          className="w-full"
          onClick={() => router.push(`/student/my-courses/${course.id}`)}
        >
          View
        </Button>
        <StarRating courseId={course.id as string}/>
      </CardFooter>
    </Card>
    )
}

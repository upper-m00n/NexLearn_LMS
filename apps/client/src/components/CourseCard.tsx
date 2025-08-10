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
import axios from "axios"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"



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
  const[message,setMessage]=useState('');

  // handle update
  const handleUpdate=(course:CourseCardProps["course"])=>{
  
    router.push(`/trainer/courses/${course.id}/update-course`)
  }

  // handle delete
  const handleDelete=async(course:CourseCardProps["course"])=>{
    try {
      const res= await axios.delete('http://localhost:4000/api/course/delete',{
        params:{courseId:course.id},
      })
      setMessage(res.data.message);
      toast(message)

    } catch (error) {
      console.error("Error deleting courses");
      toast(message);
    }
  }

  const handleView=(course:CourseCardProps["course"])=>{
    router.push(`/trainer/courses/${course.id}`)
  }
  
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>
          {course.description}
        </CardDescription>
        <CardAction>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  Course and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>handleDelete(course)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={()=> handleUpdate(course)}>Update</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <img src={course.thumbnail} alt="" className="w-full rounded"/>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={()=> handleView(course)}>
          View Course
        </Button>
      </CardFooter>
    </Card>
  )
}

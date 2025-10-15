import type { Lecture } from "@/types/Lecture"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Button } from "./ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { BASE_URL } from "@/axios/axios"

type LectureProps={
    lectures:Lecture[]
}

  

export default function Lectures({lectures}:LectureProps){
    const {user,token}=useAuth();
    const router= useRouter();
    const [deleteMessage,setDeleteMessage]= useState('');


 // delete lecture
    const handleDeleteLecture= async(lectureId : string)=>{
    try {
      const res=await axios.delete(`${BASE_URL}/api/lecture/delete/${lectureId}`,{
        params:{lectureId}
      })
      setDeleteMessage(res.data.message);
      toast.success(deleteMessage || "Lecture deleted successfully.")

    } catch (error) {
      toast.error(deleteMessage);
      console.log("Error while deleting lectures.",error)
    }
  }

    const handleView=(lectureId: string)=>{
        router.push(`/trainer/courses/lecture/${lectureId}`)
    }

    return(
        <Accordion type="single" collapsible className="w-full">
        {lectures.map((lecture, index) => (
          <AccordionItem value={lecture.id} key={lecture.id}>
            <AccordionTrigger>{lecture.title}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2">
                <p className="text-gray-700 flex-1">{lecture.description}</p>

                <div className="flex gap-2">
                  {user?.role=='TRAINER' &&(
                    <Button
                      variant="outline"
                      className="bg-black text-white"
                      onClick={()=>handleView(lecture.id)}
                    >
                      View Lecture
                    </Button>
                  )}

                  {user?.role=='TRAINER' && (
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the selected
                          lecture and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteLecture(lecture.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
}
'use client';
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type Lecture={
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string;
}

const course=()=>{
  
  const {user,token,loading}= useAuth();
  const searchParams = useSearchParams();

  const [lectures, setLectures]= useState<Lecture[]>([]);
  const [loadingLectures,setLoadingLectures]= useState(false);
  const [message,setMessage]= useState("");
  const [deleteMessage, setDeleteMessage]= useState("");

  const courseId = searchParams.get('id') || '';
  const title= searchParams.get('title') || '';
  const description= searchParams.get('description') || '';
  const thumbnail= searchParams.get('thumbnail')|| '';
  const router= useRouter();

  const handleCreateLecture=()=>{
    router.push(`/trainer/courses/${courseId}/create-lecture`)
  }

  useEffect(()=>{
    const fetchLectures= async()=>{
      try {
        setLoadingLectures(true);
        toast("Fetching Lectures")
        const res= await axios.get(`http://localhost:4000/api/lecture/get?courseId=${courseId}`)
        if(res.data?.lectures){
          setLectures(res.data.lectures);
        }
        
        setMessage(res.data.message);
        toast(message);
        
      } catch (error) {
        console.log("Error while fetching lectures",error);
        toast(message);
      }
      finally{
        setLoadingLectures(false);
      }
    }
    fetchLectures();
  },[])

  const handleDeleteLecture= async(lectureId : string)=>{
    try {
      const res=await axios.delete(`http://localhost:4000/api/lecture/delete/${lectureId}`,{
        params:{lectureId}
      })
      setDeleteMessage(res.data.message);
      toast.success(deleteMessage || "Lecture deleted successfully.")

      setLectures((prev)=> prev.filter((lecture)=> lecture.id !== lectureId))
      
    } catch (error) {
      toast.error(deleteMessage);
      console.log("Error while deleting lectures.",error)
    }
  }

  const handleView=(lectureId: string)=>{
    router.push(`/trainer/courses/lecture/${lectureId}`)
  }

  return(
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-8">
  {/* Course Title and Thumbnail */}
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">{title}</h1>

    <div className="relative w-full max-w-[500px] h-64 rounded-md overflow-hidden">
      <Image
        src={thumbnail || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover"
      />
    </div>

    <p className="text-gray-600">{description}</p>
    <Button onClick={handleCreateLecture}>Add New Lecture</Button>
  </div>

  <Separator />

  {/* Lectures Section */}
  <div className="space-y-4 w-[1000px]">
    <h2 className="text-2xl font-bold ">Lectures</h2>
    {loadingLectures ? (
      <p>Loading...</p>
    ) : lectures.length > 0 ? (
      <Accordion type="single" collapsible className="w-full">
        {lectures.map((lecture, index) => (
          <AccordionItem value={lecture.id} key={lecture.id}>
            <AccordionTrigger>{lecture.title}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2">
                <p className="text-gray-700 flex-1">{lecture.description}</p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-black text-white"
                    onClick={()=>handleView(lecture.id)}
                  >
                    View Lecture
                  </Button>

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
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    ) : (
      <p className="text-gray-600">{message || "No lectures have been added yet."}</p>
    )}
  </div>
</div>

  )
}

export default course;
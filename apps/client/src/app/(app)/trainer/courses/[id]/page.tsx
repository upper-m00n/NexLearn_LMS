'use client';
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image"
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator"
import { Course } from "@/types/course";
import Lectures from "@/components/Lectures";

type Lecture={
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string;
}

const course=()=>{
  
  const {user,token,loading}= useAuth();
  const params = useParams();

  const courseId= params.id;

  const [course,setCourse]= useState<Course>({
    title:"",
    description:"",
    price:0,
    rating:0,
    createdAt:"",
    category:"",
  });
  const [lectures, setLectures]= useState<Lecture[]>([]);
  const [loadingLectures,setLoadingLectures]= useState(false);
  const [message,setMessage]= useState("");

  const [thumbnailUrl, setThumbnailUrl] = useState('')

  
  const router= useRouter();

  const handleCreateLecture=()=>{
    router.push(`/trainer/courses/${courseId}/create-lecture`)
  }

  useEffect(()=>{
    const fetchCourse= async()=>{
      try {
        const res= await axios.get(`http://localhost:4000/api/course/get/${courseId}`);
        setCourse(res.data);
        console.log("course",res.data);
        setThumbnailUrl(res.data.thumbnail);
        toast.success("Course fetched successfully!");
      } catch (error) {
        console.log("Error while fetching course");
        toast.error("Unable to fetch course.");
      }
    }
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
    fetchCourse();
    fetchLectures();
  },[])

  
  return(
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-8">
    
  {/* Course Title and Thumbnail */}
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">{course.title}</h1>

    <div className="relative w-full max-w-[500px] h-64 rounded-md overflow-hidden">
      <Image
        src={thumbnailUrl || "/placeholder.svg"}
        alt={course.title}
        fill
        className="object-cover"
      />
    </div>

    <p className="text-gray-600">{course.description}</p>
    <Button onClick={handleCreateLecture}>Add New Lecture</Button>
  </div>

  <Separator />

  {/* Lectures Section */}
  <div className="space-y-4 w-[1000px]">
    <h2 className="text-2xl font-bold ">Lectures</h2>
    {loadingLectures ? (
      <p>Loading...</p>
    ) : lectures.length > 0 ? (
      
      // lectures list
      <Lectures lectures={lectures}/>
    ) : (
      <p className="text-gray-600">{message || "No lectures have been added yet."}</p>
    )}
  </div>
</div>

  )
}

export default course;
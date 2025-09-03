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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Course } from "@/types/course";
import { BASE_URL } from "@/axios/axios";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";


type Lecture={
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string;
}

const course=()=>{
  const params = useParams();
  const {user,loading}=useAuth();
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

  const [progressvalue,setProgressValue]=useState(0);

  
  const router= useRouter();


  useEffect(()=>{
    if(loading){
      return;
    }
    if(!user){
      router.push('/login')
    }

    const fetchCourse= async()=>{
  
      try {
        const res= await axios.get(`${BASE_URL}/api/course/get/${courseId}`);

        setCourse(res.data);

        //console.log("course",res.data);
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

        const res= await axios.get(`${BASE_URL}/api/lecture/get?courseId=${courseId}`)

        if(res.data?.lectures){
          setLectures(res.data.lectures);
        }

        setMessage("Lectures fetched successfully");
        toast(message);
        
      } catch (error) {
        console.log("Error while fetching lectures",error);
        toast(message);
      }
      finally{
        setLoadingLectures(false);
      }
    }

    const calculateProgress=async()=>{
      try {
        console.log("user and courseid",user?.id);
        console.log(courseId);
         if (!user?.id || !courseId) {
              console.log("User or Course ID is not available yet. Skipping progress fetch.");
              return;
          }
        const res= await axios.get(`${BASE_URL}/api/progress/calculate`,{
          params:{
            userId:user?.id,
            courseId
          }
        })
        console.log(res.data);
        setProgressValue(res.data.progressPercentage);

      } catch (error) {
        console.log("couldn't fetch course progress",error);
        toast.error("Couldn't fetch course progress");
      }
    }

    fetchCourse();
    fetchLectures();
    calculateProgress();
  },[user,loading])

    const handleView=(lectureId: string)=>{
        router.push(`/student/lecture/${lectureId}`)
    }
  
  return(
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-8 mt-10">
    
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
    
  </div>

  <div>
    <Label className="text-2xl mb-2">Course Progress</Label>
    <Progress value={progressvalue} />
  </div>

  <Separator />

  {/* Lectures Section */}
  <div className="space-y-4 w-[1000px]">
    <h2 className="text-2xl font-bold ">Lectures</h2>
    {loadingLectures ? (
      <p>Loading...</p>
    ) : lectures.length > 0 ? (
      
      // lectures list
      <div>
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
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </div>
    ) : (
      <p className="text-gray-600">{message || "No lectures have been added yet."}</p>
    )}
  </div>
</div>

  )
}

export default course;
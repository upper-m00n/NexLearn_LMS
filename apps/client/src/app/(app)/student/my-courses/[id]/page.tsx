'use client';
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Course } from "@/types/course";
import { BASE_URL } from "@/axios/axios";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Loader2 } from 'lucide-react'; // Import icons

type Lecture={
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string;
}

const CoursePage = () => {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const courseId = params.id;
  const router = useRouter();

  // --- State Management ---
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (authLoading) return; 
    if (!user) {
      router.push('/login');
      return;
    }
    if (!courseId) return; 

    const fetchAllData = async () => {
      setPageLoading(true);
      try {
    
        const [courseRes, lecturesRes, progressRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/course/get/${courseId}`),
          axios.get(`${BASE_URL}/api/lecture/get?courseId=${courseId}`),
          axios.get(`${BASE_URL}/api/progress/calculate`, {
            params: { userId: user.id, courseId }
          })
        ]);

        setCourse(courseRes.data);
        setLectures(lecturesRes.data?.lectures || []);
        setProgressValue(progressRes.data.progressPercentage);
        
        toast.success("Course data loaded successfully!");
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to load course data. Please try again.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAllData();
  }, [user, authLoading, courseId, router]);

  const handleView = (lectureId: string) => {
    router.push(`/student/lecture/${lectureId}`);
  };

  // --- Loading State UI ---
  if (pageLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl font-medium">Loading Course...</p>
      </div>
    );
  }


  return (

    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
        
   
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-1">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={course?.thumbnail || "/placeholder.svg"}
                alt={course?.title || "Course Thumbnail"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <p className="text-indigo-600 font-semibold">{course?.category}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{course?.title}</h1>
            <p className="text-gray-600 text-base">{course?.description}</p>
          </div>
        </div>

       
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
             <Label className="text-lg font-bold text-gray-800">Your Progress</Label>
             <span className="font-bold text-indigo-600">{progressValue}% Complete</span>
          </div>
          <Progress value={progressValue} className="w-full h-3" />
        </div>

        <Separator />


        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
          {lectures.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {lectures.map((lecture) => (
                <AccordionItem value={lecture.id} key={lecture.id}>
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    {lecture.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2 pl-2 border-l-2 border-indigo-200">
                      <p className="text-gray-600 flex-1">{lecture.description}</p>
                      <Button
                        onClick={() => handleView(lecture.id)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 self-start sm:self-center"
                      >
                        <PlayCircle size={20} />
                        View Lecture
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500 font-medium">No lectures have been added to this course yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
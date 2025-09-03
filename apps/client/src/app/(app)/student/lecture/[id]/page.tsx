'use client';

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch"
import AiContentModal from "@/components/AiContentModal";
import { BASE_URL } from "@/axios/axios";
import QuizModal from "@/components/QuizModal";
import { BookOpen, BrainCircuit, FileText } from 'lucide-react'; // For icons
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { boolean } from "zod";

// --- Types ---
type Lecture = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  summary?: string | null;
  transcript?: string | null;
};

type Note = {
  pdfUrl: string;
};

const LecturePage = () => {
  const params = useParams();
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const lectureId = params.id as string;

  // --- States ---
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [status, setStatus]=useState(false);
  const [statusLoading,setStatusLoading]=useState(false);

  // --- Effects ---
  useEffect(() => {
    if (authLoading) return;
    if (!authLoading && (!user || !token)) {
      router.push("/login");
    }
  }, [user, token, router, authLoading]);

  useEffect(() => {
    if (!lectureId) return;
    const fetchLecture = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/lecture/get-lecture/${lectureId}`);

        setLecture(res.data.lec);
        setNote(res.data.note);

        toast.success("Lecture data loaded!");
      } catch (error) {
        console.error("Error fetching lecture", error);
        toast.error("Lecture not found!");
      } finally {
        setPageLoading(false);
      }
    };
    fetchLecture();
  }, [lectureId]);

  useEffect(()=>{
    const fetchLectureStatus=async()=>{
      if(!user?.id || !lectureId){
        return;
      }
      setStatusLoading(true);
      try {
        const res= await axios.get(`${BASE_URL}/api/progress/check`,{
          params:{
            userId:user.id,
            lectureId
          }
        })
        setStatus(res.data.check.status || false);
        console.log("status",res.data);
      }
      catch(error){
        console.log("Errorr while fetching status",error)
        setStatus(false);
      }
      finally{
        setStatusLoading(false);
      }
    }
    fetchLectureStatus();
  },[user?.id]);

  // --- Handlers ---
  const handleAiButtonClick = async (type: 'summary' | 'transcript') => {
    if (!lecture) return;
    const title = type === 'summary' ? "AI Generated Summary" : "Full Video Transcript";
    setModalTitle(title);

    if (lecture[type]) {
      setModalContent(lecture[type]!);
      setIsModalOpen(true);
      return;
    }

    setIsProcessing(true);
    toast.info(`Generating ${type}...`);
    try {
      const res = await axios.post(`${BASE_URL}/api/lecture/process/${lecture.id}`);
      const updatedLecture: Lecture = res.data.lecture;
      setLecture(updatedLecture);
      setModalContent(updatedLecture[type]!);
      setIsModalOpen(true);
      toast.success(`${title} generated successfully!`);
    } catch (error) {
      console.error(`Error generating ${type}`, error);
      toast.error(`Failed to generate ${type}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/quizzes/generate/${lectureId}`);
      setQuizData(res.data.quiz);
      setIsQuizModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate the quiz. Please try again.");
      console.error("Failed to fetch quiz", error);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleMarkLecture=async()=>{

    const newStatus=!status;

    setStatus(newStatus);
    try {
      const res=await axios.post(`${BASE_URL}/api/progress/complete`,{
        userId:user?.id,
        lectureId,
        status:newStatus
      })

      //console.log("completion",res.data.completion)
      toast.success("Lecture status changed!")

    } catch (error) {
      console.log("Error while marking lecture",error);
      toast.error("Couldn't mark lecture as completed!")

      setStatus(!newStatus);
    }
  }

  
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Loading Lecture...</p>
      </div>
    );
  }

  return (
    <>
      {/* AI Content Modal */}
      <AiContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
      {/* Quiz Modal */}
      {quizData && (
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          quizData={quizData}
        />
      )}

     
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
         
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              {lecture?.title}
            </h1>
          </div>

         
          <div className="w-full max-w-5xl bg-black rounded-xl shadow-2xl overflow-hidden aspect-video">
            <video controls className="w-full h-full" src={lecture?.videoUrl} />
          </div>

           <div className="flex items-center space-x-2">
            <Switch id="mark-lectue" onCheckedChange={handleMarkLecture} checked={status}/>
            <Label htmlFor="mark-lecture">Mark lecture as Complete/Incomplete</Label>
          </div>
          
          <div className="w-full max-w-5xl p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-center mb-4 text-slate-700 dark:text-slate-200">Enhance Your Learning with AI ✨</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAiButtonClick('transcript')}
                disabled={isProcessing}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-base font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={20} />
                {isProcessing ? 'Processing...' : 'View Transcript'}
              </button>
              <button
                onClick={() => handleAiButtonClick('summary')}
                disabled={isProcessing}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-base font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BrainCircuit size={20} />
                {isProcessing ? 'Processing...' : 'Get Summary'}
              </button>
            </div>
          </div>
          
          
          <div className="w-full max-w-5xl p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">About the Lecture</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {lecture?.description}
            </p>
          </div>

          <div className="w-full max-w-5xl text-center p-6 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-violet-900 dark:text-violet-200">Test Your Knowledge 🧠</h2>
            <p className="mb-6 text-violet-700 dark:text-violet-300">Generate a short quiz based on this lecture to check your understanding.</p>
            <button
              onClick={handleStartQuiz}
              disabled={isLoadingQuiz}
              className="py-3 px-8 rounded-full text-lg font-semibold bg-violet-600 text-white hover:bg-violet-700 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoadingQuiz ? 'Generating Quiz...' : 'Start AI Quiz'}
            </button>
          </div>
          {note?.pdfUrl && (
            <div className="w-full max-w-5xl p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen/> Lecture Notes
              </h2>
              <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <iframe src={note.pdfUrl} title="Lecture Notes" className="w-full h-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LecturePage;
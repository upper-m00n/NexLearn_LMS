// The complete, updated LecturePage component
'use client';

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import AiContentModal from "@/components/AiContentModal"; // Import the modal
import { BASE_URL } from "@/axios/axios";

// Correct types
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

  // States for AI features
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

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
        const res = await axios.get(`http://localhost:4000/api/lecture/get-lecture/${lectureId}`);
        console.log("Fetched lecture data:", res.data);
        setLecture(res.data.lec);
        setNote(res.data.note); // Set the note object
        toast.success("Lecture fetched successfully!");
      } catch (error) {
        console.log("Error while fetching lecture", error);
        toast.error("Lecture Not found!");
      } finally {
        setPageLoading(false);
      }
    };
    fetchLecture();
  }, [lectureId]);

  // --- Logic for AI Buttons ---
  const handleAiButtonClick = async (type: 'summary' | 'transcript') => {
    if (!lecture) return;

    const title = type === 'summary' ? "AI Summary" : "AI Transcript";
    setModalTitle(title);

    // 1. If content already exists, just show it
    if (lecture[type]) {
      setModalContent(lecture[type]!);
      setIsModalOpen(true);
      return;
    }

    // 2. If not, call the backend to process it
    setIsProcessing(true);
    toast.info(`Generating ${type}... This may take a moment.`);
    try {
      // Use the correct API endpoint for processing
      const res = await axios.post(`${BASE_URL}/api/lecture/process/${lecture.id}`);
      const updatedLecture: Lecture = res.data.lecture;

      // Update the local state with the newly processed data
      setLecture(updatedLecture);
      
      // Now show the modal with the new content
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

  if (pageLoading) {
    return <p className="text-center text-gray-500 p-8">Loading lecture...</p>;
  }

  return (
    <>
      <AiContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-col space-y-8 bg-white shadow-lg rounded-2xl p-12">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-800">{lecture?.title}</h1>
          {/* Video Section */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
            <video controls className="w-full h-full object-cover rounded-xl" src={lecture?.videoUrl} />
          </div>

          {/* AI Buttons */}
          <div className="flex flex-row space-x-4">
            <button
              onClick={() => handleAiButtonClick('transcript')}
              disabled={isProcessing}
              className="flex-1 p-4 rounded-full text-center text-lg font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Transcript with AI'}
            </button>
            <button
              onClick={() => handleAiButtonClick('summary')}
              disabled={isProcessing}
              className="flex-1 p-4 rounded-full text-center text-lg font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Summarize with AI'}
            </button>
          </div>
          
          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-700">About the Lecture</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{lecture?.description}</p>
          </div>

          {/* Notes */}
          {note?.pdfUrl && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">Lecture Notes</h2>
              <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
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
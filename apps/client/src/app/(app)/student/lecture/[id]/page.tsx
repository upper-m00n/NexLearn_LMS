'use client'
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

type Lecture = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string;
};

const LecturePage = () => {
  const params = useParams();
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const lectureId = params.id as string;

  // states
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [noteUrl, setNoteUrl] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!loading && (!user || !token)) {
      router.push("/login");
    }
  }, [user, token, router, loading]);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/lecture/get-lecture/${lectureId}`
        );

        setLecture(res.data.lec);
        setNoteUrl(res.data.note.pdfUrl);

        toast.success("Lecture fetched successfully!");
      } catch (error) {
        console.log("Error while fetching lecture", error);
        toast.error("Lecture Not found!");
      }
    };
    fetchLecture();
  }, [lectureId]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {!lecture ? (
        <p className="text-center text-gray-500">Loading lecture...</p>
      ) : (
        <div className="max-w-5xl mx-auto flex flex-col space-y-8 bg-white shadow-lg rounded-2xl p-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-800">
            {lecture.title}
          </h1>

          {/* Video Section */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
            <video
              controls
              className="w-full h-full object-cover rounded-xl"
              src={lecture.videoUrl}
            />
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-700">
              About the Lecture
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {lecture.description}
            </p>
          </div>

          {/* Notes */}
          {noteUrl && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                Lecture Notes
              </h2>
              <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src={noteUrl}
                  title="Lecture Notes"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LecturePage;

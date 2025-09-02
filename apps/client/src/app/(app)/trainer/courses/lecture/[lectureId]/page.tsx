'use client'
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Define the type for a lecture object
type Lecture = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string; // This property is not used in the original type, but your code uses it
};

const LecturePage = () => {
    const params = useParams();
    const { user, token, loading } = useAuth();
    const router = useRouter();

    const lectureId = params.lectureId as string;

    // States
    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [noteUrl, setNoteUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Added loading state for better UX

    // Effect for handling authentication and authorization
    useEffect(() => {
        if (loading) return;

        if (!user || !token) {
            router.push('/login');
        } else if (user.role !== 'TRAINER') {
            router.push('/unauthorized');
        }
    }, [user, token, router, loading]);

    // Effect for fetching lecture data
    useEffect(() => {
        if (!lectureId) return;

        const fetchLecture = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:4000/api/lecture/get-lecture/${lectureId}`);
                
                setLecture(res.data.lec);
                // Assuming the note URL is directly available or constructed
                setNoteUrl(res.data.note.pdfUrl);

                toast.success("Lecture data loaded!");
            } catch (error) {
                console.error("Error while fetching lecture:", error);
                toast.error("Failed to fetch lecture data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLecture();
    }, [lectureId]);

    // Display a centered loading message
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500">Loading Lecture...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {!lecture ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-red-500">Lecture not found</h2>
                        <p className="text-gray-600 mt-2">Could not find the lecture you were looking for.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* Lecture Title */}
                        <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white">
                            {lecture.title}
                        </h1>

                        {/* Video Player Section */}
                        <div className="w-full mx-auto bg-black rounded-xl shadow-2xl overflow-hidden aspect-video max-w-5xl">
                            <video
                                controls
                                className="w-full h-full"
                                src={lecture.videoUrl}
                                // Optional: Add a poster image
                                // poster="/path/to/poster.jpg"
                            />
                        </div>

                        <Separator className="my-4" />

                        {/* About the Lecture Section */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold pb-3 text-slate-900 dark:text-slate-100">
                                About this Lecture
                            </h2>
                            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                {lecture.description}
                            </p>
                        </div>
                        
                        {/* Lecture Notes Section */}
                        {noteUrl && (
                            <div className="w-full bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                                    Lecture Notes 📝
                                </h2>
                                <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <iframe
                                        src={noteUrl}
                                        title="Lecture Notes"
                                        className="w-full h-full"
                                        frameBorder="0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturePage;
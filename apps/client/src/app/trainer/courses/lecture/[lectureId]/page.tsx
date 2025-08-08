'use client'
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

type Lecture={
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  noteUrl: string;
}

const lecture=()=>{
    const params= useParams();
    const {user, token, loading}=useAuth();
    const router=useRouter();

    const lectureId= params.lectureId as string;

    //states
    const [lecture,setLecture]=useState<Lecture | null>(null);
    const [noteUrl,setNoteUrl]= useState('');


    useEffect(()=>{
        if(loading) return;
    
        console.log('Role',user?.role)
        if(!loading && (!user || !token)){
          router.push('/login');
        }
        else if (user?.role !== 'TRAINER') {
          router.push('/unauthorized') // or '/not-found'
        }
    },[user,token,router,loading]);

    useEffect(()=>{
        const fetchLecture= async()=>{
            try {
              const res= await axios.get(`http://localhost:4000/api/lecture/get-lecture/${lectureId}`)

              setLecture(res.data.lec);
              setNoteUrl(res.data.note.pdfUrl);

              console.log(res.data);
              toast.success("Lecture fetched successfully!");
            } catch (error) {
              console.log("Error while fetching lecture",error);
              toast.error("Lecture Not found!");
            }
        }
        fetchLecture();
    },[lectureId])

   

    return(
        <div className="min-h-screen p-6">
          {!lecture?(
            <p>Loading...</p>
          ):(
            <div className="flex flex-col space-y-6">
              <h1 className="text-3xl font-bold">{lecture.title}</h1>

              <div className="w-full aspect-video">
                <video 
                  controls
                  className="w-full h-full rounded-lg"
                  src={lecture.videoUrl}
                />
              </div>
              <Separator/>
              <div className="p-2">
                <h2 className="text-2xl pb-2 font-bold">About the lecture</h2>
                <p className="text-lg">{lecture.description}</p>
              </div>
              

              {noteUrl && (
                <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                  <h2 className="p-5 text-2xl font-bold">Lecture Notes</h2>
                  <iframe
                    src={noteUrl}
                    title="Lecture Notes"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>
    )
}

export default lecture;
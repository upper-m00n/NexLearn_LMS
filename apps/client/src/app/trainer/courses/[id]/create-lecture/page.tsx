"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import lectureSchema from "@/lib/lecture";
import { title } from "process";

export default function CourseForm() {
  const router = useRouter();
  const {user,token,loading}= useAuth();
  const params= useParams();
  const courseId=params.id as string;

  //states
  const [noteUrl, setNoteUrl]= useState("");
  const [videoUrl, setVideoUrl]= useState("");
  const [videoStatus, setVideoStatus]=useState("");
  const [message, setMessage]=useState("");

  //console.log("user",user)
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
  

  const form = useForm<z.infer<typeof lectureSchema>>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof lectureSchema>) => {
    if (!noteUrl || !videoUrl) {
      toast.error("Please upload attachments.")
      return;
    }

    const data = {
      ...values,
      pdfUrl: noteUrl,
      videoUrl: videoUrl,
      courseId
    }

    try {
      const res = await axios.post("http://localhost:4000/api/lecture/create", data,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(res);
      setMessage(res.data.message)
      toast(message)
      //console.log("Submitted Course:", data)
      //router.push(`/trainer/courses/${courseId}`)
    } catch (error) {
      toast.error(message)
      console.error("Error while creating course:", error)
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Get authentication params from backend
    const authRes = await fetch("http://localhost:4000/api/imagekit/imagekit-auth");
    const auth = await authRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", "public_Mn4JpNN5SqQufk9nqa+bNgmdGNY=");
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);
    formData.append("folder", "/notes");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.url) {
      setNoteUrl(data.url);
      toast.success("PDF uploaded!");
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Error uploading PDF:", error);
    toast.error("Notes Upload failed");
  }
};

  const handleVideoUpload = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file= e.target.files?.[0];

    if(!file)return;

    try {
      

      const res= await axios.post("http://localhost:4000/api/mux/upload",{
        title:file.name
      },{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })

      const data = res.data;
      toast.success(data.message);
      if(data.uploadUrl){
        setVideoUrl(data.uploadUrl);
        setVideoStatus(data.message);
      }
      else{
        throw new Error("Video upload failed.");
      }
      
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Video upload failed.")
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 shadow-2xl text-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-xl">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecture Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecture Description</FormLabel>
                <FormControl>
                  <Input placeholder="Write course description here." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormItem>
            <FormLabel>Upload Notes (PDF)</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handlePdfUpload} />
            </FormControl>
            {noteUrl && (
              <p className="text-green-600 mt-1">PDF uploaded.</p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Upload Lecture Video</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleVideoUpload} />
            </FormControl>
            {videoUrl && (
              <p className="text-green-600 mt-1">{videoStatus || "Video uploaded"}</p>
            )}
          </FormItem>
          <Button type="submit">Create Lecture</Button>
        </form>
      </Form>
    </div>
  )
}

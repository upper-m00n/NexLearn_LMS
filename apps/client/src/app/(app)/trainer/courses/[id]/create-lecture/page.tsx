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

const BASE_URL='http://localhost:4000'

export default function CourseForm() {
  const router = useRouter();
  const {user,token,loading}= useAuth();
  const params= useParams();
  const courseId=params.id as string;

  //states
  const [noteUrl, setNoteUrl]= useState("");
  const [videoUrl, setVideoUrl]= useState("");
  const [isUploading, setIsUploading]= useState(false);
  const [uploadProgress, setUploadProgress]= useState(0);

  useEffect(()=>{
    if(loading) return;

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
      toast.error("Please upload both the notes and the video.")
      return;
    }

    const data = {
      ...values,
      pdfUrl: noteUrl,
      videoUrl: videoUrl,
      courseId
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/lecture/create`, data,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      toast.success(res.data.message || "Lecture created successfully!");
      router.push(`/trainer/courses/${courseId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create lecture.";
      toast.error(errorMessage);
      console.error("Error while creating course:", error)
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const authRes = await fetch(`${BASE_URL}/api/imagekit/imagekit-auth`);
      const auth = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", "public_Mn4JpNN5SqQufk9nqa+bNgmdGNY=");
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire.toString()); 
      formData.append("token", auth.token);
      formData.append("folder", "/notes");

      const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.url) {
        setNoteUrl(data.url);
        toast.success("Notes uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
      console.log("Note data",data);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Notes upload failed.");
    }
  };

  const handleVideoUpload = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file= e.target.files?.[0];
    if(!file)return;

    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("API KEY",apiKey);
    console.log("Cloudname",cloudName);

    if (!apiKey || !cloudName || !uploadPreset) {
      toast.error("Cloudinary configuration is missing.");
      console.error("Cloudinary API Key or Cloud Name is not set in environment variables.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res= await axios.get(`${BASE_URL}/api/lecture/generate-upload-signature`);
    
      const {signature, timestamp}= res.data;
      console.log("signature",signature)
      console.log("timestamp",timestamp)

      const formData= new FormData();

      formData.append('file',file);
      formData.append('upload_preset', uploadPreset); 
     formData.append('cloud_name', cloudName); 
      formData.append('resource_type', 'video');

      const cloudinaryUrl= `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

      const uploadResponse = await axios.post(cloudinaryUrl, formData,{
        onUploadProgress:(progressEvent)=>{
          
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100)/ progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      })

      setVideoUrl(uploadResponse.data.secure_url);
      toast.success("Video uploaded successfully!");

    } catch (error) {
      console.error('Error uploading video',error);
      toast.error("Error while uploading video.");
    }
    finally{
      setIsUploading(false);
    }
  }


  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 shadow-2xl text-black">
      <h1 className="text-3xl font-bold mb-4">Create a lecture.</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-xl p-8 bg-white rounded-lg">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecture Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Introduction to Calculus" {...field} />
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
                  <Input placeholder="What will this lecture cover?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormItem>
            <FormLabel>Upload Notes (PDF)</FormLabel>
            <FormControl>
              <Input type="file" accept="application/pdf" onChange={handlePdfUpload} />
            </FormControl>
            {noteUrl && (
              <p className="text-sm text-green-600 mt-1">Notes uploaded successfully.</p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Upload Lecture Video</FormLabel>
            <FormControl>
              <Input type="file" accept="video/*" onChange={handleVideoUpload} disabled={isUploading}/>
            </FormControl>
            {isUploading && (
              <div className="mt-2">
                <p className="text-sm">Uploading... {uploadProgress}%</p>
                <progress className="w-full" value={uploadProgress} max="100"/>
              </div>
            )}
            {videoUrl && !isUploading && (
                <p className="text-sm text-green-600 mt-1">Video uploaded successfully.</p>
            )}
          </FormItem>
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Create Lecture'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

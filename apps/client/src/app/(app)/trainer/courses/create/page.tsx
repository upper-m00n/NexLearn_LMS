"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { courseSchema } from "@/lib/course"
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
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CourseForm() {
  const router = useRouter();
  const {user,token,loading}= useAuth();

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
  },[user,token,router,loading])
  

  const [thumbnailUrl, setThumbnailUrl] = useState("")

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price:0,
      category:""
    },
  })

  const onSubmit = async (values: z.infer<typeof courseSchema>) => {
    if (!thumbnailUrl) {
      toast.error("Please upload a thumbnail.")
      return
    }

    const data = {
      ...values,
      thumbnail: thumbnailUrl,
    }

    try {
      const createCourse = await axios.post("http://localhost:4000/api/course/create", data,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      toast.success("Course created successfully!")
      //console.log("Submitted Course:", data)
      router.push('/trainer/courses')
    } catch (error) {
      toast.error("Failed to create course")
      console.error("Error while creating course:", error)
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // 🔐 Get authentication params from backend
    const authRes = await fetch("http://localhost:4000/api/imagekit/imagekit-auth");
    const auth = await authRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", "public_Mn4JpNN5SqQufk9nqa+bNgmdGNY=");
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);
    formData.append("folder", "/thumbnails");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.url) {
      setThumbnailUrl(data.url);
      toast.success("Thumbnail uploaded!");
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    toast.error("Upload failed");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 shadow-2xl text-black">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-xl">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
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
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <Input placeholder="Write course description here." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Price</FormLabel>
                <FormControl>
                  <Input placeholder="set course price." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Select course category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select course category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="ITSoftware">IT & Software</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="FinanceAccounting">Finance & Accounting</SelectItem>
                    <SelectItem value="OfficeProductivity">Office & Productivity</SelectItem>
                    <SelectItem value="PersonalDevelopment">Personal Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="PhotographyVideo">Photography & Video</SelectItem>
                    <SelectItem value="HealthFitness">Health & Fitness</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="TeachingAcademics">Teaching & Academics</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )}
            />
          <FormItem>
            <FormLabel>Upload Thumbnail</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleThumbnailUpload} />
            </FormControl>
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="Thumbnail preview" className="mt-2 w-40 h-24 rounded object-cover" />
            )}
          </FormItem>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

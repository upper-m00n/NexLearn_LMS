'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import type { Course } from "@/types/course";
import { BASE_URL } from "@/axios/axios";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaRegHeart } from "react-icons/fa";
import { Lecture } from "@/types/Lecture";
import Lectures from "@/components/Lectures";

export default function Course (){
    const params= useParams();
    const courseId=params.id;

    const [course,setCourse]= useState<Course>({
        title:"",
        description:"",
        price:"",
        rating:"",
        createdAt:""
    });
    const [thumbnail, setThumbnailUrl]= useState('');

    const [lectures, setLectures]= useState<Lecture[]>([]);
    const [loadingLectures,setLoadingLectures]= useState(false);
    const [message,setMessage]= useState("");
    
    useEffect(()=>{
       
        const fetchCourse= async()=>{
            try {
                const res= await axios.get(`${BASE_URL}/api/course/get/${courseId}`);
                setCourse(res.data);
                console.log("course",res.data);
                setThumbnailUrl(res.data.thumbnail);
                toast.success("Course fetched successfully!");
            } catch (error) {
                console.log("Error while fetching course");
                toast.error("Unable to fetch course.");
            }
        }

        const fetchLectures=async()=>{
            try {
                setLoadingLectures(true);
                toast("Fetching Lectures")
                const res= await axios.get(`http://localhost:4000/api/lecture/get?courseId=${courseId}`)
                if(res.data?.lectures){
                setLectures(res.data.lectures);
                }
                setMessage(res.data.message);
                toast(message);
                
            } catch (error) {
                console.log("Error while fetching lectures",error);
                toast(message);
            }
            finally{
                setLoadingLectures(false);
            }
        }

        fetchCourse();
        fetchLectures();
    },[])


    return(
        <div className="font-sans min-h-screen flex flex-col">
            <div className="bg-black w-full p-6 flex flex-row">
                <div>
                    <h1 className="text-3xl text-white">{course.title}</h1>
                    <p className="text-2xl text-white">{course.description}</p>
                    {/*Ratingss*/}
                    <p className="text-white text-xl">{course.createdAt}</p>
                </div>
                <div className="w-fit h-max bg-white p-4 rounded-2xl">
                    <img src={thumbnail} alt="" className="overflow-hidden" />
                    <h2>Rs.{course.price}</h2>
                    <Button>Add to cart</Button>
                    <div className="flex flex-row w-full">
                        <Button>Buy now</Button>
                        <FaRegHeart className="text-2xl" />
                    </div>
                </div>
            </div>
            <div className="p-6">
               <div className="p-4">
                    <h2 className="text-2xl font-semibold">Course Description</h2>
                    <p>{course.description}</p>
               </div>
                <div className="p-4">
                    <h2 className="text-2xl font-semibold">Course Content</h2>
                    <Lectures lectures={lectures}/>
                </div>
            </div>
        </div>
    )
}
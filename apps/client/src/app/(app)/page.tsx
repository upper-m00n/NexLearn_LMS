"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/axios/axios";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { featuredImages, categories } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CourseCardForALL } from "@/components/CourseCardForALL";
import { CheckCircle, FileText, Wand2 } from "lucide-react";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const router=useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/course/`);
        setCourses(res.data);
        // We don't need a toast message on every page load
      } catch (error) {
        console.log("error while fetching courses", error);
        toast.error("Couldn't fetch courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-b-2xl shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Learn Anytime, Anywhere
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl mb-6">
          Explore top courses from expert trainers, now supercharged with AI to accelerate your learning journey.
        </p>
        <Link
          href="/courses"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
        >
          Browse Courses
        </Link>
      </section>

      <section className="w-full max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Supercharge Your Learning with AI
        </h2>
        <p className="text-gray-600 text-lg text-center mb-12">
          Our platform uses cutting-edge AI to create a more effective and engaging learning experience.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1: Transcripts & Summaries */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <FileText className="h-12 w-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Transcripts & Summaries</h3>
            <p className="text-gray-500">
              Never miss a detail. Get full transcripts for every lecture and concise AI-powered summaries to review key concepts in seconds.
            </p>
          </div>

          {/* Feature 2: AI Quizzes */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Generated Quizzes</h3>
            <p className="text-gray-500">
              Test your knowledge after any lecture with intelligent quizzes created on the fly. Reinforce your learning and track your progress effectively.
            </p>
          </div>

          {/* Feature 3: AI Thumbnails for Trainers */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <Wand2 className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">For Trainers: AI Thumbnails</h3>
            <p className="text-gray-500">
              Create stunning, relevant course thumbnails instantly. Just provide a title, and our AI will design a beautiful image so you can focus on content.
            </p>
          </div>
        </div>
      </section>
      

      {/* FEATURED SECTION (NOW WITH IMAGES) */}
      <section className="w-full max-w-5xl mx-auto mt-16 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Featured Topics
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            {featuredImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Card>
                    <CardContent className="relative flex aspect-video items-center justify-center p-0">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-black text-white" />
          <CarouselNext className="bg-black text-white"/>
        </Carousel>
      </section>

      

      {/* POPULAR COURSES SECTION */}
      <section className="w-full max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Popular Courses
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCardForALL key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full text-center py-20 mt-20 bg-gray-100 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start learning with us?
        </h2>
        <p className="text-gray-600 mb-6">
          Explore categories.
        </p>

        <div className="flex flex-wrap justify-center gap-5 p-4">
          {categories.map((category)=>(
            <Button className="text-2xl font-light p-6" onClick={()=>router.push(`/search/${category}`)}>{category}</Button>
          ))}
        </div>
       
      </section>
    </div>
  );
}
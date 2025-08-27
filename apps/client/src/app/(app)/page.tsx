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
import { CourseCard } from "@/components/CourseCard";
import Link from "next/link";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/course/`);
        setCourses(res.data);
        toast.success("Courses fetched successfully");
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
          Explore top courses from expert trainers and start your journey
          towards success today.
        </p>
        <Link
          href="/courses"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition"
        >
          Browse Courses
        </Link>
      </section>

     \
      <section className="w-full max-w-5xl mx-auto mt-16 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Featured Courses
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            {courses.slice(0, 5).map((course, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <CourseCard course={course} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

   
      <section className="w-full max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Popular Courses
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full text-center py-20 mt-20 bg-gray-100 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start learning with us?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of students and upskill yourself today.
        </p>
        <Link
          href="/signup"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}

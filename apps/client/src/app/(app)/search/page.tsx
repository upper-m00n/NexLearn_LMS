'use client'

import { BASE_URL } from "@/axios/axios";
import RatingsStarsForUnEnrolled from "@/components/RatingsStarsForUnEnrolled";
import { Course } from "@/types/course";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "@/components/ui/button";

// FIX 2: Correctly define props. The component now receives the course object and the router instance.
const CourseCard = ({ course, router }: { course: Course, router: AppRouterInstance }) => (
  <div 
    className="course-card border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
    
  >
    <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-md mb-4" />
    <div className="course-info">
      <h3 className="font-bold text-lg mb-1 truncate">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-2">By: {course.trainer?.username || 'N/A'}</p>
      <span className="category-badge bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
        {course.category}
      </span>
      {/* Ensure your Course type includes a 'rating' property */}
      <div className="mt-2">
        <RatingsStarsForUnEnrolled totalRating={parseFloat(course.rating as any || '0')} />
      </div>
      <Button className="mt-2 w-full"onClick={() => router.push(`/student/course/${course.id}`)}>View Course</Button>
    </div>
  </div>
);


export default function SearchPage() {

  const router = useRouter(); 
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
       
        const response = await axios.get(`${BASE_URL}/api/course/search?q=${query}`);
        
  
        setResults(response.data.courses || []);
        
      } catch (error) {
        console.error("Couldn't fetch results:", error);
        toast.error("Failed to get results!");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="p-8">
      <div className="flex flex-row items-baseline gap-2">
        <h1 className="font-bold text-2xl">Search Results for:</h1>
        <h1 className="text-2xl font-mono bg-gray-100 p-1 rounded">"{query}"</h1>
      </div>
      <div>
        {loading && <p className="text-center mt-8">Loading...</p>}
        {!loading && results.length === 0 && <p className="text-center mt-8">No results found.</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {results.map((course: Course) => (
            // Pass both the course and the router instance as props
            <CourseCard key={course.id} course={course} router={router} />
          ))}
        </div>
        
        {/* FIX 4: Wrap text in a valid JSX tag */}
        {!loading && (
          <p className="text-center text-gray-500 mt-8">
            Total Results: {results.length}
          </p>
        )}
      </div>
    </div>
  );
}
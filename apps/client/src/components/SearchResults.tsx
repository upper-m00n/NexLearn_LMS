'use client'

import { BASE_URL } from "@/axios/axios";
import RatingsStarsForUnEnrolled from "@/components/RatingsStarsForUnEnrolled";
import { Course } from "@/types/course";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchX } from "lucide-react";

// This is your original CourseCard, which is perfect here.
const CourseCard = ({ course }: { course: Course }) => {
    const router = useRouter();
    return (
        <div className="border p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-md mb-4" />
            <div className="flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-1 line-clamp-2 flex-grow">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">By: {course.trainer?.username || 'N/A'}</p>
                <div className="mt-2">
                    <RatingsStarsForUnEnrolled totalRating={course.rating ?? 0} />
                </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => router.push(`/student/course/${course.id}`)}>
                View Course
            </Button>
        </div>
    )
};

// This component contains all the client-side logic
export default function SearchResults() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If there's no query, don't search.
    if (!query) {
      setLoading(false);
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/course/search`, { params: { q: query } });
        setResults(response.data.courses || []);
      } catch (error) {
        console.error("Couldn't fetch results:", error);
        toast.error("Failed to get search results!");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Handle the case where there is no search query in the URL
  if (!query) {
      return (
          <div className="text-center py-20">
              <h1 className="text-2xl font-bold">Search for a course</h1>
              <p className="text-gray-500 mt-2">Enter a term in the search bar to find your next course.</p>
          </div>
      )
  }

  return (
    <div>
      <div className="flex flex-row items-baseline gap-2 mb-8">
        <h1 className="font-bold text-2xl">Search Results for:</h1>
        <h1 className="text-2xl font-mono bg-gray-100 p-2 rounded-lg">{query}</h1>
      </div>
      <div>
        {loading && <p className="text-center mt-8">Loading...</p>}
        
        {!loading && results.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center">
                <SearchX className="w-16 h-16 text-gray-400 mb-4"/>
                <h2 className="text-2xl font-semibold text-gray-700">No results found for &quot;{query}&quot;</h2>
                <p className="text-gray-500 mt-2">Try searching for something else or check your spelling.</p>
                <Button asChild className="mt-6">
                    <Link href="/courses">Browse All Courses</Link>
                </Button>
            </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((course: Course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

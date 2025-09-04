'use client'
import { BASE_URL } from "@/axios/axios";
import { CourseCardForALL } from "@/components/CourseCardForALL";
import { Course } from "@/types/course"; // It's good practice to use a specific type
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2 } from "lucide-react";


const COURSES_PER_PAGE = 6; // Define how many courses to show per page

export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // FIX: Fetch courses for the current page with a limit
        const res = await axios.get(`${BASE_URL}/api/course`, {
          params: {
            page: currentPage,
            limit: COURSES_PER_PAGE
          }
        });
        setCourses(res.data.courses);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.log("error while fetching courses", error);
        toast.error("Couldn't fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [currentPage]); // FIX: Re-run the effect when the current page changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Explore Our Courses</h1>
        <p className="mt-2 text-lg text-gray-600">Find your next learning adventure from our curated collection.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses
            .filter(course => course.id) // This line ensures course.id is not undefined
            .map((course:any) => (
              <CourseCardForALL key={course.id} course={course} />
            ))}
          </div>

          {/* --- Dynamic Pagination --- */}
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {/* Render page numbers dynamically */}
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">No Courses Found</h2>
            <p className="text-gray-500 mt-2">Check back later for new and exciting courses!</p>
        </div>
      )}
    </div>
  )
}
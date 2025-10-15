'use client'
import { BASE_URL } from "@/axios/axios";
import RatingsStarsForUnEnrolled from "@/components/RatingsStarsForUnEnrolled";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/types/course";
import axios from "axios";
import { AlertTriangle, BookOpen } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
      <div className="mt-2">
        <RatingsStarsForUnEnrolled totalRating={course.rating ?? 0} />
      </div>
      <Button className="mt-2 w-full"onClick={() => router.push(`/student/course/${course.id}`)}>View Course</Button>
    </div>
  </div>
);

const CourseCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-40 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const InfoMessage = ({ icon: Icon, title, message }: { icon: React.ElementType, title: string, message: string }) => (
  <div className="mt-16 flex flex-col items-center justify-center text-center">
    <Icon className="h-12 w-12 text-gray-400" />
    <h2 className="mt-4 text-xl font-semibold text-gray-800">{title}</h2>
    <p className="mt-2 text-gray-500">{message}</p>
  </div>
);

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    if (!category) return;

    const fetchCoursesByCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/api/course/getCourseByCategory/${category}`);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching courses by category:", err);
        setError("We couldn't load courses for this category. Please try again later.");
        toast.error("Couldn't fetch courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursesByCategory();
  }, [category]); 

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
         
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return <InfoMessage icon={AlertTriangle} title="Something Went Wrong" message={error} />;
    }

    if (courses.length === 0) {
      return <InfoMessage icon={BookOpen} title="No Courses Found" message="There are currently no courses available in this category." />;
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} router={router} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 border-b pb-4">
        <p className="text-sm text-gray-500">Browsing Category</p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{category}</h1>
      </div>

      {renderContent()}
    </main>
  );
}
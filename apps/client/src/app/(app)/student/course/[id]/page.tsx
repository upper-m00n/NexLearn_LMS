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
import { useAuth } from "@/context/AuthContext";
import RatingsStarsForUnEnrolled from "@/components/RatingsStarsForUnEnrolled";

export default function Course() {
  const {user,token}= useAuth();
  const params = useParams();
  const courseId = params.id;

  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    price: 0,
    rating: "",
    createdAt: "",
    id:"",
    category:"",
  });
  const [thumbnail, setThumbnailUrl] = useState('');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [message, setMessage] = useState("");
  const [cartMessage,setCartMessage]=useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/course/get/${courseId}`);
        setCourse(res.data);
        setThumbnailUrl(res.data.thumbnail);
        toast.success("Course fetched successfully!");
      } catch (error) {
        toast.error("Unable to fetch course.");
      }
    };

    const fetchLectures = async () => {
      try {
        setLoadingLectures(true);
        const res = await axios.get(`${BASE_URL}/api/lecture/get?courseId=${courseId}`);
        if (res.data?.lectures) {
          setLectures(res.data.lectures);
        }
        setMessage(res.data.message);
      } catch (error) {
        toast.error("Unable to fetch lectures.");
      } finally {
        setLoadingLectures(false);
      }
    };

    fetchCourse();
    fetchLectures();
  }, []);

  const handleAddToCart= async()=>{
    try {
      console.log("user",user)
      const courseId=course.id;
      const studentId=user?.id as string

      const res= await axios.post(`${BASE_URL}/api/cart/add`,{courseId,studentId});
      setCartMessage(res.data.message);
      toast.success("Item added to cart successfully.")

    } catch (error) {
      console.log('error while adding to cart',error);
      toast.error(cartMessage);
    }
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-black text-white py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side - Course Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="text-lg opacity-90">{course.description}</p>
            <p className="text-sm opacity-70">Published on {new Date(course.createdAt).toDateString()}</p>
            <p>Language : English</p>
            <p>Category : {course.category}</p>
            <div>
                <h2>Ratings:</h2>
                <RatingsStarsForUnEnrolled totalRating={parseFloat(course.rating)}/>
            </div>
          </div>

          {/* Right Side - Purchase Card */}
          <div className="bg-white  shadow-lg p-4 flex flex-col gap-4">
            <img
              src={thumbnail}
              alt="Course Thumbnail"
              className="rounded-lg object-cover w-full h-48"
            />
            <h2 className="text-2xl font-semibold text-black">Subscribe for ₹{course.price}</h2>
            <Button className="w-full bg-black hover:bg-purple-700 text-white " onClick={handleAddToCart}>
              Add to cart
            </Button>
            <div className="flex items-center justify-between gap-2">
              <Button className="flex-1 bg-black hover:bg-green-700 text-white ">
                Buy now
              </Button>
              <button className="p-3 border border-gray-300 hover:bg-gray-100">
                <FaRegHeart className="text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Body */}
      <div className="max-w-6xl mx-auto py-10 px-6 md:px-12 flex flex-col gap-8">
        {/* Description */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Course Description</h2>
          <p className="text-gray-700 leading-relaxed">{course.description}</p>
        </section>

        {/* Lectures */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Course Content</h2>
          {loadingLectures ? (
            <p className="text-gray-500">Loading lectures...</p>
          ) : (
            <Lectures lectures={lectures} />
          )}
        </section>

        {/* Related Topics */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Explore Related Topics</h2>
          <p className="text-gray-600">Coming soon...</p>
        </section>
      </div>
    </div>
  );
}

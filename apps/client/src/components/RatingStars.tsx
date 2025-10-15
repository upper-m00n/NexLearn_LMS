"use client";

import { BASE_URL } from '@/axios/axios';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'sonner';
import { ca } from 'zod/v4/locales';

type course = {
    courseId: string;
}

export function StarRating({ courseId}: course) {
    const {user}=useAuth();
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const totalStars = 5;

    useEffect(()=>{
        const fetchRatingByStudent = async () => {
            try {
                if(!user?.id) return;

                const res = await axios.post(`${BASE_URL}/api/ratings/ratingByStudent/${courseId}`, {
                    studentId: user?.id
                });

                console.log("Rating by student response:", res.data);
                setRating(res.data?.rating || 0);

                if(res.data?.hasRated){
                    return(
                        <button
                            type="button"
                            className="cursor-pointer"
                            value={res.data?.rating}
                        >
                            <FaStar
                                size={30}
                                className={`transition-colors ${
                                    res.data?.rating <= (hover || rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    )
                }

            }
            catch (error) {
                console.log("Error while fetching course rating by student", error);
            }
        }

        fetchRatingByStudent();
    })

    const handleRating = async (currentRating: number) => {
        setRating(currentRating); // Update UI immediately for better UX

        try {
            const res = await axios.put(
                `${BASE_URL}/api/ratings/setCourseRating/${courseId}`,
                { value: currentRating,
                    studentId:user?.id
                 }
            );

            toast.success("Your rating has been submitted");
        } catch (error) {
            console.log("Error while updating course rating", error);
            toast.error("Couldn't update course rating.");
        }
    }

    return (
        <div>
            <div className="flex items-center space-x-1">
                {[...Array(totalStars)].map((_, index) => {
                    const currentRatingValue = index + 1;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleRating(currentRatingValue)}
                            onMouseEnter={() => setHover(currentRatingValue)}
                            onMouseLeave={() => setHover(null)}
                            className="cursor-pointer"
                        >
                            <FaStar
                                size={30}
                                className={`transition-colors ${
                                    currentRatingValue <= (hover || rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
            <p className="mt-2 text-sm text-gray-600">
                Your rating: {rating > 0 ? `${rating} of ${totalStars}` : 'None'}
            </p>
        </div>
    );
}
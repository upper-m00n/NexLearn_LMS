// components/RatingsStarsForUnEnrolled.tsx

import { FaStar } from "react-icons/fa";

type CourseInfo = {
    totalRating: number;
}

const RatingsStarsForUnEnrolled = ({ totalRating }: CourseInfo) => {
    const totalStars = 5;

    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <FaStar
                        key={index}
                        size={24}
                        // Determine color based on the totalRating prop
                        className={
                            starValue <= totalRating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                        }
                    />
                );
            })}
        </div>
    );
}

export default RatingsStarsForUnEnrolled;
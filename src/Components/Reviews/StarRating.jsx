import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({
  rating,
  setRating,
  readonly = false,
  size = "text-2xl",
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`${
              readonly ? "cursor-default" : "cursor-pointer"
            } transition-colors`}
            onClick={() => !readonly && setRating(ratingValue)}
            onMouseEnter={() => !readonly && setHover(ratingValue)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
          >
            <FaStar
              className={`${size} ${
                ratingValue <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

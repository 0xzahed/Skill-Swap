import { FaThumbsUp, FaUser } from "react-icons/fa";
import StarRating from "./StarRating";
import { formatDistanceToNow } from "date-fns";

const ReviewCard = ({ review, onHelpful }) => {
  const {
    userName = "Anonymous",
    userPhoto,
    rating,
    comment,
    createdAt,
    helpful = 0,
    isHelpfulByUser = false,
  } = review;

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Recently";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="shrink-0">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#422AD5] flex items-center justify-center text-white">
              <FaUser />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{userName}</h4>
              <p className="text-sm text-gray-500">{timeAgo}</p>
            </div>
            <StarRating
              rating={rating}
              setRating={() => {}}
              readonly
              size="text-lg"
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">{comment}</p>

          {/* Helpful Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onHelpful && onHelpful(review.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                isHelpfulByUser
                  ? "bg-[#422AD5] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FaThumbsUp className="text-xs" />
              Helpful ({helpful})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

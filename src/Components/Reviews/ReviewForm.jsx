import { useState, use } from "react";
import StarRating from "./StarRating";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";

const ReviewForm = ({ skillId, skillName, onReviewSubmit }) => {
  const { user } = use(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (replace with actual backend call)
    const review = {
      id: Date.now(),
      skillId,
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL,
      rating,
      comment,
      createdAt: new Date(),
      helpful: 0,
    };

    setTimeout(() => {
      console.log("Review submitted:", review);
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setIsSubmitting(false);

      if (onReviewSubmit) {
        onReviewSubmit(review);
      }
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Write a Review for {skillName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#422AD5] focus:border-transparent resize-none"
            placeholder="Share your experience with this skill..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-[#422AD5] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3a1fb8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FaPaperPlane />
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

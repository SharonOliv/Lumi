import { type FormEvent, useEffect, useState } from "react";
import { FiStar, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addReviewThunk, deleteReviewThunk, fetchReviewsThunk } from "../../store/slices/reviewsSlice";
import "./ReviewSection.css";

interface ReviewSectionProps {
  itemId: string;
  type: "movie" | "tvshow";
}

const ReviewSection = ({ itemId, type }: ReviewSectionProps) => {
  const dispatch = useAppDispatch();
  const { items: allReviews, loading } = useAppSelector((state) => state.reviews);
  const { username, role } = useAppSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!loading && allReviews.length === 0) {
      dispatch(fetchReviewsThunk());
    }
  }, [dispatch, loading, allReviews.length]);

  const reviews = allReviews
    .filter((r) => r.itemId === itemId && r.type === type)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const myExistingReview = reviews.find((r) => r.username === username);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !text.trim()) return;
    await dispatch(
      addReviewThunk({
        itemId,
        type,
        username,
        rating,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      })
    );
    setText("");
    setRating(5);
  };

  return (
    <div className="review-section">
      <h2>Reviews</h2>

      {!myExistingReview && (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="review-form-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`review-star ${star <= rating ? "is-filled" : ""}`}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <FiStar />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your thoughts…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit" className="btn-pill btn-pill-active">
            Post review
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="review-empty">No reviews yet — be the first to write one.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => {
            const canDelete = review.username === username || role === "admin";
            return (
              <li className="review-item" key={review.id}>
                <div className="review-item-header">
                  <span className="review-item-author">{review.username}</span>
                  <span className="review-item-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FiStar key={i} className={i < review.rating ? "is-filled" : ""} />
                    ))}
                  </span>
                  {canDelete && (
                    <button
                      type="button"
                      className="review-item-delete"
                      onClick={() => dispatch(deleteReviewThunk(review.id))}
                      aria-label="Delete this review"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <p className="review-item-text">{review.text}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReviewSection;

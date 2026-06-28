import { describe, expect, it } from "vitest";
import reviewsReducer, { addReviewThunk, deleteReviewThunk, fetchReviewsThunk } from "../slices/reviewsSlice";
import type { Review } from "../../types";

const review: Review = {
  id: "r1",
  itemId: "3",
  type: "movie",
  username: "Sharon",
  rating: 5,
  text: "Great movie.",
  createdAt: "2026-05-02T10:15:00.000Z",
};

describe("reviewsSlice", () => {
  const initialState = { items: [], loading: false, error: null };

  it("stores reviews on a successful fetch", () => {
    const state = reviewsReducer(initialState, fetchReviewsThunk.fulfilled([review], "requestId"));
    expect(state.items).toEqual([review]);
  });

  it("appends a review when add succeeds", () => {
    const state = reviewsReducer(
      initialState,
      addReviewThunk.fulfilled(review, "requestId", {
        itemId: review.itemId,
        type: review.type,
        username: review.username,
        rating: review.rating,
        text: review.text,
        createdAt: review.createdAt,
      })
    );
    expect(state.items).toEqual([review]);
  });

  it("removes the matching review when delete succeeds", () => {
    const state = reviewsReducer(
      { ...initialState, items: [review] },
      deleteReviewThunk.fulfilled("r1", "requestId", "r1")
    );
    expect(state.items).toEqual([]);
  });
});

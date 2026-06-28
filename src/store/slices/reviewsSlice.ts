import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../utils/api";
import type { NewReview, Review } from "../../types";

interface ReviewsState {
  items: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchReviewsThunk = createAsyncThunk("reviews/fetchAll", async () => {
  return api.fetchReviews();
});

export const addReviewThunk = createAsyncThunk("reviews/add", async (review: NewReview) => {
  return api.addReview(review);
});

export const deleteReviewThunk = createAsyncThunk("reviews/delete", async (id: string) => {
  return api.deleteReview(id);
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch reviews.";
      })
      .addCase(addReviewThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default reviewsSlice.reducer;

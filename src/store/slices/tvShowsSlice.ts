import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { NewTvShow, TvShow } from "../../types";
import * as api from "../../utils/api";

interface TvShowsState {
  items: TvShow[];
  loading: boolean;
  error: string | null;
}

const initialState: TvShowsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTvShowsThunk = createAsyncThunk("tvShows/fetchAll", async () => {
  return api.fetchTvShows();
});

export const addTvShowThunk = createAsyncThunk("tvShows/add", async (show: NewTvShow) => {
  return api.addTvShow(show);
});

export const updateTvShowThunk = createAsyncThunk(
  "tvShows/update",
  async ({ id, show }: { id: string; show: NewTvShow }) => {
    return api.updateTvShow(id, show);
  }
);

export const deleteTvShowThunk = createAsyncThunk("tvShows/delete", async (id: string) => {
  return api.deleteTvShow(id);
});

const tvShowsSlice = createSlice({
  name: "tvShows",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTvShowsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTvShowsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTvShowsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch TV shows.";
      })
      .addCase(addTvShowThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTvShowThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTvShowThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export default tvShowsSlice.reducer;

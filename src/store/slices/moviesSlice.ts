import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Movie, NewMovie } from "../../types";
import * as api from "../../utils/api";

interface MoviesState {
  items: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMoviesThunk = createAsyncThunk("movies/fetchAll", async () => {
  return api.fetchMovies();
});

export const addMovieThunk = createAsyncThunk("movies/add", async (movie: NewMovie) => {
  return api.addMovie(movie);
});

export const updateMovieThunk = createAsyncThunk(
  "movies/update",
  async ({ id, movie }: { id: string; movie: NewMovie }) => {
    return api.updateMovie(id, movie);
  }
);

export const deleteMovieThunk = createAsyncThunk("movies/delete", async (id: string) => {
  return api.deleteMovie(id);
});

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch movies.";
      })
      .addCase(addMovieThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMovieThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteMovieThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export default moviesSlice.reducer;

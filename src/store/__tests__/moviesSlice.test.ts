import { describe, expect, it } from "vitest";
import moviesReducer, {
  addMovieThunk,
  deleteMovieThunk,
  fetchMoviesThunk,
  updateMovieThunk,
} from "../slices/moviesSlice";
import type { Movie } from "../../types";

const sampleMovie: Movie = {
  id: "1",
  name: "Inception",
  rating: 8.8,
  description: "A skilled thief leads a team into dreams to steal secrets.",
  poster: "poster-url",
  genre: "Sci-Fi",
  language: "English",
};

describe("moviesSlice", () => {
  const initialState = { items: [], loading: false, error: null };

  it("returns the initial state", () => {
    expect(moviesReducer(undefined, { type: "@@init" })).toEqual(initialState);
  });

  it("sets loading=true while fetching", () => {
    const state = moviesReducer(initialState, fetchMoviesThunk.pending("requestId"));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores movies on a successful fetch", () => {
    const state = moviesReducer(
      { ...initialState, loading: true },
      fetchMoviesThunk.fulfilled([sampleMovie], "requestId")
    );
    expect(state.loading).toBe(false);
    expect(state.items).toEqual([sampleMovie]);
  });

  it("records an error message when the fetch fails", () => {
    const action = fetchMoviesThunk.rejected(new Error("Network error"), "requestId");
    const state = moviesReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Network error");
  });

  it("appends a movie when add succeeds", () => {
    const state = moviesReducer(initialState, addMovieThunk.fulfilled(sampleMovie, "requestId", {
      name: sampleMovie.name,
      poster: sampleMovie.poster,
      rating: sampleMovie.rating,
      description: sampleMovie.description,
      genre: sampleMovie.genre,
      language: sampleMovie.language,
    }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleMovie);
  });

  it("replaces the matching movie when update succeeds", () => {
    const updated: Movie = { ...sampleMovie, name: "Inception (Updated)" };
    const state = moviesReducer(
      { ...initialState, items: [sampleMovie] },
      updateMovieThunk.fulfilled(updated, "requestId", { id: "1", movie: updated })
    );
    expect(state.items[0].name).toBe("Inception (Updated)");
  });

  it("removes the matching movie when delete succeeds", () => {
    const state = moviesReducer(
      { ...initialState, items: [sampleMovie] },
      deleteMovieThunk.fulfilled("1", "requestId", "1")
    );
    expect(state.items).toEqual([]);
  });
});

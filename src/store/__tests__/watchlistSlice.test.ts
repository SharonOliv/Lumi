import { describe, expect, it } from "vitest";
import watchlistReducer, {
  addToWatchlistThunk,
  fetchWatchlistThunk,
  removeFromWatchlistThunk,
} from "../slices/watchlistSlice";
import type { Favourite } from "../../types";

const sampleFavourite: Favourite = {
  id: "f1",
  itemId: "3",
  type: "movie",
  name: "The Dark Knight",
  rating: 9,
  description: "Batman faces his greatest enemy.",
  poster: "poster-url",
  genre: "Action",
  language: "English",
};

describe("watchlistSlice", () => {
  const initialState = { items: [], loading: false, error: null };

  it("returns the initial state", () => {
    expect(watchlistReducer(undefined, { type: "@@init" })).toEqual(initialState);
  });

  it("stores favourites on a successful fetch", () => {
    const state = watchlistReducer(initialState, fetchWatchlistThunk.fulfilled([sampleFavourite], "requestId"));
    expect(state.items).toEqual([sampleFavourite]);
    expect(state.loading).toBe(false);
  });

  it("appends a favourite when add succeeds", () => {
    const state = watchlistReducer(
      initialState,
      addToWatchlistThunk.fulfilled(sampleFavourite, "requestId", {
        itemId: sampleFavourite.itemId,
        type: sampleFavourite.type,
        name: sampleFavourite.name,
        poster: sampleFavourite.poster,
        rating: sampleFavourite.rating,
        description: sampleFavourite.description,
        genre: sampleFavourite.genre,
        language: sampleFavourite.language,
      })
    );
    expect(state.items).toEqual([sampleFavourite]);
  });

  it("removes the matching favourite by its own id when remove succeeds", () => {
    const state = watchlistReducer(
      { ...initialState, items: [sampleFavourite] },
      removeFromWatchlistThunk.fulfilled("f1", "requestId", "f1")
    );
    expect(state.items).toEqual([]);
  });
});

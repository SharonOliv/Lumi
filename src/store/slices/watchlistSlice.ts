import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Favourite, NewFavourite } from "../../types";
import * as api from "../../utils/api";

interface WatchlistState {
  items: Favourite[];
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWatchlistThunk = createAsyncThunk("watchlist/fetchAll", async () => {
  return api.fetchFavourites();
});

export const addToWatchlistThunk = createAsyncThunk(
  "watchlist/add",
  async (favourite: NewFavourite) => {
    return api.addFavourite(favourite);
  }
);

export const removeFromWatchlistThunk = createAsyncThunk(
  "watchlist/remove",
  async (id: string) => {
    return api.removeFavourite(id);
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatchlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch My List.";
      })
      .addCase(addToWatchlistThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWatchlistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;

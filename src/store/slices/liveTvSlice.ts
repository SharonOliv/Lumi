import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Channel, NewChannel } from "../../types";
import * as api from "../../utils/api";

interface LiveTvState {
  items: Channel[];
  loading: boolean;
  error: string | null;
}

const initialState: LiveTvState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchChannelsThunk = createAsyncThunk("liveTv/fetchAll", async () => {
  return api.fetchChannels();
});

export const addChannelThunk = createAsyncThunk("liveTv/add", async (channel: NewChannel) => {
  return api.addChannel(channel);
});

export const updateChannelThunk = createAsyncThunk(
  "liveTv/update",
  async ({ id, channel }: { id: string; channel: NewChannel }) => {
    return api.updateChannel(id, channel);
  }
);

export const deleteChannelThunk = createAsyncThunk("liveTv/delete", async (id: string) => {
  return api.deleteChannel(id);
});

const liveTvSlice = createSlice({
  name: "liveTv",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchChannelsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch live TV channels.";
      })
      .addCase(addChannelThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateChannelThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteChannelThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default liveTvSlice.reducer;

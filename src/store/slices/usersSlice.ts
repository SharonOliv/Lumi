import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../utils/api";
import type { Role, User } from "../../types";

interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchUsersThunk = createAsyncThunk("users/fetchAll", async () => {
  return api.fetchUsers();
});

export const updateUserRoleThunk = createAsyncThunk(
  "users/updateRole",
  async ({ id, role }: { id: string; role: Role }) => {
    return api.updateUserRole(id, role);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users.";
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default usersSlice.reducer;

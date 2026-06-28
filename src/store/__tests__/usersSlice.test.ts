import { describe, expect, it } from "vitest";
import usersReducer, { fetchUsersThunk, updateUserRoleThunk } from "../slices/usersSlice";
import type { User } from "../../types";

const viewer: User = { id: "1", username: "Sharon", password: "x", role: "viewer" };
const admin: User = { id: "2", username: "Admin", password: "x", role: "admin" };

describe("usersSlice", () => {
  const initialState = { items: [], loading: false, error: null };

  it("stores users on a successful fetch", () => {
    const state = usersReducer(initialState, fetchUsersThunk.fulfilled([viewer, admin], "requestId"));
    expect(state.items).toEqual([viewer, admin]);
  });

  it("updates the matching user's role when promotion succeeds", () => {
    const promoted: User = { ...viewer, role: "admin" };
    const state = usersReducer(
      { ...initialState, items: [viewer, admin] },
      updateUserRoleThunk.fulfilled(promoted, "requestId", { id: "1", role: "admin" })
    );
    expect(state.items.find((u) => u.id === "1")?.role).toBe("admin");
  });
});

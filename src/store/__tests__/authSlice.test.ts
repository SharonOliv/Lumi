import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../utils/api";
import authReducer, { login, logout, register } from "../slices/authSlice";

vi.mock("../../utils/api");

const buildStore = () => configureStore({ reducer: { auth: authReducer } });

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("logs in successfully and stores the user's role", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { id: "1", username: "Sharon", password: "sharon123", role: "viewer" },
    ]);

    const store = buildStore();
    await store.dispatch(login({ username: "Sharon", password: "sharon123" }));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.username).toBe("Sharon");
    expect(state.role).toBe("viewer");
    expect(JSON.parse(localStorage.getItem("lumi_auth") ?? "{}")).toEqual({
      username: "Sharon",
      role: "viewer",
    });
  });

  it("rejects with an error message when credentials don't match", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { id: "1", username: "Sharon", password: "sharon123", role: "viewer" },
    ]);

    const store = buildStore();
    await store.dispatch(login({ username: "Sharon", password: "wrong-password" }));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe("Invalid username or password");
  });

  it("registers a new user as a Viewer, never as Admin", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { id: "1", username: "Sharon", password: "sharon123", role: "viewer" },
    ]);
    vi.spyOn(api, "registerUser").mockResolvedValue({
      id: "2",
      username: "NewPerson",
      password: "secret1",
      role: "viewer",
    });

    const store = buildStore();
    await store.dispatch(register({ username: "NewPerson", password: "secret1" }));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe("viewer");
    expect(api.registerUser).toHaveBeenCalledWith("NewPerson", "secret1");
  });

  it("rejects registration when the username is already taken", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { id: "1", username: "Sharon", password: "sharon123", role: "viewer" },
    ]);
    const registerSpy = vi.spyOn(api, "registerUser");

    const store = buildStore();
    await store.dispatch(register({ username: "Sharon", password: "whatever1" }));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe("That username is already taken");
    expect(registerSpy).not.toHaveBeenCalled();
  });

  it("logs out and clears localStorage", () => {
    localStorage.setItem("lumi_auth", JSON.stringify({ username: "Sharon", role: "viewer" }));
    const state = authReducer(
      { username: "Sharon", role: "viewer", isAuthenticated: true, loading: false, error: null },
      logout()
    );
    expect(state.isAuthenticated).toBe(false);
    expect(state.username).toBeNull();
    expect(state.role).toBeNull();
    expect(localStorage.getItem("lumi_auth")).toBeNull();
  });
});

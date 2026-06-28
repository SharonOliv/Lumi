import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import * as api from "../../utils/api";
import authReducer from "../../store/slices/authSlice";
import Login from "../Login";

vi.mock("../../utils/api");

const renderLogin = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );
};

describe("Login", () => {
  it("renders the username and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows an error message for invalid credentials", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { id: "1", username: "Sharon", password: "sharon123", role: "viewer" },
    ]);
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/username/i), "Sharon");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid username or password");
    });
  });
});

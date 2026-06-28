import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import authReducer from "../../store/slices/authSlice";
import ProtectedRoute from "../ProtectedRoute";
import type { Role } from "../../types";

const renderWithAuth = (isAuthenticated: boolean) => {
  const role: Role | null = isAuthenticated ? "viewer" : null;
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated,
        username: isAuthenticated ? "Sharon" : null,
        role,
        loading: false,
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<div>Home Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("ProtectedRoute", () => {
  it("redirects to /login when the user is not authenticated", () => {
    renderWithAuth(false);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
  });

  it("renders the protected page when the user is authenticated", () => {
    renderWithAuth(true);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});

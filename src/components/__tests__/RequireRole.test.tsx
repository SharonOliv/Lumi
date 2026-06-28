import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import authReducer from "../../store/slices/authSlice";
import RequireRole from "../RequireRole";
import type { Role } from "../../types";

const renderWithRole = (role: Role | null) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { isAuthenticated: true, username: "Someone", role, loading: false, error: null },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/admin/users"]}>
        <Routes>
          <Route path="/home" element={<div>Home Page</div>} />
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/users" element={<div>Manage Users Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("RequireRole", () => {
  it("redirects a Viewer away from an admin-only route", () => {
    renderWithRole("viewer");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Manage Users Page")).not.toBeInTheDocument();
  });

  it("renders the admin-only route for an Admin", () => {
    renderWithRole("admin");
    expect(screen.getByText("Manage Users Page")).toBeInTheDocument();
  });
});

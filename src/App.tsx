import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireRole from "./components/RequireRole";
import { useAppSelector } from "./store/hooks";

// Route-based code splitting: each page is only downloaded when the user
// actually navigates to it, instead of bundling everything into one chunk.
const Home = lazy(() => import("./components/Home"));
const Movies = lazy(() => import("./components/Movies"));
const Livetv = lazy(() => import("./components/Livetv"));
const Tvshows = lazy(() => import("./components/Tvshows"));
const TitleDetail = lazy(() => import("./components/TitleDetail"));
const SearchResults = lazy(() => import("./components/SearchResults"));
const MyList = lazy(() => import("./components/MyList"));
const ManageUsers = lazy(() => import("./components/ManageUsers"));
const Login = lazy(() => import("./components/Login"));
const SignUp = lazy(() => import("./components/SignUp"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/forgot-password"];
  return !hideNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};

const PageFallback = () => (
  <div className="page-loading" role="status">
    Loading…
  </div>
);

// Applies the chosen theme to the document so CSS like
// `:root[data-theme="light"]` in index.css can take over.
const ThemeEffect = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeEffect />
      <ConditionalNavbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Everything below requires being logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<TitleDetail type="movie" />} />
            <Route path="/livetv" element={<Livetv />} />
            <Route path="/tvshows" element={<Tvshows />} />
            <Route path="/tvshows/:id" element={<TitleDetail type="tvshow" />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/my-list" element={<MyList />} />

            {/* Admin-only, nested one level deeper than plain auth */}
            <Route element={<RequireRole role="admin" />}>
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

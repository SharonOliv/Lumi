import { useEffect, useState } from "react";
import { FiBookmark, FiLogOut, FiMoon, FiSearch, FiShield, FiSun, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import LumiMark from "./shared/LumiMark";
import "../styles/badges.css";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, username, role } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.theme.mode);
  const isAdmin = role === "admin";

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`, { replace: true });
    }
  }, [debouncedSearch, navigate]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <LumiMark size={30} className="navbar-logo" />
          <span className="navbar-wordmark">Lumi</span>
        </Link>

        {/* This toggler + matching id is what actually makes the navbar
            collapse into a hamburger menu on mobile (it was missing before,
            so the nav links overflowed on small screens). */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/movies">
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/livetv">
                Live TV
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tvshows">
                TV Shows
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-list">
                <FiBookmark /> My List
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/users">
                  <FiShield /> Manage Users
                </Link>
              </li>
            )}
          </ul>

          <form className="navbar-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <FiSearch className="navbar-search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search movies, shows, channels…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search"
            />
          </form>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-username">
                <FiUser /> {username}
                <span className={`role-badge role-badge-${role}`}>{role}</span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleSignOut}>
                <FiLogOut /> Sign out
              </button>
            </div>
          ) : (
            <Link className="btn btn-outline-light" to="/login">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

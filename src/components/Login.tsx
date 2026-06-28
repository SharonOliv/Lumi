import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/slices/authSlice";
import LumiMark from "./shared/LumiMark";
import "../styles/auth-card.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-brand">
          <LumiMark size={28} />
          <span className="auth-card-brand-wordmark">Lumi</span>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-card-subtitle">Sign in to keep watching.</p>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-auth mb-3" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="text-center">
            <a
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Forgot password?
            </a>
          </div>
        </form>

        <p className="auth-footer">
          New to Lumi?{" "}
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { register } from "../store/slices/authSlice";
import LumiMark from "./shared/LumiMark";
import "../styles/auth-card.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (username.trim().length < 3) {
      setFormError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }

    const result = await dispatch(register({ username: username.trim(), password }));
    if (register.fulfilled.match(result)) {
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
        <h1>Create your account</h1>
        <p className="auth-card-subtitle">New accounts join as a Viewer — browse, save, and review.</p>

        {(formError || error) && (
          <div className="auth-alert" role="alert">
            {formError ?? error}
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
              placeholder="Choose a username"
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-auth mb-3" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

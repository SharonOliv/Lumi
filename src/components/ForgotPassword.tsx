import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import LumiMark from "./shared/LumiMark";
import "../styles/auth-card.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setSent(false);
      setMessage("Please enter your email address.");
      return;
    }
    setSent(true);
    setMessage(`A password reset link has been sent to ${email}.`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-brand">
          <LumiMark size={28} />
          <span className="auth-card-brand-wordmark">Lumi</span>
        </div>
        <h1>Forgot password</h1>
        <p className="auth-card-subtitle">We&apos;ll send a reset link to your email.</p>

        {message && (
          <div className={sent ? "auth-success" : "auth-alert"} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-auth mb-3">
            Reset password
          </button>
          <button type="button" className="btn-auth btn-auth-secondary" onClick={() => navigate("/login")}>
            Back to sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

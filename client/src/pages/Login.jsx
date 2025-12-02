// client/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/form.css";
import "../styles/arrival.css";
import { createOrder } from "../api/orders";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("whwUser");
      if (storedUser) {
        navigate("/");
        return;
      }
    } catch {}
    finally {
      setCheckingUser(false);
    }
  }, [navigate]);

  if (checkingUser) {
    return (
      <section className="arrival-layout">
        <div className="arrival-form-col">
          <p className="arrival-muted">Checking your sign-in status…</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let message = "Login failed. Please check your credentials.";
        try {
          const data = await res.json();
          if (data?.message) message = data.message;
        } catch {}
        throw new Error(message);
      }

      const user = await res.json();
      localStorage.setItem("whwUser", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="arrival-layout">
      <div className="arrival-form-col">
        <form onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <p className="arrival-muted">Log in to manage your Welcome Orders.</p>

          <label className="arrival-label">
            Email
            <input
              type="email"
              required
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="arrival-label">
            Password
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-eye"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="arrival-muted">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create one here.</Link>
          </p>

          <button
            type="button"
            className="arrival-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to home
          </button>
        </form>
      </div>

      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Why sign in?</h3>
          <p className="arrival-muted">
            Signing in will let you save preferences and view past orders.
          </p>
        </div>
      </div>
    </section>
  );
}

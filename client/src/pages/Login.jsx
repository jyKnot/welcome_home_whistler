// client/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/form.css";
import "../styles/arrival.css"; // re-use card + layout styles

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important so cookie is set
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // try to read a message from the server if available
        let message = "Login failed. Please check your credentials.";
        try {
          const data = await res.json();
          if (data?.message) message = data.message;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      const user = await res.json();

      // Store basic user info locally for now (optional)
      localStorage.setItem("whwUser", JSON.stringify(user));

      // Navigate to home or groceries after login
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
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
          <p className="arrival-muted">
            Log in to manage your Welcome Orders and arrival details.
          </p>

          <label className="arrival-label">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="arrival-label">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="error" style={{ marginTop: "0.5rem" }}>{error}</p>}

          <button type="submit" disabled={submitting} style={{ marginTop: "1rem" }}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="arrival-muted" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
            Don&apos;t have an account yet? (Frontend registration coming soon — you can
            create a user via the API or Compass for now.)
          </p>

          <button
            type="button"
            className="arrival-back-btn"
            onClick={() => navigate("/")}
            style={{ marginTop: "1rem" }}
          >
            ← Back to home
          </button>
        </form>
      </div>

      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Why sign in?</h3>
          <p className="arrival-muted">
            In the full version of Welcome Home Whistler, signing in will let you:
          </p>
          <ul className="arrival-items">
            <li className="arrival-item">
              <div className="arrival-item-name">Save your property details</div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">Re-use past Welcome Orders</div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">See upcoming arrivals at a glance</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

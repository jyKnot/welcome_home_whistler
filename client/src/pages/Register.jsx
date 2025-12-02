// client/src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/form.css";
import "../styles/arrival.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // NEW: redirect if already logged in
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("whwUser");
      if (storedUser) {
        // Already signed in → send to My Orders
        navigate("/my-orders");
        return;
      }
    } catch (err) {
      console.error("Error reading whwUser from localStorage:", err);
    } finally {
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
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // so JWT cookie is set
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        let message = "Registration failed. Please check your details.";
        try {
          const data = await res.json();
          if (data?.message) message = data.message;
        } catch {
          // ignore JSON parse issues
        }
        throw new Error(message);
      }

      const user = await res.json();

      // Save user locally so the app knows we're logged in
      localStorage.setItem("whwUser", JSON.stringify(user));

      // After register, send them to My Orders
      navigate("/my-orders");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="arrival-layout">
      <div className="arrival-form-col">
        <form onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <p className="arrival-muted">
            Save your Whistler property details and re-use your Welcome Orders.
          </p>

          <label className="arrival-label">
            Name
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="error" style={{ marginTop: "0.5rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ marginTop: "1rem" }}
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p
            className="arrival-muted"
            style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}
          >
            Already have an account? <Link to="/login">Sign in instead</Link>.
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
          <h3>What gets saved?</h3>
          <p className="arrival-muted">
            In a full version of this app, your account could store:
          </p>
          <ul className="arrival-items">
            <li className="arrival-item">
              <div className="arrival-item-name">Preferred property address</div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">Favourite grocery lists</div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">Past Welcome Orders</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

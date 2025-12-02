// client/src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/arrival.css";
import "../styles/form.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("whwUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error reading whwUser from localStorage:", err);
    }
  }, []);

  const isLoggedIn = !!user;

  return (
    <section className="arrival-layout">
      {/* LEFT: Hero copy */}
      <div className="arrival-form-col">
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
          Arrive in Whistler to a warm, stocked home.
        </h1>
        <p className="arrival-muted" style={{ fontSize: "0.95rem" }}>
          Welcome Home Whistler is a concierge-style web app for second
          homeowners. Schedule your arrival, choose groceries and home add-ons,
          and we&apos;ll have everything ready before you walk in the door.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/groceries")}
            className="arrival-summary-btn"
          >
            Start a Welcome Order
          </button>

          <button
            type="button"
            className="arrival-summary-btn"
            onClick={() =>
              isLoggedIn ? navigate("/orders") : navigate("/login")
            }
          >
            {isLoggedIn ? "View my orders" : "Sign in to view my orders"}
          </button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>How it works</h3>
          <ol
            style={{
              paddingLeft: "1.25rem",
              margin: 0,
              fontSize: "0.92rem",
            }}
          >
            <li style={{ marginBottom: "0.35rem" }}>
              <strong>Build your grocery basket</strong> with essentials, wine,
              and arrival treats.
            </li>
            <li style={{ marginBottom: "0.35rem" }}>
              <strong>Choose home add-ons</strong> like warming the home,
              lights on, flowers, or turndown service.
            </li>
            <li>
              <strong>Confirm your Order</strong> with arrival date,
              time, and property address.
            </li>
          </ol>
        </div>
      </div>

      {/* RIGHT column intentionally empty for now */}
    </section>
  );
}

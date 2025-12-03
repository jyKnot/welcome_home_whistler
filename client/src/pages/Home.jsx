// client/src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("whwUser");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const isLoggedIn = !!user;

  return (
    <section className="home-layout">
      
      {/* LEFT COLUMN */}
      <div className="home-hero-col">
        <h1 className="home-hero-title">
          Arrive in Whistler to a warm, stocked home.
        </h1>

        <p className="home-hero-text">
          Welcome Home Whistler is a concierge-style web app for second
          homeowners. Schedule your arrival, choose groceries and home add-ons,
          and we&apos;ll have everything ready before you walk in the door.
        </p>

        <div className="home-buttons">
          <button
            type="button"
            className="home-primary-btn"
            onClick={() => navigate("/groceries")}
          >
            Start a Welcome Order
          </button>

          {!isLoggedIn && (
            <button
              type="button"
              className="home-secondary-btn"
              onClick={() => navigate("/login")}
            >
              Sign in to view my orders
            </button>
          )}
        </div>

        <div className="home-how-it-works">
          <h3>How it works</h3>
          <ol>
            <li>
              <strong>Build your grocery basket</strong> with essentials, wine,
              and arrival treats.
            </li>
            <li>
              <strong>Choose home add-ons</strong> like warming the home,
              lights on, flowers, or turndown service.
            </li>
            <li>
              <strong>Confirm your Order</strong> with arrival date, time, and
              property address.
            </li>
          </ol>
        </div>
      </div>

      {/* RIGHT COLUMN (empty for spacing) */}
      <div className="home-empty-col"></div>
    </section>
  );
}

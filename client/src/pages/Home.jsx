// client/src/pages/Home.jsx
import { useNavigate, Link } from "react-router-dom";
import "../styles/arrival.css";
import "../styles/form.css";

export default function Home() {
  const navigate = useNavigate();

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

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate("/groceries")}
            className="arrival-summary-btn"
          >
            Start a Welcome Order
          </button>

          <button
            type="button"
            className="arrival-back-btn"
            onClick={() => navigate("/login")}
          >
            Sign in to view my orders
          </button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>How it works</h3>
          <ol style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.92rem" }}>
            <li style={{ marginBottom: "0.35rem" }}>
              <strong>Build your grocery basket</strong> with essentials, wine,
              and arrival treats.
            </li>
            <li style={{ marginBottom: "0.35rem" }}>
              <strong>Choose home add-ons</strong> like warming the home,
              lights on, flowers, or turndown service.
            </li>
            <li>
              <strong>Confirm your Welcome Order</strong> with arrival date,
              time, and property address.
            </li>
          </ol>
        </div>
      </div>

      {/* RIGHT: Feature card */}
      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Designed for Whistler second homeowners</h3>
          <p className="arrival-muted" style={{ marginBottom: "0.75rem" }}>
            This capstone project simulates a real-world arrival concierge
            service:
          </p>
          <ul className="arrival-items">
            <li className="arrival-item">
              <div className="arrival-item-name">Mobile-first React frontend</div>
              <div className="arrival-item-category">
                Built with a modern MERN stack and REST APIs.
              </div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">Smart grocery selection</div>
              <div className="arrival-item-category">
                Filter, search, and add items to a live-updating cart.
              </div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">Arrival &amp; add-on workflow</div>
              <div className="arrival-item-category">
                Warm the home, switch on lights, and add fresh flowers or
                turndown service.
              </div>
            </li>
            <li className="arrival-item">
              <div className="arrival-item-name">Account &amp; order history</div>
              <div className="arrival-item-category">
                Log in, place Welcome Orders, and review them on the My Orders
                page.
              </div>
            </li>
          </ul>

          <p className="arrival-muted" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
            For demo purposes, this is a student project for a full-stack
            JavaScript bootcamp, not a live concierge service.
          </p>
        </div>
      </div>
    </section>
  );
}

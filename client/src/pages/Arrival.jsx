// client/src/pages/Arrival.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/form.css";
import "../styles/arrival.css";

export default function Arrival() {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];

  const [addOns, setAddOns] = useState({
    warmHome: false,
    lightsOn: false,
    flowers: false,
    turndown: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddOnChange = (key) => {
    setAddOns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.target;

    const payload = {
      arrivalDate: form.arrivalDate.value,
      arrivalTime: form.arrivalTime.value,
      address: form.address.value,
      notes: form.notes.value,
      addOns,
      cartItems,
    };

    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Order created:", data);

      alert("Your Welcome Order has been confirmed!");
      navigate("/");
    } catch (err) {
      console.error("❌ Order submit error:", err);
      setError(
        "We couldn't submit your Welcome Order. Please try again shortly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="arrival-layout">
      <div className="arrival-form-col">
        <form onSubmit={handleSubmit}>
          <h2>Arrival Details</h2>

          <label className="arrival-label">
            Arrival date
            <input type="date" name="arrivalDate" required />
          </label>

          <label className="arrival-label">
            Arrival time
            <input type="time" name="arrivalTime" />
          </label>

          <label className="arrival-label">
            Property address
            <input
              type="text"
              name="address"
              placeholder="e.g., 1234 Alpine Way, Unit 304"
              required
            />
          </label>

          <label className="arrival-label">
            Notes for your Welcome Home team
            <textarea
              name="notes"
              rows={4}
              placeholder="e.g., We're arriving late, please have the heat on and lights set low."
            />
          </label>

          {/* Add-ons */}
          <div className="arrival-addons">
            <h3>Home Add-Ons</h3>
            <p className="arrival-addons-hint">
              Make your Whistler home feel warm and welcoming.
            </p>

            <label className="arrival-addon-row">
              <input
                type="checkbox"
                checked={addOns.warmHome}
                onChange={() => handleAddOnChange("warmHome")}
              />
              <div>
                <div className="arrival-addon-title">Warm the home</div>
                <div className="arrival-addon-desc">
                  Pre-heat the property before you arrive.
                </div>
              </div>
            </label>

            <label className="arrival-addon-row">
              <input
                type="checkbox"
                checked={addOns.lightsOn}
                onChange={() => handleAddOnChange("lightsOn")}
              />
              <div>
                <div className="arrival-addon-title">Lights on</div>
                <div className="arrival-addon-desc">
                  Ensure the entryway and living room lights are on.
                </div>
              </div>
            </label>

            <label className="arrival-addon-row">
              <input
                type="checkbox"
                checked={addOns.flowers}
                onChange={() => handleAddOnChange("flowers")}
              />
              <div>
                <div className="arrival-addon-title">Fresh flowers</div>
                <div className="arrival-addon-desc">
                  A fresh seasonal bouquet waiting on your table.
                </div>
              </div>
            </label>

            <label className="arrival-addon-row">
              <input
                type="checkbox"
                checked={addOns.turndown}
                onChange={() => handleAddOnChange("turndown")}
              />
              <div>
                <div className="arrival-addon-title">Turndown service</div>
                <div className="arrival-addon-desc">
                  Bedrooms prepared with a hotel-style turndown.
                </div>
              </div>
            </label>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Confirm Welcome Order"}
          </button>
        </form>
      </div>

      {/* ORDER SUMMARY */}
      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Order Summary</h3>

          {cartItems.length === 0 ? (
            <p className="arrival-muted">
              No groceries added yet — go back to add items.
            </p>
          ) : (
            <>
              <ul className="arrival-items">
                {cartItems.map((item) => (
                  <li key={item.id} className="arrival-item">
                    <div>
                      <div className="arrival-item-name">{item.name}</div>
                      <div className="arrival-item-category">
                        {item.category}
                      </div>
                    </div>
                    <div className="arrival-item-meta">
                      <span className="arrival-item-qty">× {item.quantity}</span>
                      <span className="arrival-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="arrival-total-row">
                <span>Total (groceries)</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}


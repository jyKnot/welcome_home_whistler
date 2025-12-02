// client/src/pages/Arrival.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/form.css";
import "../styles/arrival.css";
import { createOrder } from "../api/orders";

const ADDON_PRICES = {
  warmHome: 45,
  lightsOn: 20,
  flowers: 100,
  turndown: 75,
};

export default function Arrival() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const todayISO = new Date().toISOString().split("T")[0];

  const [addOns, setAddOns] = useState({
    warmHome: false,
    lightsOn: false,
    flowers: false,
    turndown: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddOnChange = (key) => {
    setAddOns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const selectedAddOnEntries = Object.entries(addOns).filter(
    ([, isSelected]) => isSelected
  );

  const addOnsTotal = selectedAddOnEntries.reduce(
    (sum, [key]) => sum + (ADDON_PRICES[key] || 0),
    0
  );

  const groceriesTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const grandTotal = groceriesTotal + addOnsTotal;
  const hasItems = cartItems.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.target;
    const payload = {
      arrival: {
        date: form.arrivalDate.value,
        time: form.arrivalTime.value,
        address: form.address.value,
        notes: form.notes.value,
      },
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      })),
      addOns,
      totals: {
        groceries: groceriesTotal,
        addOns: addOnsTotal,
        grandTotal,
      },
    };

    try {
      const data = await createOrder(payload);

      navigate("/order-confirmation", {
        state: { order: data, fallback: payload },
      });
    } catch (err) {
      const msg =
        err.message ||
        "We couldn't submit your Welcome Order. Please try again shortly.";

      // Save the order so they don’t lose progress
      if (msg.includes("sign in")) {
        localStorage.setItem("pendingOrder", JSON.stringify(payload));
      }

      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="arrival-layout">
      <div className="arrival-form-col">
        <form onSubmit={handleSubmit}>
          <h2>Arrival Details</h2>

          <button
            type="button"
            className="arrival-back-btn"
            onClick={() => navigate("/groceries")}
          >
            ← Back to groceries
          </button>

          <label className="arrival-label">
            Arrival date
            <input type="date" name="arrivalDate" required min={todayISO} />
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
              placeholder="e.g., We're arriving late, please have the heat on."
            />
          </label>

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
                  Entryway + living room lights on.
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
                  Seasonal bouquet placed on your table.
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
                  Bedrooms prepared hotel-style.
                </div>
              </div>
            </label>
          </div>

          {error && (
            <div style={{ marginTop: "1rem" }}>
              <p className="error">{error}</p>

              {error.includes("sign in") && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="arrival-summary-btn"
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </button>

                  <button
                    type="button"
                    className="arrival-summary-btn"
                    onClick={() => navigate("/register")}
                  >
                    Create account
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Order Summary</h3>

          {cartItems.length === 0 ? (
            <p className="arrival-muted">No groceries added yet.</p>
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
                      <span className="arrival-item-qty">
                        × {item.quantity}
                      </span>
                      <span className="arrival-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        className="arrival-item-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="arrival-total-row">
                <span>Total (groceries)</span>
                <strong>${groceriesTotal.toFixed(2)}</strong>
              </div>

              {selectedAddOnEntries.length > 0 && (
                <>
                  <div className="arrival-addons-summary-header">
                    Home add-ons
                  </div>

                  <ul className="arrival-addons-summary">
                    {selectedAddOnEntries.map(([key]) => (
                      <li key={key} className="arrival-addon-summary-item">
                        <span className="arrival-addon-summary-name">
                          {key === "warmHome" && "Warm the home"}
                          {key === "lightsOn" && "Lights on"}
                          {key === "flowers" && "Fresh flowers"}
                          {key === "turndown" && "Turndown service"}
                        </span>
                        <span className="arrival-addon-summary-price">
                          ${ADDON_PRICES[key].toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="arrival-total-row">
                    <span>Total (add-ons)</span>
                    <strong>${addOnsTotal.toFixed(2)}</strong>
                  </div>
                </>
              )}

              <div className="arrival-total-row arrival-grand-total">
                <span>Grand total</span>
                <strong>${grandTotal.toFixed(2)}</strong>
              </div>

              <div className="arrival-summary-footer">
                <button
                  className="arrival-summary-btn"
                  onClick={() => {
                    const form = document.querySelector("form");
                    if (form) form.requestSubmit();
                  }}
                  disabled={!hasItems || submitting}
                >
                  {submitting ? "Submitting…" : "Confirm Welcome Order"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// client/src/pages/Arrival.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/form.css";
import "../styles/arrival.css";

const ADDON_PRICES = {
  warmHome: 45,
  lightsOn: 20,
  flowers: 100,
  turndown: 75,
};

export default function Arrival() {
  const location = useLocation();
  const navigate = useNavigate();

  // Cart items local state so we can remove them
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

  // --- TOTALS ---
  const selectedAddOnEntries = Object.entries(addOns).filter(
    ([key, isSelected]) => isSelected
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

  // --- SUBMIT ---
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
      totals: {
        groceries: groceriesTotal,
        addOns: addOnsTotal,
        grandTotal,
      },
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

      navigate("/order-confirmation", {
        state: {
          order: data,
          fallback: payload,
        },
      });
    } catch (err) {
      console.error("Order submit error:", err);
      setError("We couldn't submit your Welcome Order. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="arrival-layout">
      {/* LEFT COLUMN — FORM */}
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
              placeholder="e.g., We're arriving late, please have the heat on and lights set low."
            />
          </label>

          {/* HOME ADD-ONS */}
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
                  Bedrooms prepared hotel-style for your arrival.
                </div>
              </div>
            </label>
          </div>

          {error && <p className="error">{error}</p>}
        </form>
      </div>

      {/* RIGHT COLUMN — SUMMARY */}
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
                      <div className="arrival-item-category">{item.category}</div>
                    </div>

                    <div className="arrival-item-meta">
                      <span className="arrival-item-qty">× {item.quantity}</span>
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

              {/* SUBMIT BUTTON (now under summary) */}
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

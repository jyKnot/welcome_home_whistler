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
    ([, v]) => v === true
  );

  const addOnsTotal = selectedAddOnEntries.reduce(
    (sum, [key]) => sum + ADDON_PRICES[key],
    0
  );

  const groceriesTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const grandTotal = groceriesTotal + addOnsTotal;
  const hasItems = cartItems.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.target;

    // ⭐ MATCH THE BACKEND EXACTLY ⭐
    const payload = {
      arrivalDate: form.arrivalDate.value,
    arrivalTime: form.arrivalTime.value, 
      address: form.address.value,
      notes: form.notes.value || null,

      cartItems: cartItems.map((item) => ({
        id: item.id,
        label: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
      })),

      items: cartItems.map((item) => ({
        productId: item.id,
        label: item.name,
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
        state: { order: data },
      });
    } catch (err) {
      setError(err.message || "We couldn't submit your order.");
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
            Notes
            <textarea name="notes" rows={4} />
          </label>

          <div className="arrival-addons">
            <h3>Home Add-Ons</h3>
            {[
              ["warmHome", "Warm the home"],
              ["lightsOn", "Lights on"],
              ["flowers", "Fresh flowers"],
              ["turndown", "Turndown service"],
            ].map(([key, label]) => (
              <label className="arrival-addon-row" key={key}>
                <input
                  type="checkbox"
                  checked={addOns[key]}
                  onChange={() => handleAddOnChange(key)}
                />
                <div>{label}</div>
              </label>
            ))}
          </div>

          {error && <p className="error">{error}</p>}
        </form>
      </div>

      {/* Right side summary */}
      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Order Summary</h3>

          {!hasItems ? (
            <p>No groceries added.</p>
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
                      × {item.quantity}
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        type="button"
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
                  <div>Home add-ons</div>
                  <ul>
                    {selectedAddOnEntries.map(([key]) => (
                      <li key={key}>
                        {key}: ${ADDON_PRICES[key].toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="arrival-grand-total">
                <span>Grand total</span>
                <strong>${grandTotal.toFixed(2)}</strong>
              </div>

            <button
                className="arrival-summary-btn"
                onClick={() => {
                    const form = document.querySelector(".arrival-form-col form");
                    if (form) form.requestSubmit();
                }}
                disabled={!hasItems || submitting}
                >
                {submitting ? "Submitting…" : "Confirm Welcome Order"}
            </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

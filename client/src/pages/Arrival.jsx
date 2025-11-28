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

  const handleAddOnChange = (key) => {
    setAddOns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const payload = {
      arrivalDate: form.arrivalDate.value,
      arrivalTime: form.arrivalTime.value,
      address: form.address.value,
      notes: form.notes.value,
      addOns,
      cartItems,
    };

    console.log("Welcome Order payload (frontend only for now):", payload);
    alert("Welcome Order submitted! (Saving to backend coming soon)");
    navigate("/");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

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
              placeholder="e.g., We're arriving late, please have lights on and heat set to 21°C."
            />
          </label>

          <div className="arrival-addons">
            <h3>Home Add-Ons</h3>
            <p className="arrival-addons-hint">
              Make sure your Whistler home feels warm, welcoming, and ready.
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
                  Pre-heat your home to a cozy temperature before you arrive.
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
                  Have key lights turned on for a welcoming, safe arrival.
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
                  Seasonal bouquet waiting on your kitchen or dining table.
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
                  Beds prepared, blinds closed, and the bedroom ready for rest.
                </div>
              </div>
            </label>
          </div>

          <button type="submit">Confirm Welcome Order</button>
        </form>
      </div>

      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p className="arrival-muted">
              No groceries attached to this order yet. Go back to Groceries to
              add items.
            </p>
          ) : (
            <>
              <ul className="arrival-items">
                {cartItems.map((item) => (
                  <li key={item.id} className="arrival-item">
                    <div>
                      <div className="arrival-item-name">{item.name}</div>
                      {item.category && (
                        <div className="arrival-item-category">
                          {item.category}
                        </div>
                      )}
                    </div>
                    <div className="arrival-item-meta">
                      <span className="arrival-item-qty">
                        × {item.quantity}
                      </span>
                      {typeof item.price === "number" && (
                        <span className="arrival-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      )}
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

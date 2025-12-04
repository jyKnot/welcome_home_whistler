import { useLocation, useNavigate } from "react-router-dom";
import "../styles/arrival.css";
import "../styles/form.css";
import "../styles/layout.css"; // NEW: ensures confirmation layout styles load

// mirror the add-on prices used in Arrival.jsx
const ADDON_PRICES = {
  warmHome: 45,
  lightsOn: 20,
  flowers: 100,
  turndown: 75,
};

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from Arrival.jsx
  const orderFromServer = location.state?.order;
  const fallbackPayload = location.state?.fallback;

  // prefer server response, fall back to client payload if needed
  const order = orderFromServer || fallbackPayload;

  if (!order) {
    // if user hits this URL directly or refreshes without state
    return (
      <section className="confirmation-layout">
        <div className="confirmation-left">
          <h2>Order not found</h2>
          <p className="arrival-muted">
            We couldn&apos;t find a recent order to show. Please start a new
            Welcome Order.
          </p>
          <button
            type="button"
            className="arrival-summary-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  // read nested arrival/items/addOns/totals shape
  const arrival = order.arrival || fallbackPayload?.arrival || {};
  const addOns = order.addOns || fallbackPayload?.addOns || {};
  const items = order.items || fallbackPayload?.items || [];

  const orderTotals = order.totals || fallbackPayload?.totals || {};

  const arrivalDate = arrival.date || "Not specified";
  const arrivalTime = arrival.time || "Not specified";
  const address = arrival.address || "Not specified";
  const notes = arrival.notes || "";

  const fallbackTotals = fallbackPayload?.totals || {};

  const selectedAddOns = Object.entries(addOns).filter(
    ([, selected]) => selected
  );

  const rawTotals = {
    groceries: orderTotals.groceries ?? fallbackTotals.groceries,
    addOns: orderTotals.addOns ?? fallbackTotals.addOns,
    grandTotal: orderTotals.grandTotal ?? fallbackTotals.grandTotal,
  };

  const groceriesTotal =
    typeof rawTotals.groceries === "number"
      ? rawTotals.groceries
      : items.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );

  const computedAddOnsFromSelection = selectedAddOns.reduce(
    (sum, [key]) => sum + (ADDON_PRICES[key] || 0),
    0
  );

  const addOnsTotal =
    typeof rawTotals.addOns === "number"
      ? rawTotals.addOns
      : computedAddOnsFromSelection;

  const grandTotal =
    typeof rawTotals.grandTotal === "number"
      ? rawTotals.grandTotal
      : groceriesTotal + addOnsTotal;

  return (
    <section className="confirmation-layout">
      {/* LEFT COLUMN — ARRIVAL DETAILS */}
      <div className="confirmation-left">
        <h2>Welcome Order Confirmed</h2>
        <p className="arrival-muted">
          Your Whistler home is scheduled to be prepared for your arrival.
        </p>

        {orderFromServer?._id && (
          <p className="confirmation-order-id">
            Order ID: <strong>{orderFromServer._id}</strong>
          </p>
        )}

        <div className="confirmation-card">
          <h3>Arrival Details</h3>

          <div className="arrival-confirm-row">
            <span>Arrival date</span>
            <strong>{arrivalDate}</strong>
          </div>

          <div className="arrival-confirm-row">
            <span>Arrival time</span>
            <strong>{arrivalTime}</strong>
          </div>

          <div className="arrival-confirm-row">
            <span>Property address</span>
            <strong>{address}</strong>
          </div>

          {notes && (
            <div className="arrival-confirm-notes">
              <div className="arrival-confirm-notes-label">Notes</div>
              <p>{notes}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="arrival-summary-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "1.5rem" }}
        >
          Back to Home
        </button>
      </div>

      {/* RIGHT COLUMN — ORDER SUMMARY */}
      <div className="confirmation-right">
        <div className="confirmation-card">
          <h3>Order Summary</h3>

          {/* Groceries */}
          {items.length === 0 ? (
            <p className="arrival-muted">
              No groceries were included in this order.
            </p>
          ) : (
            <>
              <ul className="arrival-items">
                {items.map((item) => (
                  <li
                    key={item.id || item.productId || item._id}
                    className="arrival-item"
                  >
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
                    </div>
                  </li>
                ))}
              </ul>

              <div className="arrival-total-row">
                <span>Total (groceries)</span>
                <strong>${groceriesTotal.toFixed(2)}</strong>
              </div>
            </>
          )}

          {/* Add-ons */}
          {selectedAddOns.length > 0 && (
            <>
              <div className="arrival-addons-summary-header">
                Home add-ons
              </div>

              <ul className="arrival-addons-summary">
                {selectedAddOns.map(([key]) => (
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

          {/* Grand total */}
          <div className="arrival-total-row arrival-grand-total">
            <span>Grand total</span>
            <strong>${grandTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}


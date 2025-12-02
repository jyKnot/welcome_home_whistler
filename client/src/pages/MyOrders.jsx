// client/src/pages/MyOrders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/arrival.css";
import "../styles/form.css";
import { getMyOrders } from "../api/orders.js";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders(); // GET /api/orders/my

        if (!isCancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("MyOrders fetch error:", err);
        if (!isCancelled) {
          if (err.message === "Please sign in to view your orders.") {
            navigate("/login");
          } else {
            setError(
              "We couldn't load your orders. Please try again shortly."
            );
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  const formatDate = (isoOrString) => {
    if (!isoOrString) return "Not specified";
    try {
      const d = new Date(isoOrString);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString();
      }
      return isoOrString;
    } catch {
      return isoOrString;
    }
  };

  const toggleExpanded = (orderId) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
  };

  return (
    <section className="arrival-layout">
      <div className="arrival-form-col">
        <h2>My Welcome Orders</h2>
        <p className="arrival-muted">
          View a history of your recent Welcome Home Whistler orders.
        </p>

        <button
          type="button"
          className="arrival-back-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: "0.75rem" }}
        >
          ← Back to groceries
        </button>
      </div>

      <div className="arrival-summary-col">
        <div className="arrival-summary-card">
          <h3>Order history</h3>

          {loading && <p className="arrival-muted">Loading your orders…</p>}

          {error && !loading && <p className="error">{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <p className="arrival-muted">
              You don&apos;t have any orders yet. Create a Welcome Order to see
              it here.
            </p>
          )}

          {!loading && !error && orders.length > 0 && (
            <ul className="arrival-items">
              {orders.map((order) => {
                const { _id, arrival, totals, items, createdAt, addOns } =
                  order;
                const itemCount = items?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                );
                const firstFew = (items || []).slice(0, 3);
                const isExpanded = expandedOrderId === _id;

                return (
                  <li
                    key={_id}
                    className="arrival-item"
                    onClick={() => toggleExpanded(_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      <div className="arrival-item-name">
                        Order placed on {formatDate(createdAt)}
                      </div>
                      <div className="arrival-item-category">
                        Arrival: {formatDate(arrival?.date)}{" "}
                        {arrival?.time ? `at ${arrival.time}` : ""}
                      </div>
                      <div className="arrival-item-category">
                        {arrival?.address || "No address specified"}
                      </div>
                      <div
                        className="arrival-item-category"
                        style={{ marginTop: "0.25rem" }}
                      >
                        {firstFew.map((item, idx) => (
                          <span key={item.productId || idx}>
                            {item.name}
                            {idx < firstFew.length - 1 ? ", " : ""}
                          </span>
                        ))}
                        {items && items.length > 3
                          ? ` … +${items.length - 3} more`
                          : ""}
                      </div>
                    </div>

                    <div className="arrival-item-meta">
                      <span className="arrival-item-qty">
                        {itemCount || 0} item
                        {(itemCount || 0) === 1 ? "" : "s"}
                      </span>
                      <span className="arrival-item-price">
                        $
                        {totals?.grandTotal != null
                          ? totals.grandTotal.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          marginTop: "0.75rem",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid rgba(148, 163, 184, 0.4)",
                          fontSize: "0.9rem",
                          width: "100%",
                        }}
                        onClick={(e) => e.stopPropagation()} // avoid toggle loop
                      >
                        <h4
                          style={{
                            margin: "0 0 0.5rem",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                          }}
                        >
                          Order details
                        </h4>
                        <p className="arrival-muted" style={{ margin: 0 }}>
                          Items:
                        </p>
                        <ul style={{ margin: "0.25rem 0 0.5rem 1.1rem" }}>
                          {(items || []).map((item, idx) => (
                            <li key={item.productId || idx}>
                              {item.quantity || 1} × {item.name}{" "}
                              {item.price != null &&
                                `( $${item.price.toFixed(2)} each )`}
                            </li>
                          ))}
                        </ul>

                        <p className="arrival-muted" style={{ margin: 0 }}>
                          Add-ons:
                        </p>
                        <ul style={{ margin: "0.25rem 0 0.5rem 1.1rem" }}>
                          {addOns?.warmHome && <li>Warm home</li>}
                          {addOns?.lightsOn && <li>Lights on</li>}
                          {addOns?.flowers && <li>Fresh flowers</li>}
                          {addOns?.turndown && <li>Turndown service</li>}
                          {!addOns ||
                            (!addOns.warmHome &&
                              !addOns.lightsOn &&
                              !addOns.flowers &&
                              !addOns.turndown && <li>No add-ons selected</li>)}
                        </ul>

                        <p
                          style={{
                            margin: 0,
                            fontWeight: 600,
                          }}
                        >
                          Total: $
                          {totals?.grandTotal != null
                            ? totals.grandTotal.toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

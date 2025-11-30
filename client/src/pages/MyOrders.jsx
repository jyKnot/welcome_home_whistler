// client/src/pages/MyOrders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/arrival.css";
import "../styles/form.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:4000/api/orders", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          // Not logged in → send to login
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load orders (status ${res.status})`);
        }

        const data = await res.json();
        if (!isCancelled) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("MyOrders fetch error:", err);
        if (!isCancelled) {
          setError("We couldn't load your orders. Please try again shortly.");
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
                const { _id, arrival, totals, items } = order;
                const itemCount = items?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                );
                const firstFew = (items || []).slice(0, 3);

                return (
                  <li key={_id} className="arrival-item">
                    <div>
                      <div className="arrival-item-name">
                        Arrival: {formatDate(arrival?.date)}
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
                        {itemCount || 0} item{(itemCount || 0) === 1 ? "" : "s"}
                      </span>
                      <span className="arrival-item-price">
                        $
                        {totals?.grandTotal != null
                          ? totals.grandTotal.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
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

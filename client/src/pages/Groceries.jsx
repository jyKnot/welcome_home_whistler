import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/groceries.css";
import CartSidebar from "../components/CartSidebar";
import { getGroceryPrice } from '../utils/pricing';


export default function Groceries() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();

  const handleContinueToArrival = () => {
  navigate("/arrival", { state: { cartItems } });
};


  useEffect(() => {
    let cancel = false;

    const fetchGroceries = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("http://localhost:4000/api/groceries");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

       const data = await res.json();

        if (!cancel) {
        const withPrices = (data || []).map((item) => ({
            ...item,
            price: getGroceryPrice(item),
        }));

  setItems(withPrices);
}
      } catch (e) {
        console.error("Groceries fetch error:", e);
        if (!cancel) {
          setErr("Could not load groceries.");
        }
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    };

    fetchGroceries();
    return () => {
      cancel = true;
    };
  }, []);

  const categories = useMemo(() => {
    const s = new Set(items.map((i) => i.category).filter(Boolean));
    return ["", ...Array.from(s).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const qLower = q.toLowerCase();
    return items.filter((i) => {
      const name = (i.name || "").toLowerCase();
      const catName = (i.category || "").toLowerCase();

      const matchesSearch =
        !q || name.includes(qLower) || catName.includes(qLower);

      const matchesCategory = !cat || i.category === cat;

      return matchesSearch && matchesCategory;
    });
  }, [items, q, cat]);

  const handleAddToOrder = (item) => {
    setCartOpen(true);
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price || 0,
          quantity: 1,
        },
      ];
    });
  };

  const handleIncrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="groceries-wrap">
        <p>Loading groceries…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="groceries-wrap">
        <p className="error">{err}</p>
      </div>
    );
  }

  return (
    <>
      {/* Cart sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onContinue={handleContinueToArrival} 
      />

      {/* Overlay behind cart */}
      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Main groceries content */}
      <div className="groceries-wrap">
        <div className="filters">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (e.g., milk, fruit)…"
          />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {categories.map((c) => (
              <option key={c || "all"} value={c}>
                {c || "All categories"}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="muted">No matches. Try a different search.</p>
        ) : (
          <ul className="grid">
            {filtered.slice(0, 48).map((i) => (
              <li key={i.id} className="card">
                <div className="thumb">
                  <span className="badge">{iconFor(i.category)}</span>
                </div>
                <div className="card-body">
                  <h3>{i.name || "Unnamed item"}</h3>
                  <p className="category">{i.category || "Uncategorized"}</p>
                  {typeof i.price === "number" && (
                    <p className="price">${i.price.toFixed(2)}</p>
                  )}
                  <button
                    className="add-btn"
                    onClick={() => handleAddToOrder(i)}
                  >
                    Add to order
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating "View order" button */}
      {totalItems > 0 && (
        <button
          className="cart-floating-btn"
          onClick={() => setCartOpen(true)}
        >
          🧺 <span>View order ({totalItems})</span>
        </button>
      )}
    </>
  );
}

function iconFor(cat = "") {
  const c = cat.toLowerCase();
  if (c.includes("fruit")) return "🍓";
  if (c.includes("vegetable")) return "🥦";
  if (c.includes("dairy")) return "🥛";
  if (c.includes("bakery") || c.includes("bread")) return "🥖";
  if (c.includes("meat")) return "🥩";
  if (c.includes("drink") || c.includes("beverage")) return "🥤";
  return "🛒";
}

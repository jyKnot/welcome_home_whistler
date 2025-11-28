import { useEffect, useState, useMemo } from "react";
import apiClient from "../api/apiClient";
import "../styles/groceries.css";

export default function Groceries() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

useEffect(() => {
  let cancel = false;

  const fetchGroceries = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await fetch("http://localhost:4000/api/groceries/products");

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!cancel) {
        setItems(data || []);
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
                  onClick={() => alert(`Add "${i.name}" to order (coming soon)`)}
                >
                  Add to order
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
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

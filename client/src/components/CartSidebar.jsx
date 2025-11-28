import "../styles/cart.css";

export default function CartSidebar({
  isOpen,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onContinue,
}) {
  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Your Welcome Order</h2>
        <button className="cart-close" onClick={onClose} aria-label="Close cart">
          ×
        </button>
      </div>

      {items.length === 0 ? (
        <p className="cart-empty">
          Your order is empty. Add groceries to start building your Welcome
          Home experience.
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-main">
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    {item.category && (
                      <div className="cart-item-category">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <button
                    className="cart-remove"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-item-footer">
                  <div className="cart-qty">
                    <button
                      onClick={() => onDecrement(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onIncrement(item.id)}>+</button>
                  </div>
                  <div className="cart-price">
                    {typeof item.price === "number"
                      ? `$${(item.price * item.quantity).toFixed(2)}`
                      : "—"}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-total-row">
              <span>Total (groceries)</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              className="cart-cta"
              onClick={() => onContinue && onContinue()}
            >
              Continue to Arrival Setup
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

// hit the backend directly on port 4000
const API_BASE_URL = "http://localhost:4000/api";

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

/* CREATE ORDER */
export async function createOrder(orderPayload) {
  let res;

  try {
    res = await fetch(apiUrl("/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(orderPayload),
    });
  } catch (networkErr) {
    console.error("Network error in createOrder:", networkErr);
    throw new Error("Network error talking to the server.");
  }

  if (res.status === 401) {
    throw new Error("Please sign in to place an order.");
  }

  // Read raw text so it can handle invalid JSON
  const raw = await res.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("JSON parse error (createOrder):", raw);
    throw new Error("Order failed — server returned invalid JSON.");
  }

  if (!res.ok) {
    const message =
      data?.message || `Failed to create order (status ${res.status})`;
    throw new Error(message);
  }

  return data;
}

/* GET MY ORDERS */
export async function getMyOrders() {
  let res;

  try {
    res = await fetch(apiUrl("/orders/my"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (networkErr) {
    console.error("Network error in getMyOrders:", networkErr);
    throw new Error("Network error talking to the server.");
  }

  if (res.status === 401) {
    throw new Error("Please sign in to view your orders.");
  }

  const raw = await res.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("JSON parse error (getMyOrders):", raw);
    throw new Error("Server returned invalid JSON when fetching your orders.");
  }

  if (!res.ok) {
    const message =
      data?.message || `Failed to fetch orders (status ${res.status})`;
    throw new Error(message);
  }

  // Expected shapes
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.orders)) return data.orders;

  console.warn("[getMyOrders] Unexpected response shape:", data);
  return [];
}

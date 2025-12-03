// client/src/api/orders.js

// 👇 Hit the backend directly on port 4000
const API_BASE_URL = "http://localhost:4000/api";

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

/* CREATE ORDER */
export async function createOrder(orderPayload) {
  console.log("🟦 createOrder() CALLED with:", orderPayload);

  let res;
  try {
    console.log("🌐 calling fetch:", apiUrl("/orders"));
    res = await fetch(apiUrl("/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(orderPayload),
    });
    console.log("🟩 FETCH COMPLETED, STATUS:", res.status);
  } catch (networkErr) {
    console.error("🛑 NETWORK ERROR in createOrder:", networkErr);
    throw new Error("Network error talking to the server.");
  }

  if (res.status === 401) {
    throw new Error("Please sign in to place an order.");
  }

  const raw = await res.text();
  console.log("🟨 RAW RESPONSE (createOrder):", raw);

  let data;
  try {
    data = JSON.parse(raw);
    console.log("🟪 JSON PARSED (createOrder):", data);
  } catch (err) {
    console.error("🟥 JSON PARSE ERROR (createOrder):", raw);
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
  console.log("🟦 getMyOrders() CALLED");

  let res;
  try {
    console.log("🌐 calling fetch:", apiUrl("/orders/my"));
    res = await fetch(apiUrl("/orders/my"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    console.log("🟩 FETCH COMPLETED (my orders), STATUS:", res.status);
  } catch (networkErr) {
    console.error("🛑 NETWORK ERROR in getMyOrders:", networkErr);
    throw new Error("Network error talking to the server.");
  }

  if (res.status === 401) {
    throw new Error("Please sign in to view your orders.");
  }

  const raw = await res.text();
  console.log("🟨 RAW RESPONSE (my orders):", raw);

  let data;
  try {
    data = JSON.parse(raw);
    console.log("🟪 JSON PARSED (my orders):", data);
  } catch (err) {
    console.error("🟥 JSON PARSE ERROR (my orders):", raw);
    throw new Error("Server returned invalid JSON when fetching your orders.");
  }

  if (!res.ok) {
    const message =
      data?.message || `Failed to fetch orders (status ${res.status})`;
    throw new Error(message);
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.orders)) return data.orders;

  console.warn("[getMyOrders] Unexpected response shape:", data);
  return [];
}

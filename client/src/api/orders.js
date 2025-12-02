// src/api/orders.js
import { apiClient } from "./apiClient.js";

export async function createOrder(orderData) {
  try {
    // baseURL = "http://localhost:4000/api"
    // so this hits POST http://localhost:4000/api/orders
    const response = await apiClient.post("/orders", orderData);
    return response.data; // this is the saved Order from Mongo
  } catch (error) {
    console.error("Error creating order:", error);

    // Try to pull a helpful message from the backend, if it exists
    const message =
      error?.response?.data?.message || "Failed to create order. Please try again.";

    throw new Error(message);
  }
}

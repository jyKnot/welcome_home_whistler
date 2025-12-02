// src/api/orders.js
import { apiClient } from "./apiClient.js";

// Create a new order
export async function createOrder(orderData) {
  try {
    // baseURL = "http://localhost:4000/api"
    // so this hits POST http://localhost:4000/api/orders
    const response = await apiClient.post("/orders", orderData);
    return response.data; // saved Order from Mongo
  } catch (error) {
    console.error("Error creating order:", error);

    let message =
      error?.response?.data?.message ||
      "Failed to create order. Please try again.";

    if (error?.response?.status === 401) {
      message = "Please sign in to place an order.";
    }

    throw new Error(message);
  }
}

// Get orders for the currently logged-in user
export async function getMyOrders() {
  try {
    // Hits GET http://localhost:4000/api/orders/my
    const response = await apiClient.get("/orders/my");
    return response.data; // array of orders
  } catch (error) {
    console.error("Error fetching orders:", error);

    let message =
      error?.response?.data?.message ||
      "Failed to fetch your orders. Please try again.";

    if (error?.response?.status === 401) {
      message = "Please sign in to view your orders.";
    }

    throw new Error(message);
  }
}

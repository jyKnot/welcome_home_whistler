import Order from "../models/Order.js";

const ADDON_PRICES = {
  warmHome: 45,
  lightsOn: 20,
  flowers: 100,
  turndown: 75,
};

// POST /api/orders  (mounted as /api/orders in server.js)
export async function createOrder(req, res) {
  try {
    const {
      arrivalDate,
      arrivalTime,
      address,
      notes,
      addOns = {},
      cartItems = [],
      totals = {},
    } = req.body;

    if (!arrivalDate || !address) {
      return res
        .status(400)
        .json({ message: "Arrival date and address are required." });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one cart item." });
    }

    // normalize items to match schema
    const items = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
    }));

    // recalculate totals on the server
    const groceriesTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const selectedAddOns = Object.entries(addOns).filter(
      ([, selected]) => selected
    );

    const addOnsTotal =
      selectedAddOns.reduce(
        (sum, [key]) => sum + (ADDON_PRICES[key] || 0),
        0
      ) || 0;

    const grandTotal = groceriesTotal + addOnsTotal;

    const orderDoc = await Order.create({
      // user: req.user?._id || undefined, // enable once auth is required
      arrival: {
        date: arrivalDate,
        time: arrivalTime,
        address,
        notes,
      },
      items,
      addOns: {
        warmHome: !!addOns.warmHome,
        lightsOn: !!addOns.lightsOn,
        flowers: !!addOns.flowers,
        turndown: !!addOns.turndown,
      },
      totals: {
        groceries: groceriesTotal,
        addOns: addOnsTotal,
        grandTotal,
      },
    });

    return res.status(201).json(orderDoc);
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ message: "Failed to create order." });
  }
}

// GET /api/orders/:id
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ message: "Failed to fetch order." });
  }
}

// GET /api/orders  (for current user; requires requireAuth)
export async function getOrdersForCurrentUser(req, res) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
}

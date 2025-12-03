import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number, 
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    arrival: {
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
      },
    },

    items: {
      type: [orderItemSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    addOns: {
      warmHome: { type: Boolean, default: false },
      lightsOn: { type: Boolean, default: false },
      flowers: { type: Boolean, default: false },
      turndown: { type: Boolean, default: false },
    },

    totals: {
      groceries: {
        type: Number,
        required: true,
        min: 0,
      },
      addOns: {
        type: Number,
        required: true,
        min: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;


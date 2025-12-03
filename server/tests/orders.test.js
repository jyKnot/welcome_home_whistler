import request from "supertest";
import app from "../../server.js";

describe("Welcome Home Whistler API", () => {
  test("GET / should respond with the welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Welcome Home Whistler API");
  });
});

describe("Orders API", () => {
  // 1) existing negative test – missing arrivalDate and address
  test("POST /api/orders should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        // missing arrivalDate and address on purpose
        cartItems: [],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain(
      "arrival date and address",
    );
  });

  // 2) happy path – valid order creates successfully
  test("POST /api/orders should create an order when payload is valid", async () => {
    const validPayload = {
      arrivalDate: "2025-12-20",
      address: "123 Test Lane, Whistler, BC",
      cartItems: [
        {
          id: "warmHome",
          label: "Warm Home",
          price: 45,
          quantity: 1,
        },
        {
          id: "flowers",
          label: "Fresh Flowers",
          price: 100,
          quantity: 1,
        },
      ],
      contactName: "Test User",
      contactEmail: "test@example.com",
      contactPhone: "604-555-1234",
      notes: "Please test my order route 🙂",
    };

    const res = await request(app).post("/api/orders").send(validPayload);

    expect([200, 201]).toContain(res.statusCode);

    expect(res.headers["content-type"]).toMatch(/json/i);
    expect(res.body).toBeDefined();
    expect(typeof res.body).toBe("object");

    const order = res.body.order || res.body;

    expect(order).toMatchObject({
      arrivalDate: validPayload.arrivalDate,
      address: validPayload.address,
    });

    expect(Array.isArray(order.cartItems)).toBe(true);
    expect(order.cartItems).toHaveLength(2);

    // Optional: if you generate an id/_id/orderId, uncomment what matches
    // expect(order).toHaveProperty("_id");
    // expect(order).toHaveProperty("orderId");
  });

  // 3) cartItems missing entirely
  test("POST /api/orders should return 400 if cartItems is missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        arrivalDate: "2025-12-20",
        address: "123 Test Lane, Whistler, BC",
        // cartItems missing on purpose
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("cart");
  });

  // 4) cartItems is empty array
  test("POST /api/orders should return 400 if cartItems is empty", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        arrivalDate: "2025-12-20",
        address: "123 Test Lane, Whistler, BC",
        cartItems: [],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("cart");
  });

  test("POST /api/orders should return 400 if contactEmail is clearly invalid", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        arrivalDate: "2025-12-20",
        address: "123 Test Lane, Whistler, BC",
        cartItems: [
          {
            id: "warmHome",
            label: "Warm Home",
            price: 45,
            quantity: 1,
          },
        ],
        contactName: "Bad Email User",
        contactEmail: "not-an-email",
      });

    // if you don't validate email yet, this will fail 
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("email");
  });
});

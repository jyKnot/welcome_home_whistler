// server/tests/orders.test.js
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
  test("POST /api/orders should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        // missing arrivalDate and address on purpose
        cartItems: [],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("arrival date and address");
  });
});

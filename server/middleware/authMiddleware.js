// server/middleware/authMiddleware.js
export function requireAuth(req, res, next) {
  // 🧪 In test environment, skip real auth and inject a fake user
  if (process.env.NODE_ENV === "test") {
    req.user = { _id: "test-user-id" };
    return next();
  }

  // 🔐 Your existing auth logic goes here
  // e.g. check JWT cookie, session, etc.
  // if not authenticated:
  // return res.status(401).json({ message: "Unauthorized" });

  // if authenticated:
  // req.user = { _id: user._id, ... }
  // return next();
}

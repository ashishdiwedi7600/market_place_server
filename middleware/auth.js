const jwt = require("jsonwebtoken");

const auth = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists and is in correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];


  try {
    // Verify token and decode payload
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next(); // move to next middleware or route
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = auth;
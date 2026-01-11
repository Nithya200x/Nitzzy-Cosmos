const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Getting token from header
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", req.headers.authorization);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verifying
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;

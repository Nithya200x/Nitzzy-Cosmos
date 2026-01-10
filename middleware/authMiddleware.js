const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    try{
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to request
    req.userId = decoded.id;

    next(); // allow request
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
module.exports = authMiddleware;
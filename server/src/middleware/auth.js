const jwt = require("jsonwebtoken");
require('dotenv').config();


const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "Access denied." });
    const isVerified = jwt.verify(token, process.env.JWT_KEY);
    if (!isVerified) return res.status(401).json({ msg: "Token verification failed, authorization denied." });
    req.user = isVerified.id;
    req.token = token;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = auth;
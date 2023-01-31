const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.token = jwt.verify(token, "SECRET_TOKEN");
    if (req.token != null) {
      next();
    }
  } catch {
    res.status(401).json({ error: "Session expriré ou token d'authentification invalid" });
  }
};

import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Please Login first" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please Login first" });
    }

    const user = jwt.verify(token, process.env.secretKey);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Session expired or invalid token. Please Login again." });
  }
};

import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Please Re-Login" });
    }

    const user = jwt.verify(token, process.env.secretKey);

    // console.log(user);

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

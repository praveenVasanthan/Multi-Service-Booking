import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied!" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.id = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized credential!" });
  }
};

export default authMiddleware;

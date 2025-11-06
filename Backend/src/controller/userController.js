import authModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name)
      return res.status(400).json({ message: "name field is required!" });
    if (!email)
      return res.status(400).json({ message: "email field is required!" });
    if (!password)
      return res.status(400).json({ message: "password field is required!" });

    const userExist = await authModel.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "User already exist!" });

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await authModel.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = getToken(user._id);

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(400).json({ message: "Failed to create user!", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ message: "email field is required!" });
    if (!password)
      return res.status(400).json({ message: "password field is required!" });

    const user = await authModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = getToken(user._id);

    res.status(200).json({ message: "User loged in successfully", token });
  } catch (error) {}
};

const getToken = (id) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = jwt.sign({ id }, JWT_SECRET);
  return token;
};

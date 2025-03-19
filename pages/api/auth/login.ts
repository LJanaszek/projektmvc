import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const users = [
  { id: 1, email: "chuj", password: bcrypt.hashSync("123", 10) }
];

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Set token in HTTP-only cookie
  res.setHeader("Set-Cookie", serialize("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
  }));

  res.status(200).json({ message: "Login successful" });
}

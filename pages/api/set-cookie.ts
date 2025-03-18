import { serialize } from "cookie";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", serialize("token", "abc123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  }));

  res.status(200).json({ message: "Cookie set!" });
}
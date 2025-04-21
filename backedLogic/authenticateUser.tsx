import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

export const authenticateUser = async (req, res) => {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.auth_token;
    let reqUser;

    if (!token) {
        res.setHeader("Set-Cookie", serialize("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/",
          }));
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        reqUser = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ message: "Invalid token: " + (error.message || "") });
    }
    
    if (!reqUser?.id) {
        res.setHeader("Set-Cookie", serialize("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            path: "/",
          }));
        return res.status(401).json({ message: "Invalid user" });
    }

    return reqUser;
};
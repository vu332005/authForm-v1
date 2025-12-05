import jwt from "jsonwebtoken";
import { users,sessions,ACCESS_KEY } from "../db/db.js";

// Middleware xác thực Access Token 
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // dlieu ng dùng gửi lên thg có dạng -> Authorization: Bearer <JWT>
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    jwt.verify(token, ACCESS_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
        req.user = user;
        next(); //  chạy mdw tiếp theo
    });
};
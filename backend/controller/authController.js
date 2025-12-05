import { users,sessions, REFRESH_KEY, ACCESS_KEY } from '../db/db.js';
import jwt from "jsonwebtoken"

export const signUp = (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "Đăng ký thành công" });
}

export const logIn = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    // Tạo token
    const accessToken = jwt.sign({ username }, ACCESS_KEY, { expiresIn: '10s' }); 
    const refreshToken = jwt.sign({ username }, REFRESH_KEY, { expiresIn: '7d' });

    sessions.push(refreshToken);

    // Gửi Refresh Token qua Cookie http only->  trình duyệt sẽ tự gắn cookie refresh token vào mọi req phù hợp
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // giúp k thể đọc đc bằng js
        secure: false, 
        sameSite: 'strict'
    });

    res.json({ accessToken, user });
}

export const logOut = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const index = sessions.indexOf(refreshToken);
    if (index > -1) sessions.splice(index, 1); // xóa token khỏi server
    
    res.clearCookie('refreshToken'); //  xóa refresh token khỏi trình duyệt -> cookie httponly biến mất
    // -> sau 2 bc trên  -> server và client đều kh còn refresh token
    
    res.json({ message: "Đăng xuất thành công" });
}

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "Không có Refresh Token" });
    if (!sessions.includes(refreshToken)) return res.status(403).json({ message: "Token không hợp lệ" });

    jwt.verify(refreshToken, REFRESH_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Refresh token hết hạn" });
        
        const newAccessToken = jwt.sign({ username: user.username }, ACCESS_KEY, { expiresIn: '10s' });
        res.json({ accessToken: newAccessToken });
    });
}
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 5001;

// giả lập db
const users = [];     // Lưu user: { username, password }
const sessions = [];  // Lưu refresh token đang hoạt động

const ACCESS_KEY = "access_secret_key_123";
const REFRESH_KEY = "refresh_secret_key_123";

// middleware chung 
app.use(express.json()); //  bọc josn gửi từ client
app.use(cookieParser());

// cho phép frontend ở domain khác gọi api
app.use(cors({
    origin: 'http://localhost:5173', // chỉ cho phép frontend ở cổng này dc gọi api
    credentials: true // để browser cho phép gửi cookie giữa 2 domain # nhau -> phải bật
}));

// Middleware xác thực Access Token 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // dlieu ng dùng gửi lên thg có dạng -> Authorization: Bearer <JWT>
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    jwt.verify(token, ACCESS_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
        req.user = user;
        next(); //  chạy mdw tiếp theo
    });
};

//routes

// 1. Đăng ký -> khi client gửi post tới url này -> callback sẽ chạy
app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "Đăng ký thành công" });
});

// 2. Đăng nhập
app.post('/api/auth/login', (req, res) => {
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
});

// 3. thực hiện refresh token -> cấp lại access token mới
app.post('/api/auth/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "Không có Refresh Token" });
    if (!sessions.includes(refreshToken)) return res.status(403).json({ message: "Token không hợp lệ" });

    jwt.verify(refreshToken, REFRESH_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Refresh token hết hạn" });
        
        const newAccessToken = jwt.sign({ username: user.username }, ACCESS_KEY, { expiresIn: '10s' });
        res.json({ accessToken: newAccessToken });
    });
});

// 4. Lấy thông tin User (Private Route)
app.get('/api/user/me', verifyToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    res.json({ user });
});

// 5. Đăng xuất
app.post('/api/auth/logout', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const index = sessions.indexOf(refreshToken);
    if (index > -1) sessions.splice(index, 1); // xóa token khỏi server
    
    res.clearCookie('refreshToken'); //  xóa refresh token khỏi trình duyệt -> cookie httponly biến mất
    // -> sau 2 bc trên  -> server và client đều kh còn refresh token
    
    res.json({ message: "Đăng xuất thành công" });
});

app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
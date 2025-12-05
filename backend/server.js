import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import {verifyToken} from './middleware/verifyTokenMiddleware.js'

const app = express();
const PORT = 5001;


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

app.use("/api/auth/",authRoute)

app.use(verifyToken)
app.use("/api/user",userRoute)



app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
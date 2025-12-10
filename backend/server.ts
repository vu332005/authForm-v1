import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoute from "./routes/authRoute"
import userRoute from "./routes/userRoute"
import verifyAccessToken from "./middleware/verifyAccessToken";
import cors from 'cors';

// load file .env

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors({
  origin: "http://localhost:5173", // Chỉ định rõ URL của Frontend (không có dấu / ở cuối)
  credentials: true // Cho phép gửi kèm Cookie/Token
}));

app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRoute)

app.use(verifyAccessToken)
app.use('/api/user', userRoute)

app.listen(PORT, () => console.log(`server is running at PORT ${PORT}`))

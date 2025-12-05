import express from "express"
import { users,sessions, REFRESH_KEY, ACCESS_KEY } from '../db/db.js';
import jwt from "jsonwebtoken"
import { logIn, logOut, signUp, refreshToken } from "../controller/authController.js";

const router = express.Router()

// 1. Đăng ký -> khi client gửi post tới url này -> callback sẽ chạy
router.post('/register',signUp );

router.post('/login', logIn);

router.post('/logout', logOut);

router.post('/refresh', refreshToken);



export default router


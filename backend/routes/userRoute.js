import express from "express"
import { users,sessions } from '../db/db.js';
import { authMe } from "../controller/userController.js";

const router = express.Router()

// Lấy thông tin User (Private Route)
router.get('/me', authMe);

export default router
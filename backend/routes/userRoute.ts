import Router from "express";
import { authMe } from "../controller/userController";

const router = Router()

router.post("/me",authMe)

export default router
import { Router } from "express"
import { signUp, logIn,logOut, refreshToken } from "../controller/authController"

const router = Router()

router.post('/register',signUp)

router.post('/login',logIn)

router.post('/logout',logOut)

router.post('/refreshToken',refreshToken)

export default router
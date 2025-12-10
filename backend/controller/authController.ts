import { Request, Response } from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import { Users, Sessions } from "../db/db"
import { User } from "../styles/userType"
import { Session } from "../styles/sessionType"
import dotenv from "dotenv"

dotenv.config()
const REFRESH_KEY = process.env.REFRESH_KEY 
const ACCESS_KEY = process.env.ACCESS_KEY

if (!REFRESH_KEY || !ACCESS_KEY) { //  biến env -> có thể là string/ undefined -> ta phải bắt lỗi undefined thì ts mới k báo lỗi
    throw new Error("Thiếu ACCESS_KEY hoặc REFRESH_KEY trong file .env");
}

export const signUp = (req: Request, res: Response ) : Response | void => {
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({message: "không được để trống username hoặc paswaord"})
    }

    if(Users.find(u => u.username === username)){
        return res.status(400).json({message: "tài khoản này đã tồn tại"})
    }

    const newUser: User = {
        id: Date.now(),
        username,
        password
    }

    Users.push(newUser)
    return res.status(201).json({message: "đăng ký thành công", user: {id: newUser.id, username: newUser.username}})
}
export const logIn = (req: Request, res: Response): Response | void => {
    const {username, password} = req.body

    // check
    if(!username || !password){
        return res.status(400).json({message: "không được để trống username hoặc paswaord"})
    }

    const user = Users.find(u => u.username === username && u.password === password)
    if(!user) return res.status(401).json({message: "sai tài khoản hoặc mật khẩu"})

    // create token if check success
    const accessToken = jwt.sign({username},ACCESS_KEY, {expiresIn: "10m"})
    const refreshToken = jwt.sign({username},REFRESH_KEY, {expiresIn: "7d"})

    const newSession: Session = {
        userId: user.id,
        refreshToken: refreshToken,
        createdAt: new Date()
    }

    // saved refreshtoken in server by session
    Sessions.push(newSession)

    // give refreshtoken to client by cookie httpOnly for security
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })

    // give back accesstoken and user info to client  **note:(should limit the return fileds)
    return res.status(200).json({accessToken, user: {username: user.username}})
}
export const logOut = (req: Request, res: Response) : Response | void => {
    const refreshToken = req.cookies.refreshToken;// get refreshtoken from req cookie
    
    // findindex trả về số thứ tự index của phần tử đúng đầu tiên theo điều kiện
    const index = Sessions.findIndex(session => session.refreshToken === refreshToken)
    if(index > -1) Sessions.splice(index,1) // detele refeshtoken on server side

    res.clearCookie('refreshToken') // delete refreshToken on client side

    res.json({message: "đăng xuất thành công"})
}
export const refreshToken = (req: Request, res: Response) : Response | void => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) return res.status(401).json({message: "refreshToken không tồn tại"})
    
    const session = Sessions.find(s => s.refreshToken === refreshToken)
    //*
    if(!session) return res.status(403).json({message: "token không hợp lệ "})    

    jwt.verify(refreshToken, REFRESH_KEY as string, (err: jwt.VerifyErrors | null, user: any /* JwtPayload | undefined */) => {
        if(err) return res.status(403).json({message: "refreshToken hết hạn"})
            
        const newAccessToken = jwt.sign({username: user?.username},ACCESS_KEY,{expiresIn: '10m'})
        res.json({accessToken: newAccessToken})    
    
    })

}

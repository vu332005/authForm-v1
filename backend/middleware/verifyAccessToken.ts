import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv"

dotenv.config()

const ACCESS_KEY = process.env.ACCESS_KEY
if(!ACCESS_KEY){
    throw new Error ("thiếu ACCESS_KEY")
}

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // nếu authHeader tồn tại -> chạy vế sau và lấy accesToken

    if(!token) return res.status(401).json({message: "chưa đăng nhập"})

    jwt.verify(token, ACCESS_KEY as string, (err: jwt.VerifyErrors | null, user: any) => {
        if(err) return res.status(403).json({message: "token không hợp lệ hoặc hết hạn"});
        (req as any).user = user;
        // vì ts không biết req có thuộc tính user -> ta phải ép tạm kiểu về any thì gán được
        /*
        note:
        - trong mdw thì ta truyền về req chứ không phải res
        - vì xử lý mdw1 -> mdw2 -> mdw... -> controller 
            -> để các hàm sau dùng được dữ liệu đã xử lý -> ta cần gắn vào req
        - dữ liệu gửi cho client thì mới gắn vào res
        */
    next()        
    })
}

export default verifyAccessToken
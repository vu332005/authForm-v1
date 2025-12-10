import { Response, Request } from "express"
import { Users } from "../db/db"
export const authMe = (req: Request, res: Response) :  Response | void => {
    const username = (req as any).user?.username;

    if (!username) return res.status(401).json({ message: "Không có user trong request" });

    const user = Users.find(u => u.username === username);

    if (!user) return res.status(404).json({ message: "User không tìm thấy" });

    return res.json({ user });
}
import { users,sessions, REFRESH_KEY, ACCESS_KEY } from '../db/db.js';
 
export const authMe = (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    res.json({ user });
}
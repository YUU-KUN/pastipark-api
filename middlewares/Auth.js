import User from "../models/User.js";
import jwt from 'jsonwebtoken'

export const verifyUser = async (req, res, next) => {
    
    try {
        const token = req.headers['x-access-token'] || req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
        if (!token) return res.status(403).json({ message: "No Token Provided" });

        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
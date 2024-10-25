// Desc: Middleware to verify the token and authenticate the user
import jwt from "jsonwebtoken";

export default function auth(req, res, next){
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).send("Access Denied. No token provided.");

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
}
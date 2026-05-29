import { cleakCilent } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    if (!req.auth.userId) {
        res.status(401).json({ message: "Unauthorized - ban can dang nhap" });
        return;
    } 
        next();
    };

    export const requireAdmin = async (req, res, next) => {
        try{
            const currentUser = await cleakCilent.users.getUser(req.auth.userId);
            const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
            if (!isAdmin) {
                res.status(403).json({ message: "Forbidden - ban khong co quyen truy cap" });
                return;
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
            
        }
    };
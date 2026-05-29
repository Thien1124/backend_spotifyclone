import { User } from "../models/User.model.js"; 

export const authCallback = async (req, res) => async(req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;
        // kiem tra xem user da ton tai chua
        const user = await User.findOne({ clerkId: id });
        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl,
            });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error", error);
        next(error);
    }
};
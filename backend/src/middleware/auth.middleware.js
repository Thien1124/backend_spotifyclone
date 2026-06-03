import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    try {
        // KIỂM TRA & GIẢI MÃ: Nếu req.auth là Hàm thì thực thi hàm req.auth(), ngược lại lấy trực tiếp object req.auth
        const authData = typeof req.auth === "function" ? req.auth() : req.auth;

        // Log ra terminal để bạn dễ dàng theo dõi quá trình chạy thực tế
        // console.log("1. Token Frontend gửi lên:", req.headers.authorization);
        // console.log("2. Dữ liệu sau khi giải mã (authData):", authData);

        // Kiểm tra xem userId có tồn tại trong dữ liệu đã giải mã hay không
        if (!authData || !authData.userId) {
            res.status(401).json({ message: "Unauthorized - bạn cần đăng nhập" });
            return;
        }

        // Lưu dữ liệu đã giải mã vào req.authData để truyền tiếp sang middleware requireAdmin phía dưới
        req.authData = authData;
        next();
    } catch (error) {
        // console.log("Lỗi trong protectRoute middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const requireAdmin = async (req, res, next) => {
    try {
        // Lấy thông tin giải mã từ middleware protectRoute truyền sang, hoặc tự giải mã lại nếu cần
        const authData = req.authData || (typeof req.auth === "function" ? req.auth() : req.auth);
        
        if (!authData || !authData.userId) {
            res.status(401).json({ message: "Unauthorized - bạn cần đăng nhập" });
            return;
        }

        // Lấy thông tin user chi tiết từ Clerk API dựa trên userId
        const currentUser = await clerkClient.users.getUser(authData.userId);
        
        // Đối chiếu email đăng nhập với biến môi trường ADMIN_EMAIL
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
        
        if (!isAdmin) {
            res.status(403).json({ message: "Forbidden - bạn không có quyền truy cập" });
            return;
        }

        next();
    } catch (error) {
        // console.log("Lỗi trong requireAdmin middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

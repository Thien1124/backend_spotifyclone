import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });
    const userSockets = new Map(); // Map để lưu trữ userId và socketId
    const userActivities = new Map(); // Map để lưu trữ userId và thời gian hoạt động cuối cùng

    io.on("connection", (socket) => {
        socket.on("user da ket noi", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");
            // Lắng nghe sự kiện "user da ket noi" từ client và lưu trữ userId và socketId
            io.emit("user da ket noi", userId);
            socket.emit("user da online", Array.from(userSockets.keys()));
            io.emit("cac hoat dong", Array.from(userSockets.entries()));
        });
        socket.on("cap nhat hoat dong", ({ userId, activity }) => {
            console.log("cap nhat hoat dong", userId, activity);
            userActivities.set(userId, activity);
            io.emit("cac hoat dong da duoc cap nhat", userId, activity);
        });
        socket.on("gui tin nhan", async (data) => {
            try {
                const { senderId, receiverId, content } = data;
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                });
                const receiverSocketId = userSockets.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("nhan tin nhan", message);
                }
                socket.emit("gui tin nhan thanh cong", message);
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
                socket.emit("gui tin nhan that bai", { error: "Failed to send message" });
            }
        });
        socket.on("ngat ket noi", () => {
            let disconnectedUserId;
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSockets.delete(userId);
                    userActivities.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                io.emit("user da ngat ket noi", disconnectedUserId);
            }
        });
    });
    return io;
};
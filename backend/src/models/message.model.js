import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true //ClerkID user ID
        },
        receiverId: {
            type: String,
            required: true, //ClerkID user ID
        },
        content: {
            type: String,
            required: true,
    },

}, { timestamps: true }); //createAt, updateAt

export const Message = mongoose.model("Message", messageSchema);
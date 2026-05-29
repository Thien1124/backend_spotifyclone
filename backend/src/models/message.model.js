import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            required: true //ClerkID user ID
        },
        receiverID: {
            type: String,
            required: true, //ClerkID user ID
        },
        content: {
            type: String,
            required: true,
    },

}, { timestamps: true }); //createAt, updateAt

export const Message = mongoose.model("Message", messageSchema);
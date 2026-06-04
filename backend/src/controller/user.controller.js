import { User } from '../models/user.model.js'
import { Message } from '../models/message.model.js'

export const getAllUsers = async (req, res, next) => {
  try {
    // 1. Giải mã auth object đúng chuẩn của Clerk SDK mới
    const authObj = typeof req.auth === 'function' ? req.auth() : req.auth
    const CurrentUserId = authObj.userId

    // 2. Lọc bỏ user hiện tại
    const users = await User.find({ clerkId: { $ne: CurrentUserId } })
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}

export const getMessages = async (req, res, next) => {
  try {
    // 1. Giải mã auth object để lấy myId
    const authObj = typeof req.auth === 'function' ? req.auth() : req.auth
    const myId = authObj.userId

    const { userId } = req.params

    // 2. Tìm kiếm tin nhắn
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (err) {
    next(err)
  }
}
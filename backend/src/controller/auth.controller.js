import { User } from '../models/user.model.js'

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body

    // Kiểm tra user tồn tại dựa trên clerkId
    let user = await User.findOne({ clerkId: id })

    if (!user) {
      // Phải ghi đúng tên trường là clerkId để khớp với lệnh tìm kiếm getAllUsers
      user = await User.create({
        clerkId: id,
        fullname: `${firstName || ''} ${lastName || ''}`.trim(),
        imageUrl
      })
    }

    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

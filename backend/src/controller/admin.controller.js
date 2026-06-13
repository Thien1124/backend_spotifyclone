import { Song } from '../models/song.model.js'
import { Album } from '../models/album.model.js'
import cloudinary from '../lib/cloudinary.js'
//func upload file len cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'auto',
      folder: 'My_spotify'
    })
    return result.secure_url
  } catch (error) {
    // console.log('Loi upload len cloudinary', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: 'Can upload tat ca file' })
    }
    const { title, artist, albumId, duration } = req.body
    const audioFile = req.files.audioFile
    const imageFile = req.files.imageFile

    const audioUrl = await uploadToCloudinary(audioFile)
    const imageUrl = await uploadToCloudinary(imageFile)

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumID: albumId || null
    })

    await song.save()
    // neu bai hat thuoc ve 1 album, thi se cap nhat vao album do
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id }
      })
    }
    res.status(201).json({ message: 'Tao thanh cong', song })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params

    const song = await Song.findById(id)

    if (song?.albumID) {
      await Album.findByIdAndUpdate(song.albumID, {
        $pull: { songs: song._id }
      })
    }
    await Song.findByIdAndDelete(id)

    res.status(200).json({ message: 'Xoa thanh cong' })
  } catch (error) {
    // console.log('Loi khi xoa bai hat', error)
    next(error)
  }
}
export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body
    const { imageFile } = req.files

    const imageUrl = await uploadToCloudinary(imageFile)

    const album = new Album({
      title,
      artist,
      releaseYear,
      imageUrl
    })
    await album.save()

    res.status(201).json({ message: 'Tao album thanh cong', album })
  } catch (error) {
    // console.log('Loi khi tao album', error)
    next(error)
  }
}
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params
    await Song.deleteMany({ albumID: id })
    await Album.findByIdAndDelete(id)
    res.status(200).json({ message: 'Xoa album thanh cong' })
  } catch (error) {
    // console.log('Loi khi xoa album', error)
    next(error)
  }
}
export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true })
}

import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload'
import path from 'path'

import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import adminRoutes from './routes/admin.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statsRoutes from './routes/stat.route.js'
import { createServer } from 'http'
import { initializeSocket } from './lib/socket.js'
import cors from 'cors'
import dns from 'node:dns'
import cron from 'node-cron'
import fs from 'fs'

dns.setServers(['1.1.1.1', '1.0.0.1'])

dotenv.config()

const app = express()
const __dirname = path.resolve()
const PORT = process.env.PORT || 3000

const httpServer = createServer(app) // Tạo HTTP server từ Express app
initializeSocket(httpServer) // Khởi tạo Socket

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

app.use(express.json()) // to parse req.body
app.use(clerkMiddleware()) // this will add auth to req obj => req.auth
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB  max file size
    }
  })
)

// cron jobs
const tempDir = path.join(process.cwd(), "tmp")
cron.schedule('0 * * * *', () => {
	if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log('error', err)
        return
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {})
      }
    })
  }
})

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/songs', songRoutes)
app.use('/api/albums', albumRoutes)
app.use('/api/stats', statsRoutes)

// ĐOẠN CODE MỚI (BỎ HOÀN TOÀN CHUỖI ĐỊNH TUYẾN PHÍA TRƯỚC):
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  // Sử dụng app.use không truyền path string để bỏ qua bộ parse lỗi
  app.use((req, res, next) => {
    // Chỉ can thiệp vào các request chuyển trang (GET), không chặn các phương thức khác
    if (req.method === 'GET' && !req.url.startsWith('/api')) {
      return res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    }
    next()
  })
}

//error handle
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({
      message:
        process.env.NODE_ENV === 'production'
          ? err.message
          : 'Internal Server Error'
    })
})
httpServer.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
  connectDB()
})

// socket.io

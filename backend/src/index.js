import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statsRoutes from './routes/stat.route.js';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket.js';
import cors from 'cors';
import dns from 'node:dns'

dns.setServers(['1.1.1.1', '1.0.0.1'])

dotenv.config();

console.log(
  'Check Clerk Key:',
  process.env.CLERK_SECRET_KEY ? 'ĐÃ CÓ KEY' : 'BỊ THIẾU KEY!!!'
)

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app); // Tạo HTTP server từ Express app
initializeSocket(httpServer); // Khởi tạo Socket

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB  max file size
		},
	})
);

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statsRoutes);

//error handle
app.use((err, req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? err.message : "Internal Server Error"});
})
httpServer.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});

// socket.io


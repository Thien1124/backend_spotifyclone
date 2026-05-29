import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import { cleakMiddleware } from '@cleak/express';
import fileUpload from 'express-fileupload';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statsRoutes from './routes/stat.route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cleakMiddleware()); // se them auth den to req obj => req.auth
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limit:{
        fileSize : 10 * 1024 * 1024, // 10MB file toi da
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
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});

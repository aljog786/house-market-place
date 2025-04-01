// hmp-main/backend/server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 8800;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend to connect
    credentials: true,
}));

// Initialize sessions (use a secure secret in production)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/auth', otpRoutes);
app.use('/buildings', buildingRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    // Any route that is not API will be redirected to index.html
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => { 
        res.send('API running ...');
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

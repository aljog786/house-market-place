import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
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
  

// API Routes
app.use('/buildings', buildingRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname,'/frontend/build')));

    // any route that is not api will be redirected to index.html
    app.get('*',(req,res) =>
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html')) 
    );
} else {
    app.get('/',(req,res) => { 
        res.send('API running ...');
    })
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

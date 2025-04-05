import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import Chat from './models/chat.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 8800;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/auth', otpRoutes);
app.use('/buildings', buildingRoutes);
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinRoom', async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  
    try {
      const chat = await Chat.findOne({ building: room })
        .populate('messages.sender', 'name')
        .populate('messages.receiver', 'name');
  
      socket.emit('previousMessages', chat ? chat.messages : []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  });
  
  socket.on('sendMessage', async (data) => {
    const { sender, receiver, text } = data;
    try {
      // Find an existing chat where both sender and receiver are participants
      let chat = await Chat.findOne({
        participants: { $all: [sender, receiver] }
      });
  
      // Create a new chat if none exists
      if (!chat) {
        chat = new Chat({ participants: [sender, receiver] });
      }
      
      // Push the new message to the messages array
      const newMessage = {
        sender,
        receiver,
        text,
        time: new Date(),
      };
      chat.messages.push(newMessage);
      
      // Save the updated chat document to MongoDB
      await chat.save();
      
      // Emit the new message to the connected clients (if needed)
      io.to(data.room).emit('message', data);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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
import paymentRoutes from "./routes/paymentRoutes.js";
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

app.use("/payments", paymentRoutes);

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
  socket.on('joinRoom', async (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined room ${chatId}`);

    try {
      const chat = await Chat.findById(chatId)
        .populate('messages.sender', 'name')
        .populate('messages.receiver', 'name');

      socket.emit('previousMessages', chat ? chat.messages : []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  });

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, text, chatId } = data;  // We'll pass chatId from front-end
    try {
      let chat = await Chat.findById(chatId);
      if (!chat) {
        chat = new Chat({ 
          building: data.buildingId, 
          participants: [sender, receiver] 
        });
      }

      const newMessage = {
        sender,
        receiver,
        text,
        time: new Date(),
      };
      chat.messages.push(newMessage);

      await chat.save();

      io.to(chatId).emit('message', {
        ...data,
        time: newMessage.time 
      });
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

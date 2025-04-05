import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;

import Chat from '../models/chat.js';
export const getChats = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const chats = await Chat.find({ participants: userId })
        .populate('building', 'name regularPrice discountedPrice type')
        .populate('participants', 'name')
        .populate('messages.sender', 'name')
        .populate('messages.receiver', 'name')
        .exec();
  
      res.json(chats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error fetching chats' });
    }
  };
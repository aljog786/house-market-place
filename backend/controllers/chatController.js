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

export const createOrGetChat = async (req, res) => {
  try {
    const { buildingId, currentUserId, ownerId } = req.body;

    let chat = await Chat.findOne({
      building: buildingId,
      participants: { $all: [currentUserId, ownerId] }
    })
      .populate('building', 'name regularPrice discountedPrice type')
      .populate('participants', 'name')
      .populate('messages.sender', 'name')
      .populate('messages.receiver', 'name');

    if (!chat) {
      chat = new Chat({
        building: buildingId,
        participants: [currentUserId, ownerId],
        messages: []
      });
      await chat.save();
      await chat.populate('building', 'name regularPrice discountedPrice type');
      await chat.populate('participants', 'name');
    }

    return res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating or fetching chat' });
  }
};

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getChats, createOrGetChat } from '../controllers/chatController.js';

const router = express.Router();

router.route('/').get(protect, getChats);
router.route('/createOrGetChat').post(protect, createOrGetChat);

export default router;

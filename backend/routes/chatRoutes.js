import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getChats } from '../controllers/chatController.js';

const router = express.Router();

router.route('/').get(protect, getChats);

export default router;

import express from 'express';
const router = express.Router();

import { getAllUsers, getUserById,authUser,getUserProfile,logoutUser, registerUser } from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect,getAllUsers).post(registerUser);
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect,getUserProfile);
router.route('/:id').get(protect,getUserById);

export default router;

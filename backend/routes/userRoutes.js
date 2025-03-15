import express from 'express';
const router = express.Router();

import { getAllUsers, getUserById,authUser,getUserProfile,logoutUser } from '../controllers/userController.js';

import { protect,admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect,admin,getAllUsers);
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect,getUserProfile);
router.route('/:id').get(protect,admin,getUserById);

export default router;

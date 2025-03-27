import express from 'express';
const router = express.Router();

import { getAllUsers, getUserFavorites,getUserById,authUser,getUserProfile,logoutUser, registerUser,addFavorite,removeFavorite } from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect,getAllUsers).post(registerUser);
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect,getUserProfile);
router.route('/:id').get(protect,getUserById);

router.route('/:id/favorites').get(protect, getUserFavorites);
router.post('/:id/favorites/:buildingId', protect, addFavorite);
router.delete('/:id/favorites/:buildingId', protect, removeFavorite);

export default router;

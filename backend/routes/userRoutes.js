import express from 'express';
const router = express.Router();
import { getAllUsers, getUserFavorites,getUserAvatar,uploadProfilePicture,getUserById,authUser,getUserProfile,updateUserProfile,logoutUser, registerUser,addFavorite,removeFavorite,getUserCart,addToCart,removeFromCart } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect,getAllUsers).post(registerUser);
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect,getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(protect,getUserById);

router.get('/:id/avatar', protect, getUserAvatar);
router.post('/profile/upload-avatar', protect, uploadProfilePicture);

router.route('/:id/favorites').get(protect, getUserFavorites);
router.post('/:id/favorites/:buildingId', protect, addFavorite);
router.delete('/:id/favorites/:buildingId', protect, removeFavorite);

router.route('/:id/cart').get(protect, getUserCart);
router.post('/:id/cart/:buildingId', protect, addToCart);
router.delete('/:id/cart/:buildingId', protect, removeFromCart);


export default router;

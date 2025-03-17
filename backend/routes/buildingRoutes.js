import express from 'express';
import { getAllBuildings, getBuildingById, createBuilding } from '../controllers/buildingController.js';
import { protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

router.route('/:id').get(checkObjectId,getBuildingById);
router.route('/').get(getAllBuildings).post(protect,createBuilding);

export default router;

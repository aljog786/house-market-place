import express from 'express';
import { getAllBuildings, getBuildingById, createBuilding, updateBuilding,deleteBuilding } from '../controllers/buildingController.js';
import { protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

router
  .route("/:id")
  .get(checkObjectId, getBuildingById)
  .put(protect, checkObjectId, updateBuilding)
  .delete(protect, deleteBuilding);
  
router.route('/').get(getAllBuildings).post(protect,createBuilding);

export default router;

import Building from '../models/building.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getAllBuildings = asyncHandler(async (req, res, next) => {
    try {
        const buildings = await Building.find().populate('userRef');
        res.json(buildings);
    } catch (error) {
        next(error);
    }
});

export const getBuildingById = asyncHandler(async (req, res) => {
    const building = await Building.findById(req.params.id).populate('userRef');

    if (building) {
        return res.json(building);
    } else {
        res.status(404);
        throw new Error('Building not found');
    }
});

export const createBuilding = asyncHandler(async (req, res) => {
    const { name, type, rooms, toilets, parking, furnished, offer, regularPrice, discountedPrice, address, imageUrls } = req.body;

    console.log( req.body);

    if (!imageUrls || imageUrls.length === 0) {
        res.status(400);
        throw new Error("At least one image is required");
    }

    const building = new Building({
        userRef: req.user._id,
        name,
        type,
        rooms,
        toilets,
        parking,
        furnished,
        offer,
        regularPrice,
        discountedPrice,
        address,
        imageUrls
    });
    console.log('backend building:', building);
    const createdBuilding = await building.save();
    res.status(201).json(createdBuilding);
});

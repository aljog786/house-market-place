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

export const updateBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findById(req.params.id);

  if (!building) {
    res.status(404);
    throw new Error("Building not found");
  }

  if (building.userRef.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this building");
  }

  const {
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
    imageUrls,
  } = req.body;

  building.name = name || building.name;
  building.type = type || building.type;
  building.rooms = rooms || building.rooms;
  building.toilets = toilets || building.toilets;
  building.parking = typeof parking === "boolean" ? parking : building.parking;
  building.furnished =
    typeof furnished === "boolean" ? furnished : building.furnished;
  building.offer = typeof offer === "boolean" ? offer : building.offer;
  building.regularPrice = regularPrice || building.regularPrice;
  building.discountedPrice = offer ? discountedPrice : building.discountedPrice;
  building.address = address || building.address;
  building.imageUrls = imageUrls || building.imageUrls;

  const updatedBuilding = await building.save();
  res.json(updatedBuilding);
});

export const deleteBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findById(req.params.id).populate("userRef");
  if (building) {
    await building.deleteOne();
    res.json({ message: "Building removed" });
  } else {
    res.status(404);
    throw new Error("Building not found");
  }
});
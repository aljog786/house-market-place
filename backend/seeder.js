import dotenv from "dotenv";
dotenv.config();
import Building from "./models/building.js";
import buildings from "./data/buildings.js";
import connectDB from "./config/db.js";


connectDB();

const importData = async () => {
  try {
    await Building.deleteMany();
    await Building.insertMany(buildings);
    console.log('Data Imported');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
importData();


import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['rent', 'sale'],
    required: true,
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  toilets: {
    type: Number,
    required: true,
  },
  parking: {
    type: Boolean,
    required: true,
  },
  furnished: {
    type: Boolean,
    required: true,
  },
  offer: {
    type: Boolean,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  }
},{
  timestamps: true
}
);

const Building = mongoose.model('Building', buildingSchema);

export default Building;

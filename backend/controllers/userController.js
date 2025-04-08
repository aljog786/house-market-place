import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved to "uploads" folder.
  },
  filename(req, file, cb) {
    // Prefix the file name with "profile" followed by a timestamp.
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter to allow only specific image types.
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

// Create a multer instance with the defined storage and fileFilter.
const upload = multer({ storage, fileFilter });

const uploadProfilePicture = asyncHandler((req, res) => {
  const uploadSingleImage = upload.single('profilePic');

  uploadSingleImage(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Find the user first
    const user = await User.findById(req.user._id);
    if (!user) {
      // clean up the just-uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. If they already had an avatar, delete the old file
    if (user.avatar) {
      try {
        // user.avatar is something like "http://host/uploads/profile-123.jpg"
        const oldFilename = path.basename(user.avatar);
        const oldFilePath = path.join('uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (unlinkErr) {
        console.error('Failed to delete old avatar:', unlinkErr);
        // not fatal—continue on
      }
    }

    // 3. Build the new avatar URL and save it
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      avatar: avatarUrl,
      user,
    });
  });
});

const getUserAvatar = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid user ID');
    }
  
    const user = await User.findById(id);
    if (user) {
      res.json({ avatar: user.avatar });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            favorites: user.favorites,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const authUser = asyncHandler(async (req,res) => {
    const { email,password } = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        }); 
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

 const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

 const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

const getUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }) 
    } else {
        res.status(404);
        throw new Error('User not found'); 
    }
})

const logoutUser = asyncHandler(async (req,res) => {
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: 'Logged out successfully'});
})
const getUserFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('favorites');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user.favorites);
});
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const addFavorite = asyncHandler(async (req, res) => {
    const { id, buildingId } = req.params;
    console.log("User ID:", id);
console.log("Building ID:", buildingId);
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
        res.status(400);
        throw new Error('Invalid building ID');
    }
    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (!user.favorites.includes(buildingId)) {
        user.favorites.push(buildingId);
        await user.save();
    }
    res.json({ message: 'Building added to favorites', favorites: user.favorites });
});

const removeFavorite = asyncHandler(async (req, res) => {
    const { id, buildingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
        res.status(400);
        throw new Error('Invalid building ID');
    }

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    try {
        user.favorites = user.favorites.filter((favId) => favId.toString() !== buildingId);
        await user.save();
        res.json({ message: 'Building removed from favorites', favorites: user.favorites });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Server error while removing favorite", error: error.message });
    }
});
const getUserCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate('cart');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user.cart);
});

const addToCart = asyncHandler(async (req, res) => {
    const { id, buildingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
        res.status(400);
        throw new Error('Invalid building ID');
    }

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.cart.includes(buildingId)) {
        user.cart.push(buildingId);
        await user.save();
    }

    res.json({ message: 'Building added to cart', cart: user.cart });
});
const removeFromCart = asyncHandler(async (req, res) => {
    const { id, buildingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
        res.status(400);
        throw new Error('Invalid building ID');
    }

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.cart = user.cart.filter((item) => item.toString() !== buildingId);
    await user.save();

    res.json({ message: 'Building removed from cart', cart: user.cart });
});


export { getUserCart,addToCart,getUserAvatar,removeFromCart,registerUser, authUser, getAllUsers, getUserById, getUserProfile, updateUserProfile,logoutUser, getUserFavorites,addFavorite,removeFavorite,uploadProfilePicture };
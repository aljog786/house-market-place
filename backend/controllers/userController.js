import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req,res) => {
    const { email,password } = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        
        generateToken(res,user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      })  
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

        // Validate if `id` is a valid ObjectId
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

export { authUser,getAllUsers,getUserById,getUserProfile,logoutUser }

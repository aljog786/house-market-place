import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
    type: String,
    default: '' 
   },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    favorites: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Building',
  default: []
}],
cart: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Building',
  default: []
}]
},
{
    timestamps: true
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Encrypt password using bcrypt
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  const User = mongoose.model('User', userSchema);
  
  export default User;
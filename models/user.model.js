import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
    },
    number: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true, // Ensure uniqueness
    },
    password: {
        type: String,
        required: true,
    },
   loyaltycard_no:{
    type:String,
   },

    verified: {
        type: Boolean,
        default: false,
    },
    verificationcode: {
        type: String,
    },
    forgetpasswordotp: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ShoppingItem',
        },
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    
}, { timestamps: true });

 
 

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateaccesstoken=function(){
  return  jwt.sign({id:this._id,role:this.role,email:this.email,fullname:this.fullname,loyaltycard_no:this.loyaltycard_no},process.env.JWT_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}


export const User = mongoose.model('User', userSchema);

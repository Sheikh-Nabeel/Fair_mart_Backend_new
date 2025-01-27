import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    // name: {
    //     type: String,
    //     required: true,
    //     lowercase: true,
    // },
    // number: {
    //     type: Number,
    //     required: true,
    // },
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
}, { timestamps: true });

 
 

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);

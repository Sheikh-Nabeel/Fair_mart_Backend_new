import { User } from "../models/user.model.js";
import { ShoppingItem } from "../models/shoppingitem.model.js";
import { Order } from "../models/orders.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/responsehandler.js";
import { apierror } from "../utils/apierror.js";
 
import path from "path";
import fs from "fs";
// import { sendemailverification } from "../middelwares/Email.js";
 
const delunverifiedusers=asynchandler(async(req,res)=>{

    const users=await User.deleteMany({verified:false})
    if (users) {
        return res.json({users_deleted:users})
    }else{
        return res.json({message:"no users to delete"})
    }


})

const generateaccestoken=async(userid)=>{
try {
    const user=await User.findById(userid)
    const accesstoken=await user.generateaccesstoken()

    await user.save()
    return {accesstoken}
} catch (error) {
    throw new apierror(500,"Error generating token")
}
}
 
let registeruser = asynchandler(async (req, res) => {
    console.log("Register route hit");
    const { email, password,fullname,number,type,bussinesname,bussinesaddress,verified } = req.body;
    const profile=req.file

    // Validate input fields
    if ( !email || !password ||!fullname || !number) {
        throw new apierror(400, "All fields are required");
    }

    // Check for existing email
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
        if (!existedEmail.verified) {
            return res.status(401).json({ message: "Email already exists and user is not verified" });
        } else {
            return res.status(401).json({ message: "Email already exists, please proceed to login" });
        }
    }

    // const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    let user;
    try {
        // Create the user without customer ID initially
        user = await User.create({
            profile:profile.filename,
            email,
            password,
            fullname,
            number:parseInt(number),
            type,
            bussinesname,
            bussinesaddress,
            verified
             
        });
 

       

        
        // await sendemailverification(user.email, user.verificationcode);
        await user.save();
        let created_user=await User.findById(user._id).select('-password')

        return res.status(200).json({ message: "Signed up successfully", user:created_user });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

const resendotp = asynchandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (user.verified) {
        return res.json({ message: "Already verified, please login" });
    } else {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationcode = verificationCode;
        await user.save();

        await sendemailverification(user.email, user.verificationcode);

        return res.json({ message: "Verify using the OTP sent to your email", otp: user.verificationcode });
    }
});

const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new apierror(400, "Email is required");
    }

    const user = await User.findOne({ email: email });
    if (user && !user.verified) {
        return res.status(401).json({ message: "Please verify your account" });
        
    }

    if (!user) {
        throw new apierror(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apierror(404, "Password is not valid");
    }
const options={
    httpOnly:true,
    secure:true
}
    const {accesstoken}=await generateaccestoken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password");
    if (loggedInUser) {
        return res
        .status(200)
        .cookie('accesstoken',accesstoken,options)
        .json(new apiresponse(200, {loggedInUser,token:accesstoken}));
    } else {
        return res.json({ message: "User is not verified" });
    }
});

const verifyemail = asynchandler(async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({ verificationcode: code });
        if (!user) {
            throw new apierror(404, "Invalid or expired code");
        } else {
            user.verified = true;
            user.verificationcode = undefined; // Clear the verification code
            await user.save();
            const verifiedUser = await User.findById(user._id).select('-password');
            return res.json(new apiresponse(200, verifiedUser, "Verified user"));
        }
    } catch (error) {
        console.error("Verification code error:", error);
        return res.status(500).json({ message: "Error verifying code" });
    }
});

 
 

const forgotpassword = asynchandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
        const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();
        user.forgetpasswordotp = verificationcode;
        await user.save();
        await sendemailverification(user.email, user.forgetpasswordotp);

        res.status(200).json({ message: "Please verify the OTP we have sent to your email",otp:user.forgetpasswordotp });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

const verifyforgetpassotp = asynchandler(async (req, res) => {
    const { otp, newpassword } = req.body;

    const user = await User.findOne({ forgetpasswordotp: otp });

    if (user) {
        user.password = newpassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } else {
        res.status(401).json({ message: "Please provide a valid OTP" });
    }
});

const updateprofile = asynchandler(async(req, res) => {
    const { id, fullname, email, number, type, bussinesname, bussinesaddress, password } = req.body;
    const profile = req.file;
    
    // Determine which user ID to use
    let userId;
    
    // If an ID is provided in the request body and the current user is an admin, use that ID
    if (id) {
        userId = id;
    } else {
        // Otherwise, use the ID of the currently logged-in user
        userId = req.user.id;
    }
    
    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }
    
    // Create update data object with only the fields that are provided
    let updateData = {};
    
    // Only add fields to updateData if they are provided in the request
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (number) updateData.number = parseInt(number);
    if (type) updateData.type = type;
    if (bussinesname) updateData.bussinesname = bussinesname;
    if (bussinesaddress) updateData.bussinesaddress = bussinesaddress;
    if (password) updateData.password = password;
    
    // Handle profile image update if a new image is provided
    if (profile) {
        // Delete the old image if it exists
        if (user.profile) {
            const oldImagePath = path.join(process.cwd(), "public", user.profile);
            try {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log("Old profile image deleted successfully:", oldImagePath);
                } else {
                    console.log("Old profile image file not found:", oldImagePath);
                }
            } catch (error) {
                console.error("Error deleting old profile image:", error);
            }
        }
        updateData.profile = profile.filename;
    }
    
    // If no fields were provided to update, return the existing user
    if (Object.keys(updateData).length === 0 && !profile) {
        return res.status(200).json({ 
            success: true,
            message: "No changes provided",
            user: user 
        });
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        ).select("-password");
        
        return res.status(200).json({ 
            success: true,
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        // If database operation fails and a new image was uploaded, delete it
        if (profile) {
            const imagePath = path.join(process.cwd(), "public", profile.filename);
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log("New profile image deleted after failed update:", imagePath);
                }
            } catch (deleteError) {
                console.error("Error deleting new profile image after failed update:", deleteError);
            }
        }
        
        return res.status(500).json({ 
            success: false,
            message: "Error updating profile", 
            error: error.message 
        });
    }
});

const getallusers=asynchandler(async(req,res)=>{
const users= await User.find({})

res.json({users:users})
})
const deleteuser=asynchandler(async(req,res)=>{
    const {id}=req.body

    const deleteduser=await User.findByIdAndDelete(id)

    if (deleteduser) {
        res.json({mesaage:"user deleted Successfully",
            user:deleteduser
        })
    }
})
export const logout=asynchandler(async(req,res)=>{
    const options = {
        httpOnly: true,
        secure: true,
        samesite: 'none',
        path:'/'
    }
    res.clearCookie('accesstoken',options)
    res.json({message:"logged out successfully"})
})

export const verifyuser=asynchandler(async(req,res)=>{
    const {id}=req.params

    const user=await User.findById(id)
    if (user) {
        user.verified=true
        await user.save()
        res.json({message:"User verified successfully"})
    }
    else{
        res.json({message:"User not found"})
    }
    
})

export const addloyaltypoints = asynchandler(async (req, res) => {
    const { points } = req.body;

    const user = await User.findById(req.user.id);
    if (user) {
        user.loyalty_points += points;
        await user.save();
        res.json({message:"Loyalty points added successfully",user:user});
    }
    else{
        res.json({message:"User not found"})
    }
})

export const redeemloyaltypoints = asynchandler(async (req, res) => {
    const { points } = req.body;

    const user = await User.findById(req.user.id);
    if (user) {
        user.loyalty_points -= points;
        await user.save();
        res.json({message:"Loyalty points redeemed successfully",user:user});
    }
    else{
        res.json({message:"User not found"})
    }
})

export const addtofavourites=asynchandler(async(req,res)=>{
    const {productid}=req.body
    const product=await ShoppingItem.findById(productid)
    if (!product) {
        throw new apierror(404, "Product not found");
    }

    const user=await User.findById(req.user.id)
    user.favorites.push(productid)
    await user.save()
    res.json({message:"Product added to favourites",user:user})

})

export const removefromfavourites=asynchandler(async(req,res)=>{
    const {productid}=req.body
    const product=await ShoppingItem.findById(productid)
    const user=await User.findById(req.user.id)
    if (!product) {
        throw new apierror(404, "Product not found");
    }
    user.favorites=user.favorites.filter(id=>id.toString()!==productid)
    await user.save()
    res.json({message:"Product removed from favorites",user:user})
})

export const getfavourites=asynchandler(async(req,res)=>{
    const user=await User.findById(req.user.id)
    const favorites=await ShoppingItem.find({_id:{$in:user.favorites}})

    res.json({favorites:favorites})
})

export const addtoorderhistory=asynchandler(async(req,res)=>{
    const {orderid}=req.body
    const order=await Order.findById(orderid)
    if (!order) {
        throw new apierror(404, "Order not found");
    }
    user.orderhistory.push(orderid)
    await user.save()
    res.json({message:"Order added to order history",user:user})
})

export const getorderhistory=asynchandler(async(req,res)=>{
    const user=await User.findById(req.user.id)
    const orderhistory=await Order.find({_id:{$in:user.orderhistory}}).populate('products.product')
    res.json({orderhistory:orderhistory})
})

 

export { registeruser, verifyemail, login, forgotpassword, verifyforgetpassotp, resendotp,delunverifiedusers,updateprofile,getallusers,deleteuser};

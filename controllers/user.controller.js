 import { User } from "../models/user.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/responsehandler.js";
import { apierror } from "../utils/apierror.js";
import { sendemailverification } from "../middelwares/Email.js";
 
const delunverifiedusers=asynchandler(async(req,res)=>{

    const users=await User.deleteMany({verified:false})
    if (users) {
        return res.json({users_deleted:users})
    }else{
        return res.json({message:"no users to delete"})
    }


})
 
let registeruser = asynchandler(async (req, res) => {
    console.log("Register route hit");
    const { email, password } = req.body;

    // Validate input fields
    if ( !email || !password ) {
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

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    let user;
    try {
        // Create the user without customer ID initially
        user = await User.create({
            
            email,
            password,
           
            verificationcode: verificationCode,
        });
 

       

        
        await sendemailverification(user.email, user.verificationcode);

        return res.status(200).json({ message: "Please verify your email", otp: user.verificationcode });
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

    if (!user) {
        throw new apierror(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apierror(404, "Password is not valid");
    }

    const loggedInUser = await User.findById(user._id).select("-password");
    if (loggedInUser.verified) {
        return res.json(new apiresponse(200, loggedInUser, "User verified successfully"));
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

const updateprofile=asynchandler(async(req,res)=>{
    const { id,name, email, password, number } = req.body;

 

 
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();


    let user;
    try {
        // Create the user without customer ID initially
        user = await User.findByIdAndUpdate(id,{
            name,
            email,
            password,
            number,
            verificationcode: verificationCode,
        },{new:true});
 

       

        
        await sendemailverification(user.email, user.verificationcode);

        return res.status(200).json({ message: "Please verify your email", otp: user.verificationcode });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
})

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

export { registeruser, verifyemail, login, forgotpassword, verifyforgetpassotp, resendotp,delunverifiedusers,updateprofile,getallusers,deleteuser};

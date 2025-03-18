import { Router } from "express";
import {  deleteuser,addloyaltypoints, redeemloyaltypoints,delunverifiedusers, forgotpassword, getallusers, login ,logout,registeruser, resendotp, updateprofile, verifyemail, verifyforgetpassotp, verifyuser } from "../controllers/user.controller.js";
import { verifyjwt } from "../middelwares/auth.middleware.js";
import {upload} from '../middelwares/multer.middelware.js'
const router=Router()

router.route('/signup').post(upload.single('profile'),registeruser)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/me').get(verifyjwt,(req,res)=>{
    res.json({user: req.user})
})
router.route('/verified/:id').post(verifyuser)
router.route('/verifyemail').post(verifyemail)
router.route('/forgetpassword').post(forgotpassword)
router.route('/verifyotp').post(verifyforgetpassotp)
router.route('/resendotp').post(resendotp)
router.route('/delunverifiedusers').delete(delunverifiedusers)
router.route('/updateprofile').post(updateprofile)
router.route('/getallusers').get(getallusers)
router.route('/deleteuser').post(deleteuser)
router.route('/addloyaltypoints').post(verifyjwt, addloyaltypoints)
router.route('/redeemloyaltypoints').post(verifyjwt, redeemloyaltypoints)

export default router
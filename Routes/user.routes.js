import { Router } from "express";
import {  deleteuser, delunverifiedusers, forgotpassword, getallusers, login ,registeruser, resendotp, updateprofile, verifyemail, verifyforgetpassotp } from "../controllers/user.controller.js";

const router=Router()

router.route('/signup').post(registeruser)
router.route('/login').post(login)
router.route('/verifyemail').post(verifyemail)
router.route('/forgetpassword').post(forgotpassword)
router.route('/verifyotp').post(verifyforgetpassotp)
router.route('/resendotp').post(resendotp)
router.route('/delunverifiedusers').delete(delunverifiedusers)
router.route('/updateprofile').post(updateprofile)
router.route('/getallusers').get(getallusers)
router.route('/deleteuser').post(deleteuser)
 

export default router
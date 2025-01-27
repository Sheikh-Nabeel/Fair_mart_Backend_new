import { Router } from "express";
import { createProfile,updateProfile,deleteProfile, getProfiles, getuserprofile, addapp, updateapp, deleteapp, getapps, sendrequest, acceptrequest, rejectrequest, deleteconnection, getpendingrequests, getacceptedrequests, getallprofiles, changepersonalstatus, getprofile } from "../controllers/profile.controller.js";
 
import { upload } from "../middelwares/multer.middelware.js";
 
const router=Router()


router.route('/register').post(upload.fields([
    {name:'social',maxCount:1},
    {name:'company',maxCount:1},
    {name:'personal',maxCount:1},
]),createProfile)
router.route('/update').post(upload.fields([
    {name:'social',maxCount:1},
    {name:'company',maxCount:1},
    {name:'personal',maxCount:1},
]),updateProfile)

router.route('/delete').delete(deleteProfile)
router.route('/').post(getProfiles)
router.route('/userprofile').post(getuserprofile)
router.route('/getallprofiles').get(getallprofiles)
router.route('/changepersonalstatus').post(changepersonalstatus)
router.route('/getprofile').post(getprofile)

//Apps
router.route('/addapp').post(addapp)
router.route('/updateapp').post(updateapp)
router.route('/deleteapp').delete(deleteapp)
router.route('/getapps').post(getapps)

//connections

router.route('/sendrequest').post(sendrequest)
router.route('/acceptrequest').post(acceptrequest)
router.route('/declinerequest').post(rejectrequest)
router.route('/deleteconnection').delete(deleteconnection)
router.route('/pendingrequests').post(getpendingrequests)
router.route('/getacceptedconnections').post(getacceptedrequests)

export default router
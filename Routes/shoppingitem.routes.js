import { Router } from "express";
import { addcolors, addimages, addshoppingitems, deletecolor, deleteimage, deleteshoppingitem, getshoppingitem, getshoppingitems } from "../controllers/shoppingitem.controller.js";
import { upload } from "../middelwares/multer.middelware.js";


const router=Router()

router.route('/additem').post(upload.single('csv'),addshoppingitems)
router.route('/').get(getshoppingitems)
router.route('/deleteitem/:id').delete(deleteshoppingitem)
router.route('/addimages').post(upload.array('images'),addimages)
router.route('/getitem').post(getshoppingitem)
router.route('/addcolors').post(upload.array('colors'),addcolors)
router.route('/deletecolor').delete(deletecolor)
router.route('/deleteimage/:id').delete(deleteimage)
export default router
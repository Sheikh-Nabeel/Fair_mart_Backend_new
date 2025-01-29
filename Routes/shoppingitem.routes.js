import { Router } from "express";
import { addimages, addshoppingitems, deleteshoppingitem, getshoppingitems } from "../controllers/shoppingitem.controller.js";
import { upload } from "../middelwares/multer.middelware.js";


const router=Router()

router.route('/additem').post(upload.single('csv'),addshoppingitems)
router.route('/').get(getshoppingitems)
router.route('/deleteitem/:id').delete(deleteshoppingitem)
router.route('/addimages').post(upload.array('images'),addimages)
export default router
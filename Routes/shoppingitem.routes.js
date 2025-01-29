import { Router } from "express";
import { addshoppingitems } from "../controllers/shoppingitem.controller.js";


const router=Router()

router.route('/additem').post(addshoppingitems)

export default router
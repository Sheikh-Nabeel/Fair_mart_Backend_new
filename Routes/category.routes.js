import { Router } from "express";
import { deletecategory, getallcategories, getcategory } from "../controllers/Category.controller.js";

const router = Router();

router.route('/').get(getallcategories);
router.route('/get/:id').get(getcategory)
router.route('/delete/:id').delete(deletecategory)

export default router;
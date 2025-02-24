import { Router } from "express";
import { getallcategories } from "../controllers/Category.controller.js";

const router = Router();

router.route('/').get(getallcategories);

export default router;
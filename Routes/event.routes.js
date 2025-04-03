import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import { upload } from "../middelwares/multer.middelware.js";

const router = Router();

router.post("/",upload.single("image"),createEvent);
router.get("/",getEvents);
router.get("/:id",getEventById);
router.put("/:id",upload.single("image"),updateEvent);
router.delete("/:id",deleteEvent);

export default router;


import { Event } from "../models/event.model.js";
import fs from "fs";
import path from "path";
export const createEvent = async (req,res) => {
    const {name,description,startDate,endDate,location} = req.body;
    const image = req.file.path;
    try {
        const event = await Event.create({name,description,startDate,endDate,location,image:image.filename});
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const getEvents = async (req,res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const getEventById = async (req,res) => {
    const {id} = req.params;
    try {
        const event = await Event.findById(id);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
    
    
}

export const updateEvent = async (req,res) => {
    const {id} = req.params;
    const {name,description,startDate,endDate,location} = req.body;
    const event = await Event.findById(id);
    if(!event){
        return res.status(404).json({message:"Event not found"});
    }

    let updateData = {name,description,startDate,endDate,location};
    
    if(req.file){
        if(event.image && typeof event.image === 'string' && event.image.trim() !== '') {
            let oldImage = path.join(process.cwd(),"public",event.image);
            try {
                fs.unlinkSync(oldImage);
            } catch (error) {
                console.error("Error deleting old image:", error);
            }
        }
        updateData.image = req.file.filename;
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {new:true});
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const deleteEvent = async (req,res) => {
    const {id} = req.params;
    try {
      let event =  await Event.findByIdAndDelete(id);
      if(event.image && typeof event.image === 'string' && event.image.trim() !== '') {
        let oldImage = path.join(process.cwd(),"public",event.image);
        try {
            fs.unlinkSync(oldImage);
        } catch (error) {
            console.error("Error deleting old image:", error);
        }
      }
        res.status(200).json({message:"Event deleted successfully"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}


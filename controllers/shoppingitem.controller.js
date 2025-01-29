import { ShoppingItem } from "../models/shoppingitem.model.js";
import fs from 'fs';
import csv from 'csv-parser';
import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/responsehandler.js";
import { apierror } from "../utils/apierror.js";
import path from 'path';
import { User } from "../models/user.model.js";

export const addshoppingitems = asynchandler(async (req, res) => {
  const results = [];
  const file=req.file;
  // Use path.resolve for correct absolute path
  const filePath = path.resolve(file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end',()=>{
        results.forEach(async (item) => {
          const existedItem = await ShoppingItem.findOne({ id: item.Article_No });
          if (existedItem) {
            const updatedItem = await ShoppingItem.findOneAndUpdate({ id: item.Article_No }, {
              main_category:item.Domain_Name,
              sub_category:item.Department_Name,
              item_category:item.ArticleGroup_Name,
              discountprice:item.Discount_Price,
              orignalprice:item.GrossSale_Price,
              itemfullname:item.Article_Name,
              brand:item.Brand,
              fulldesciption:item.Full_Desciption,
              descriptionpoints:item.Description_Points,
              description:item.Description
            });}

            else{
              const shoppingitem = await ShoppingItem.create({
                id:item.Article_No,
                main_category:item.Domain_Name,
                sub_category:item.Department_Name,
                item_category:item.ArticleGroup_Name,
               discountprice:item.Discount_Price,
               orignalprice:item.GrossSale_Price,
               itemfullname:item.Article_Name,
               brand:item.Brand,
               fulldesciption:item.Full_Desciption,
               descriptionpoints:item.Description_Points,
               description:item.Description
              });

            }
          });
          if (results.length >0) {
            fs.unlinkSync(filePath); // delete the file after reading    
            return res.json(new apiresponse(200, "Items added successfully", results));
          }

        
       
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error reading the CSV file');
    });

    console.log(results);
});

export const getshoppingitems = asynchandler(async (req, res) => {
  const items = await ShoppingItem.find();
  return res.json(new apiresponse(200, "Shopping items fetched successfully", items));
});

export const deleteshoppingitem=asynchandler(async(req,res)=>{
  const {id}=req.params;
  const item=await ShoppingItem.findOneAndDelete({id:id});
  if(!item){
    return res.json(new apierror(404, "No item found with the given id"));
  }else{
     fs.unlinkSync(path.resolve(`public/${item.imgsrc}`));
    return res.json(new apiresponse(200, "Item deleted successfully", item));
  }
});

export const addimages = asynchandler(async (req, res) => {
  try {
    const images = req.files;

    for (const image of images) {
      const itemId = image.originalname.split('.')[0];

      const updatedItem = await ShoppingItem.findOneAndUpdate(
        { id: itemId },
        { imgsrc: image.filename },
        { new: true }
      );

      if (!updatedItem) {
        console.warn(`No shopping item found with id: ${itemId}`);
      }
    }

    return res.json({ status: 200, message: "Images added successfully" });
  } catch (error) {
    console.error("Error adding images:", error);
    return res.json(new apierror(500, "Error adding images", error));
  }
});
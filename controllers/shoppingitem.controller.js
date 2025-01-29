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
  
  // Use path.resolve for correct absolute path
  const filePath = path.resolve('controllers/data.csv');

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
            return res.json(new apiresponse(200, "Items added successfully", results));
          }

        
       
       fs.unlinkSync(filePath); // delete the file after reading    
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error reading the CSV file');
    });

    console.log(results);
});

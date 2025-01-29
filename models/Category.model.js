import mongoose,{Schema} from "mongoose";

const categorySchema = new Schema({
    main_category:{
     type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
sub_category:[
{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    item_category:[
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            items:[
                {
                    type:Schema.Types.ObjectId,
                    ref:'ShoppingItem'
                }
            ]
        }
    ]
}
]
    }
});

export const Category=mongoose.model('Category',categorySchema);
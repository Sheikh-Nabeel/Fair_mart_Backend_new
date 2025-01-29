import mongoose,{Schema} from "mongoose";

const shoppingitemSchema = new Schema({
    main_category: {
        type: String,
        
        lowercase: true,
        trim: true,
    },
    id:{
        type:Number,
        required:true,
        unique:true,
    },
    sub_category: {
        type: String,
      
        lowercase: true,
        trim: true,
    },
    item_category: {
        type: String,
         
        lowercase: true,
        trim: true,
    },
    imgsrc: {
        type: String,
        default:0
    },
    discountprice: {
        type: Number,
        required: true,
        default: 0,
    },
    orignalprice: {
        type: Number,
        required: true,
    },
    itemfullname: {
        type: String,
        required: true,
       
    },
    brand:{
        type:String,
        required:true,
        default:0
    },
    colors:[
        {
            type:String,
            default:0
        },

    ],
    fulldesciption:{   
        type:String,
         default:0
    },
    descriptionpoints:[
        {
            type:String,
            default:0
        },
    ],
    description:{
        type:String,
        default:0
    },
    quantity:{
        type:Number,
        default:1
    },
}, { timestamps: true });

export const ShoppingItem = mongoose.model('ShoppingItem', shoppingitemSchema);
    


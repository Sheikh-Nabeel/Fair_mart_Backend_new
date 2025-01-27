import mongoose,{Schema} from "mongoose";

const profileSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullname: {
        type: String,
         
    },
    companyname: {
        type: String,
      
    },
    phone: {
        type: String,
         
    },
    jobtitle: {
        type: String,
        
    },
    email: {
        type: String,
        
    },
    aboutme: {
        type: String,
    },
    currency: {
        type: String,
        
    },
    country: {
        type: String,
        
    },
    city: {
        type: String,
        
    },
    state: {
        type: String,
        
    },
    industrytype: {
        type: String,
        
    },
    zipcode: {
        type: String,
        
    },
    youtube: {
        type: String,
    },
    socialpic_url: {
        type: String,
    },
    socialpic_id: {
        type: String,
    },
    companylogo_url: {
        type: String,
    },
    companylogo_id: {
        type: String,
    },
    profilepic_url: {
        type: String,
    },
    profilepic_id: {
        type: String,
    },
    personalpic_url: {
        type: String,
    },
    personalpic_id: {
        type: String,
    },
    private: {
        type: Boolean,
        default: false,
    },
    personal:{
        type:Boolean,
        default:false
    },
    apps: {
        type: [
            {
                name: {
                    type: String,
                  
                },
                url: {
                    type: String,
                    
                },
                enabled:{
                    type:Boolean,
                    default:true
                }
            },
        ],
        default: [], // Correct placement of the default property
    },
    connections: {
        type: [
            {
                userid: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true, // Add validation if necessary
                },
                profileid: {
                    type: Schema.Types.ObjectId,
                    ref: 'Profile',
                    required: true, // Add validation if necessary
                },
                status: {
                    type: String,
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending',
                },
            },
        ],
        default: [], // Correct placement of the default property
    },

}, { timestamps: true });
 
export const Profile = mongoose.model('Profile', profileSchema);
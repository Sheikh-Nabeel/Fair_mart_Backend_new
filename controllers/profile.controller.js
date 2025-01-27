import cloudinary from '../middelwares/cloudinary.middelware.js';
import {Profile} from '../models/profile.model.js';
import { asynchandler } from '../utils/asynchandler.js';
export const createProfile = asynchandler(async (req, res) => {
  const { social = [], company = [], personal = [] } = req.files || {};
  const {
      userid = "",
      fullname = "",
      companyname = "",
      phone = "",
      jobtitle = "",
      email = "",
      aboutme = "",
      currency = "",
      country = "",
      city = "",
      state = "",
      industrytype = "",
      zipcode = "",
      youtube = "",
      private_status = "",
      id = ""
  } = req.body;

  try {
      console.log("Files received:", req.files);

      const social1 = social.length > 0 ? await cloudinary.uploader.upload(social[0].path) : { secure_url: "", public_id: "" };
      const company1 = company.length > 0 ? await cloudinary.uploader.upload(company[0].path) : { secure_url: "", public_id: "" };
      const personal1 = personal.length > 0 ? await cloudinary.uploader.upload(personal[0].path) : { secure_url: "", public_id: "" };

      const newProfile = new Profile({
          socialpic_url: social1.secure_url,
          socialpic_id: social1.public_id,
          companylogo_url: company1.secure_url,
          companylogo_id: company1.public_id,
          personalpic_url: personal1.secure_url,
          personalpic_id: personal1.public_id,
          userid,
          fullname,
          companyname,
          phone,
          jobtitle,
          email,
          aboutme,
          currency,
          country,
          city,
          state,
          industrytype,
          zipcode,
          youtube,
          private: Boolean(private_status),
      });

      console.log("Saving profile:", newProfile);
      const savedProfile = await newProfile.save();
      res.status(201).json({ message: "Profile created successfully", savedProfile });
  } catch (error) {
      console.error("Error creating profile:", error.message);
      res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

  
export const updateProfile = asynchandler(async (req, res) => {
  const { social, company, personal } = req.files || {};
  const {
    id,
    fullname,
    companyname,
    phone,
    jobtitle,
    email,
    aboutme,
    currency,
    country,
    city,
    state,
    industrytype,
    zipcode,
    youtube,
    private_status,
  } = req.body;

  try {
    console.log("Files received:", req.files);
    console.log("Request body:", req.body);

    // Validate input
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch existing profile
    const existingProfile = await Profile.findById(id);
    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Initialize updates
    const updates = {};

    // Helper function to check if a value is non-empty
    const isNonEmpty = (value) => value !== undefined && value !== null && value !== "";

    // Only include non-empty fields in updates
    if (isNonEmpty(fullname)) updates.fullname = fullname;
    if (isNonEmpty(companyname)) updates.companyname = companyname;
    if (isNonEmpty(phone)) updates.phone = phone;
    if (isNonEmpty(jobtitle)) updates.jobtitle = jobtitle;
    if (isNonEmpty(email)) updates.email = email;
    if (isNonEmpty(aboutme)) updates.aboutme = aboutme;
    if (isNonEmpty(currency)) updates.currency = currency;
    if (isNonEmpty(country)) updates.country = country;
    if (isNonEmpty(city)) updates.city = city;
    if (isNonEmpty(state)) updates.state = state;
    if (isNonEmpty(industrytype)) updates.industrytype = industrytype;
    if (isNonEmpty(zipcode)) updates.zipcode = zipcode;
    if (isNonEmpty(youtube)) updates.youtube = youtube;
    if (private_status !== undefined) updates.private = Boolean(private_status);

    // Handle social file upload
    if (social) {
      if (existingProfile.socialpic_id) {
        await cloudinary.uploader.destroy(existingProfile.socialpic_id);
      }
      const social1 = await cloudinary.uploader.upload(social[0].path);
      updates.socialpic_url = social1.secure_url;
      updates.socialpic_id = social1.public_id;
    }

    // Handle company logo file upload
    if (company) {
      if (existingProfile.companylogo_id) {
        await cloudinary.uploader.destroy(existingProfile.companylogo_id);
      }
      const company1 = await cloudinary.uploader.upload(company[0].path);
      updates.companylogo_url = company1.secure_url;
      updates.companylogo_id = company1.public_id;
    }

    // Handle personal file upload
    if (personal) {
      if (existingProfile.personalpic_id) {
        await cloudinary.uploader.destroy(existingProfile.personalpic_id);
      }
      const personal1 = await cloudinary.uploader.upload(personal[0].path);
      updates.personalpic_url = personal1.secure_url;
      updates.personalpic_id = personal1.public_id;
    }

    // Update profile
    const updatedProfile = await Profile.findByIdAndUpdate(id, { $set: updates }, { new: true });

    if (!updatedProfile) {
      return res.status(500).json({ message: "Failed to update profile" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error("Error handling file upload:", error.message);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

  export const deleteProfile = asynchandler(async (req, res) => {
    const { id } = req.body;
  
    try {
      if (!id) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const existingProfile = await Profile.findById(id);
      if (!existingProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
  
      if (existingProfile.socialpic_id) {
        await cloudinary.uploader.destroy(existingProfile.socialpic_id);
      }
      if (existingProfile.companylogo_id) {
        await cloudinary.uploader.destroy(existingProfile.companylogo_id);
      }
      if (existingProfile.personalpic_id) {
        await cloudinary.uploader.destroy(existingProfile.personalpic_id);
      }
  
      const deletedProfile = await Profile.findByIdAndDelete(id);
      if (!deletedProfile) {
        return res.status(500).json({ message: "Failed to delete profile" });
      }
  
      res.status(200).json({ message: "Profile deleted successfully", deletedProfile });
    } catch (error) {
      console.error("Error deleting profile:", error.message);
      res.status(500).json({ message: "Something went wrong", error: error.message });
  }

  }
)

export const getProfiles = asynchandler(async (req, res) => {
    const {userid} = req.body;

    try {
        if (!userid) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingProfile = await Profile.find({userid});
        if (!existingProfile) {
            return res.status(404).json({ message: "Profiles not found" });
        }

        res.status(200).json({ message: "Profiles founded", existingProfile });
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
export const getuserprofile = asynchandler(async (req, res) => { 
const {id,userid} = req.body;
try {
    if (!id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const existingProfile = await Profile.find({userid:userid,_id:id});
    if (!existingProfile) {
        return res.status(404).json({ message: "Profiles not found" });
    }

   return res.status(200).json({ message: "Profile founded", existingProfile });

}
catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Something went wrong", error: error.message });}

});

export const getallprofiles=asynchandler(async(req,res)=>{
  try {
    
    const profiles=await Profile.find({private:false})

    return res.status(200).json({profiles:profiles})
  } catch (error) {
    console.log(error)
  }

})

//Apps
export const addapp = asynchandler(async (req, res) => {
  const { name, url, enabled, id } = req.body;

  try {
    // Validate input
    if (!id || !name || !url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the profile by ID
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Ensure 'enabled' is a boolean
    const appEnabled = enabled === undefined ? false : Boolean(enabled);

    // Add the new app to the apps array
    profile.apps.push({ name, url, enabled: appEnabled });

    // Save the updated profile
    const savedProfile = await profile.save();
    return res.status(201).json({ message: "App added successfully", profile: savedProfile });

  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

export const updateapp = asynchandler(async (req, res) => {
  const { name, url, id, appid, enabled } = req.body;

  try {
    // Validate input
    if (!id || !appid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the profile by ID
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find the app by ID
    const app = profile.apps.id(appid);
    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    // Update the app
    if (name !== undefined) {
      app.name = name;
    }
    if (url !== undefined) {
      app.url = url;
    }
    if (enabled !== undefined) {
      app.enabled = Boolean(enabled);
    }

    // Save the updated profile
    const savedProfile = await profile.save();
    return res.status(200).json({ message: "App updated successfully", profile: savedProfile });

  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});


export const deleteapp = asynchandler(async (req, res) => {
  const { id, appid } = req.body;

  try {
    // Validate input
    if (!id || !appid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the profile by ID
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find the app in the apps array by appid
    const appIndex = profile.apps.findIndex((app) => app._id.toString() === appid);
    if (appIndex === -1) {
      return res.status(404).json({ message: "App not found" });
    }

    // Remove the app from the apps array
    profile.apps.splice(appIndex, 1);

    // Save the updated profile
    const savedProfile = await profile.save();
    return res.status(200).json({ message: "App deleted successfully", profile: savedProfile });

  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

export const getapps = asynchandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the profile by ID
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return the apps array
    return res.status(200).json({ message: "Apps found", apps: profile.apps });

  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});


//connections
export const sendrequest = asynchandler(async (req, res) => {
  const { userid, profileid, userprofileid } = req.body;

  try {
    // Validate input
    if (!userid || !profileid || !userprofileid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the target profile by ID and ensure it's not private
    const profile = await Profile.findOne({ _id: profileid, private: false });
    if (!profile) {
      return res.status(404).json({ message: "Target profile not found or is private" });
    }

    // Check if a connection request already exists in the target profile
    const existingConnection = profile.connections.find(
      (connection) => connection.userid.toString() === userid && connection.profileid.toString() === userprofileid
    );

    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already exists" });
    }

    // Add the new connection to the connections array
    profile.connections.push({ userid, profileid: userprofileid, status: "pending" });

    // Save the updated target profile
    const savedProfile = await profile.save();

    return res.status(201).json({
      message: "Connection request sent successfully",
      profile: savedProfile,
    });

  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

export const acceptrequest = asynchandler(async (req, res) => {
  const { userid, profileid, userprofileid } = req.body;

  try {
    // Validate input
    if (!userid || !profileid || !userprofileid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the target profile by ID
    const profile = await Profile.findOne({ _id: profileid });
    if (!profile) {
      return res.status(404).json({ message: "Target profile not found" });
    }

    // Find the connection in the connections array
    const connection = profile.connections.find(
      (connection) => connection.profileid.toString() === userprofileid && connection.userid.toString() === userid
    );

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Update the connection status to accepted
    connection.status = "accepted";

    // Save the updated target profile
    const savedProfile = await profile.save();

    return res.status(200).json({
      message: "Connection request accepted successfully",
      profile: savedProfile,
    });

  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

export const rejectrequest = asynchandler(async (req, res) => {
  const { userid, profileid, userprofileid } = req.body;

  try {
    // Validate input
    if (!userid || !profileid || !userprofileid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the target profile by ID
    const profile = await Profile.findOne({ _id: profileid });
    if (!profile) {
      return res.status(404).json({ message: "Target profile not found" });
    }

    // Find the connection in the connections array
    const connection = profile.connections.find(
      (connection) => connection.profileid.toString() === userprofileid && connection.userid.toString() === userid
    );

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // Update the connection status to rejected
    connection.status = "rejected";

    // Save the updated target profile
    const savedProfile = await profile.save();

    return res.status(200).json({
      message: "Connection request rejected successfully",
      profile: savedProfile,
    });
  }catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

export const deleteconnection = asynchandler(async (req, res) => {  
  const { userid, profileid, userprofileid } = req.body;
  try {
      // Validate input
      if (!userid || !profileid || !userprofileid) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Find the target profile by ID
      const profile = await Profile.findOne({ _id: profileid });
      if (!profile) {
          return res.status(404).json({ message: "Target profile not found" });
      }

      // Find the connection in the connections array
      const connectionIndex = profile.connections.findIndex(
          (connection) => connection.profileid.toString() === userprofileid && connection.userid.toString() === userid
      );

      if (connectionIndex === -1) {
          return res.status(404).json({ message: "Connection request not found" });
      }

      // Remove the connection from the connections array
      profile.connections.splice(connectionIndex, 1);

      // Save the updated target profile
      const savedProfile = await profile.save();

      return res.status(200).json({
          message: "Connection request deleted successfully",
          profile: savedProfile,
      });

  } catch (error) {
      // Handle errors
      return res.status(500).json({
          message: "Something went wrong",
          error: error.message,
      });
  }
});

export const getpendingrequests = asynchandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the profile by ID and populate connections
    const profile = await Profile.findById(id)
      .populate("connections.userid")
      .populate("connections.profileid");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Filter the connections array to get pending requests
    const pendingRequests = await Promise.all(
      profile.connections
        .filter((connection) => connection.status === "pending")
        .map(async (connection) => {
          // Fetch the profile of the user who sent the request
          const requesterProfile = await Profile.findOne({
            userid: connection.userid._id,
          });

          return {
            connection,
            userProfile: requesterProfile,
            userData: connection.userid,
          };
        })
    );

    return res.status(200).json({ message: "Pending requests found", pendingRequests });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});


export const getacceptedrequests = asynchandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the profile by ID and populate connections with profile and user data
    const profile = await Profile.findById(id)
      .populate({
        path: "connections.profileid",
        model: "Profile",
      })
      .populate({
        path: "connections.userid",
        model: "User",
      });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Filter the connections array to get accepted requests
    const acceptedRequests = profile.connections
      .filter((connection) => connection.status === "accepted")
      .map((connection) => {
        return {
          connection,
          userProfile: connection.profileid,
          userData: connection.userid,
        };
      });

    return res.status(200).json({ message: "Accepted requests found", acceptedRequests });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

export const changepersonalstatus=asynchandler(async(req,res)=>{
  const {id,status}=req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
  }

  const existingProfile = await Profile.findById(id);
  if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
  }
  existingProfile.personal=Boolean(status);
  const savedProfile=await existingProfile.save();
  return res.status(200).json({ message: "Profile updated successfully", profile: savedProfile });
  }
  catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
})

export const getprofile = asynchandler(async (req, res) => {
  const { id, userid } = req.body;
  try {
      if (!id || !userid) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      const existingProfile = await Profile.findById(id).populate("connections.userid");
      if (!existingProfile) {
          return res.status(404).json({ message: "Profile not found" });
      }

      if (existingProfile.personal) {
          const isConnected = existingProfile.connections.some(
              (connection) => connection.userid && connection.userid._id.toString() === userid && connection.status === "accepted"
          );

          if (!isConnected) {
              const { apps, connections, ...dataWithoutAppsAndConnections } = existingProfile.toObject();
              return res.status(200).json(dataWithoutAppsAndConnections);
          }
      }

      return res.status(200).json(existingProfile);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

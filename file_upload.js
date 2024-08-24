import {v2 as cloudinary} from cloudinary;
import fs from "fs";

          
cloudinary.config({ 
  cloud_name: process.env.NAME, 
  api_key: process.env.KEY, 
  api_secret: process.env.SECRET 
});

app.post()=>async{
    try{
        if(!localFilePath) return "no";
        cloudinary.uploader.upload(localFilePath,{
            resource_type
        })
    }
}

cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });
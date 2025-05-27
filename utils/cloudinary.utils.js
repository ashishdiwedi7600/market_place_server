const cloudinary = require('./../configs/cloudinary.config')


const cloudinaryFileUploadMethod = async (file,resource_type) => {
    return new Promise((resolve,reject) => {
        cloudinary.uploader.upload( file ,{ resource_type: resource_type, folder: "uploads/resumes" }, (err, res) => {
          if (err) reject(err)
            resolve({
              res: res.secure_url
            }) 
          }
        ) 
    })
  }

  module.exports = {cloudinaryFileUploadMethod}
const { insertRecord, findRecordById } = require("../db_config/models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { schemas } = require("../models/Candidate");
const User = require("../models/User");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const { cloudinaryFileUploadMethod } = require("../utils/cloudinary.utils");



exports.getAuthData=(req,res,next)=>{
    res.status(200).send({msg:'data fetched successfully'})
}


exports.register = async (req, res) => {
    try {
        // console.log(req.body)
        let { name, email, phone,password,role } = req.body
        const accountStatus = "verified"
    
    
        await bcrypt.hash(password, 10, async function (err, hash) {
            if (err) return new Error("somme error occurred");
            password = hash
            let result = await insertRecord({ name, email, phone, password, accountStatus,role })
            if (result.status === 200) {            
                    res.send({ status: 200, msg: "user added successfully" })
            }
            else {
                res.send(500)
            }
        })
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

exports.login = async (req, res) => {
    try {    
        const token = jwt.sign(
            { userId: req.foundUser._id, email: req.foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.send({ status: 200, data: {
            message: 'Login successful',
            token,
            user:  req.foundUser
        } })
    } catch (error) {
        res.status(400).json({ error: error });
    }
    
}
exports.profileUpdate = async (req, res) => {
    try {
        const user = await findRecordById(req.user.id)
        if (!user) return res.status(404).json({ error: "User not found" });

        const deleteFile = (filePath) => {
            fs.unlink(filePath, (err) => {
              if (err) console.error("Failed to delete local file:", err);
            });
          };
    

        for (const file of Object.keys(req.files)) {
            const { path, fieldname } = req.files[file]?.[0];
            const resource_type = fieldname === 'profileImage' ? 'image' : 'raw'
            const newPath = await cloudinaryFileUploadMethod(path, resource_type);
            if (fieldname === 'profileImage') {
                user.profileImage = newPath?.res || ''
            } else {
                req.body.resumeUrl = newPath?.res || '';
            }
            deleteFile(path)
        }        

        const updates = req.body;

        // Validate based on role using the embedded schema
        const schema = user.role === "candidate"
            ? schemas.candidate
            : schemas.recruiter;

        const Model = mongoose.model("TempProfile", schema);
        const temp = new Model(updates);
        const validationError = temp.validateSync();
        if (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        // Merge updates
        user.profile = {
            ...user.profile,
            ...updates
        };

        await user.save();
        res.json({ message: "Profile updated", userData: user });
    } catch (error) {
        res.status(400).json({ error: error });
    }
    
}
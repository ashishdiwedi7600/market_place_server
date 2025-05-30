const {  findRecordById } = require("../db_config/models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { schemas } = require("../models/Candidate");
const fs = require("fs");
const pdfParse = require('pdf-parse');
const mammoth = require("mammoth");
const { NlpManager } = require('node-nlp');
const { OpenAI } = require('openai');
const { default: mongoose } = require("mongoose");
const { cloudinaryFileUploadMethod } = require("../utils/cloudinary.utils");
const { createOption, createsOption, getOptionsByType, optionExists } = require("../services/dropdownServices");
const { insertRecord, recordEsist, updateRecordByFilter } = require("../services/userServices");
const { extractEmail, extractPhone, extractSkills, extractSections, generateRandomToken } = require("../utils/helper");
const path = require("path");
const sendVerificationEmail = require("../utils/sendVerification");

const loadModel = async () => {
    const manager = new NlpManager({ languages: ['en'], forceNER: true });
    await manager.load('./model.nlp');
    return manager;
  };
  
  const extractFromText = async (text) => {
    const manager = await loadModel();
    const result = await manager.process('en', text);
    return {
      intent: result.intent,
      entities: result.entities.map(e => ({
        entity: e.entity,
        value: e.utteranceText
      }))
    };
  };

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  // Prompt template for GPT-4
  const buildPrompt = (text) => `
  You are a resume parsing expert. Extract the following fields in JSON format from the resume text below:
  
  Fields:
  - name
  - email
  - phone
  - skills (as an array)
  - education (as an array of degree, institution, year if available)
  - experience (as an array of job title, company, location, years if available)
  - certifications (if any)
  - summary or objective
  
  Resume Text:
  """ 
  ${text}
  """
  Return only a valid JSON object.
  `;
  
  const extractResumeInfo = async (text) => {
    const prompt = buildPrompt(text);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });
  
    const raw = completion.choices[0].message.content;
  
    try {
      return JSON.parse(raw
        .replace(/```json\s*/, '')  // remove starting ```json
        .replace(/```$/, '')        // remove ending ```
        .trim());
    } catch (err) {
      return { error: 'Invalid JSON from GPT', raw };
    }
  };

exports.getAuthData=(req,res,next)=>{
    res.status(200).send({msg:'data fetched successfully'})
}


exports.register = async (req, res) => {
    try {
        let { name, email, phone,password,role } = req.body

        const emailExist = await recordEsist({email:email})

        if (!emailExist) {
            const verificationToken = generateRandomToken();

            await bcrypt.hash(password, 10, async function (err, hash) {
                if (err) return new Error("somme error occurred");
                password = hash
                let result = await insertRecord({ name, email, phone, password,role,verificationToken })
                if (result.status === 200) {  
                    const resmail = await sendVerificationEmail(email,name,verificationToken)          
                        res.send({ status: 200, msg: "user added successfully Pls verify your email" })
                }
                else {                    
                    res.send(500)
                }
            }) 
        }
        else{
            throw new Error("User already registered for this email");            
        }      
    } catch (error) { 
        throw new Error(error);       
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
        res.send({ status: 200, data: {
            message: 'Profile updated',
            user:  user
        } })
    } catch (error) {
        res.status(400).json({ error: error });
    }
    
}

exports.addDropDown = async (req,res)=>{

    try {
        const payload = req.body;
        let inserteditem = [];
        if (!payload || (Array.isArray(payload) && payload.length === 0)) {
            return res.status(400).json({ error: "Request body is empty" });
        }


        if (Array.isArray(payload)) {
            for (let index = 0; index < payload.length; index++) {
                let res = await optionExists(payload[index].type, payload[index].label)
                if (!res?._id) {
                    inserteditem.push(payload[index])
                }
            }
            await createsOption(inserteditem); // Bulk insert
        } else {
            let res = await optionExists(payload.type, payload.label)
            if (!res?._id) {
                await createOption(payload);  // Single insert
            }

        }

        // ✅ Return all data after insert
        const allOptions = await getOptionsByType();

        res.status(201).json({
            message: "Inserted successfully",
            data: allOptions,
        });

    } catch (error) {
        res.status(400).json({ error: error });
    }
    
}
exports.sendVerification = async (req,res)=>{
    try {      
        const {token}=req.query;

        const emailExist = await recordEsist({verificationToken:token})
        if (emailExist) {
            const update = {
                verificationToken:'',
                isVerified:true
            }
            const result = await updateRecordByFilter(emailExist,update)
            res.send({ status: 200, data: {
                message: 'User has been verified successfully',
                result
            } })
        }
        else{
            throw new Error("Invalid token");  
        }

    } catch (error) {
        throw new Error(error);
    }
    
}
exports.getDropDownByType = async (req,res)=>{
    try {
        const {type} = req.params;
    
        const allOptions = await getOptionsByType(type);
    
        res.status(200).json({
          message: "Data Fetched successfully",
          data: allOptions,
        });
    } catch (error) {
        res.status(400).json({ error: error });
    }
    
}

exports.parseProfile =async(req,res)=>{
    const filePath = req.file.path;

    try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        const dataBuffer = fs.readFileSync(filePath);
        let text;

        if (ext === ".pdf") {
            const pdfData = await pdfParse(dataBuffer);
            text = pdfData.text;
        } else if (ext === ".docx") {
            const docData = await mammoth.extractRawText({ buffer: dataBuffer })
            text = docData.value;
        } else if (ext === ".doc") {
            res.status(500).json({ error: '.doc type file is not supported' });
            // Recommend user convert it or use unoconv
        }

    //   const extracted = await extractFromText(text); //use with nlp-reader
      const extracted = await extractResumeInfo(text); //openAi api
  
      // Cleanup file
      fs.unlinkSync(filePath);

    //   on the basis of regex we are also extract some data
    //   const email = extractEmail(text);
    //   const phone = extractPhone(text);
    //   const skills = extractSkills(text);
    //   const sections = extractSections(text);

    res.status(200).json({
        message: "Data Extracted successfully",
        extractedData:extracted
    });
  
    } catch (error) {
      fs.unlinkSync(filePath); // cleanup on error
      res.status(500).json({ error: error.message });
    }
}
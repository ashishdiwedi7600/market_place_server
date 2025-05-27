const mongoose = require("mongoose");

// Candidate Profile Subschema
const candidateProfileSchema = new mongoose.Schema({
  birthDate: { type: Date },
  address: { type: String },
  jobType: {
    type: String
    // enum: ["Full-time", "Part-time", "Contract", "Intern"],
   
  },
  department: {
    type: String
    // enum: ["Development", "Human Resources", "Finance", "Marketing", "Sales", "Support"],
   
  },
  position: { type: String},
  resumeUrl: { type: String },
  experienceYears: { type: Number },
  skills: [String]
}, { _id: false }); // no _id for embedded

// Recruiter Profile Subschema
const recruiterProfileSchema = new mongoose.Schema({
  companyName: { type: String },
  agencyLicense: { type: String }
}, { _id: false });

module.exports.schemas = {
    candidate: candidateProfileSchema,
    recruiter: recruiterProfileSchema
  };
const mongoose = require('mongoose');

//User Schema 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String, // Optional field
  },
  role: { type: String, enum: ["candidate", "recruiter"], required: true },
  accountStatus:{type:String},
  profileImage:{type:String},
  profile: {
    type: mongoose.Schema.Types.Mixed, // will handle dynamic schema manually
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

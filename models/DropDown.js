const mongoose = require("mongoose");

const dropdownOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // e.g., "jobType", "department"
  },
  label: {
    type: String,
    required: true, // e.g., "Full-time", "Development"
  },
//   value: {
//     type: String,
//     required: true, // e.g., "full_time", "development"
//   }
}, { timestamps: true });

module.exports = mongoose.model("DropdownOption", dropdownOptionSchema);
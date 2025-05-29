const multer = require("multer");
const path = require("path");

// Define storage destination and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  }
});

// File filter for PDF/DOC/DOCX only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx",".jpg",".jpeg",".png",".JPG"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed."), false);
  }
};
const fileFilterResume = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadResume = multer({ storage, fileFilterResume });

module.exports = {upload,uploadResume};
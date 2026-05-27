const multer = require('multer');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../uploads');

// Shared storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Audio filter
const audioFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed'), false);
  }
};

// Image filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = {
  uploadAudio,
  uploadImage
};

const sharp = require('sharp');
const multer = require('../middleware/multer-config');

module.exports = (req, res, next) => {
  const storage = SharpMulter({
    destination: (req, file, callback) => callback(null, 'images'),
    imageOptions: {
      fileFormat: 'webp',
      quality: 80,
      resize: {
        width: 1080, // Max width
        height: 1920, // Max height
        fit: 'inside', // Maintain aspect ratio within these dimensions
      },
    },
  });

  const upload = multer({ storage });
};

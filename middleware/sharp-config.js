const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sharpOptimizer = (req, res, next) => {
  if (!req.file) {
    console.log('No file to process');
    return next();
  }

  const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const extension = MIME_TYPES[file.mimetype];

  console.log('File received, processing with Sharp...');
  const filename =
    req.file.originalname.split(' ').join('_') + Date.now() + extension;

  sharp(req.file.buffer)
    .resize({
      width: 1080,
      height: 1920,
      fit: 'inside', // sets max dimensions and retains original aspect ratio
    })
    .webp({ quality: 80 }) // sets format and image quality
    .toFile(path.join('images', filename), (err) => {
      if (err) {
        return next(err);
      }
      req.file.filename = filename; // Attach the processed filename for further use
      next();
    });
};

module.exports = sharpOptimizer;

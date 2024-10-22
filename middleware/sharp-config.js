const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sharpOptimizer = (req, res, next) => {
  if (req.file) {
    const buffer = req.file.buffer;

    sharp(buffer)
      .resize({
        width: 720,
        height: 1280,
        fit: 'inside', // sets max dimensions and retains original aspect ratio
      })
      .webp({ quality: 80 }) // sets file format and image quality
      .toBuffer((error, buffer) => {
        if (error) {
          return next(error);
        }

        const oldFileName = path
          .parse(req.file.originalname)
          .name.split(' ')
          .join('_');

        const timestamp = Date.now();
        const newFilename = `${oldFileName}_${timestamp}.webp`;
        req.file.filename = newFilename;

        const savePath = path.join(__dirname, '..', 'images', newFilename);

        fs.writeFile(savePath, buffer, (error) => {
          if (error) {
            return next(error);
          }
          next();
        });
      });
  } else {
    next();
  }
};

module.exports = sharpOptimizer;

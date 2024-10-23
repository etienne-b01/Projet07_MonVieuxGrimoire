//imports required libraries (image processing, filesystem actions, support for file paths)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sharpOptimizer = (req, res, next) => {
  // Checks if a file exists in the request (i.e., if an image was uploaded).
  if (req.file) {
    const buffer = req.file.buffer; // Accesses the image buffer from memory storage.

    sharp(buffer)
      .resize({
        width: 720,
        height: 1280,
        fit: 'inside', // sets max dimensions and retains original aspect ratio
      })
      .webp({ quality: 80 }) // sets file format and image quality
      .toBuffer((error, buffer) => {
        if (error) {
          // If there is an error during the processing, pass the error to the next middleware.
          return next(error);
        }

        // Generate a new file name by removing extension and replacing spaces with underscores
        const oldFileName = path
          .parse(req.file.originalname)
          .name.split(' ')
          .join('_');

        //gets current timestamp and adds it to the new file name
        const timestamp = Date.now();
        const newFilename = `${oldFileName}_${timestamp}.webp`;
        req.file.filename = newFilename; // Stores the new file name in the request for later use.

        // Defines storage location for optimized image
        const savePath = path.join(__dirname, '..', 'images', newFilename);

        // saves the optimized image buffer to the file system.
        fs.writeFile(savePath, buffer, (error) => {
          if (error) {
            // If there is an error saving the file, pass the error to the next middleware.
            return next(error);
          }
          next();
        });
      });
  } else {
    // If no file is found in the request, continue to the next middleware.
    next();
  }
};

module.exports = sharpOptimizer;

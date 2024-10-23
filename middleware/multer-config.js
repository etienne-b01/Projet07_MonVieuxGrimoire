const multer = require('multer'); // Import the 'multer' package to handle file uploads.

// Configure multer to use memory storage, which stores the file buffer directly in memory. Allows for processing the file before storing it.
const storage = multer.memoryStorage();

// Custom file format filter function to ensure only certain file types are allowed.
const formatFilter = function (req, file, callback) {
  const supportedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  // Checks if the uploaded file's type is supported, create an error object if not.
  if (!supportedFileTypes.includes(file.mimetype)) {
    const error = new Error('Format fichier non pris en charge');
    error.code = 'LIMIT_FILE_TYPES'; //custom error code for unsupported file types.

    return callback(error, false);
    // Passes the error to the callback and set the second argument to `false` to reject the file.
  }

  // If the file format is supported, call the callback with `null` (no error) and `true` to accept the file.
  callback(null, true);
};

// Initialize the multer upload configuration (memory storage & file filtering)
const upload = multer({
  storage: storage,
  formatFilter: formatFilter,
});

module.exports = upload.single('image');
//multer middleware will handle single file uploads under the field name 'image'.

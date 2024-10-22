const multer = require('multer');

const storage = multer.memoryStorage();

const formatFilter = function (req, file, callback) {
  console.log(req);
  const supportedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  if (!supportedFileTypes.includes(file.mimetype)) {
    const error = new Error('Format fichier non pris en charge');
    error.code = 'LIMIT_FILE_TYPES';
    return callback(error, false);
  }
  callback(null, true);
};

const upload = multer({
  storage: storage,
  formatFilter: formatFilter,
});

module.exports = upload.single('image');

//Previous code below:
/*const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

 const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
}); 

module.exports = multer({ storage: storage }).single('image'); */

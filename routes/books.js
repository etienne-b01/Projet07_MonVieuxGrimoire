const express = require('express');
const bookCtrl = require('../controllers/books');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

//nvls routes
//router.post('/api/books:id/rating', auth, bookCtrl.setRating);

//router.get('/api/books/bestrating', bookCtrl.returnBestRated);

module.exports = router;

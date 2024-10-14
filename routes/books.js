const express = require('express');
const bookCtrl = require('../controllers/books');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/books', auth, bookCtrl.getAllBooks);

router.post('/api/books', auth, multer, bookCtrl.createBook);

router.get('/api/books:id', auth, bookCtrl.getOneBook);

router.put('/api/books:id', auth, multer, bookCtrl.modifyBook);

router.delete('/api/books:id', auth, bookCtrl.deleteBook);

//nvls routes
//router.post('/api/books:id/rating', auth, bookCtrl.setRating);

//router.get('/api/books/bestrating', bookCtrl.returnBestRated);

module.exports = router;

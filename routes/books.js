const express = require('express');
const bookCtrl = require('../controllers/books');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharpOptimizer = require('../middleware/sharp-config');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, sharpOptimizer, bookCtrl.createBook);
router.get('/api/books/bestrating', bookCtrl.returnBestRated);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, sharpOptimizer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/api/books:id/rating', auth, bookCtrl.setRating);

module.exports = router;

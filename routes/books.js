const express = require('express');
const bookCtrl = require('../controllers/books');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, bookCtrl.getAllBooks);

router.post('/', auth, multer, bookCtrl.createBook);

router.get('/:id', auth, bookCtrl.getOneBook);

router.put('/:id', auth, multer, bookCtrl.modifyBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

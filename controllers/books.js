const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  // Parses the 'book' object from the request body (stringified JSON)
  const bookObject = JSON.parse(req.body.book);

  // Removes the _id and _userId fields
  delete bookObject._id;
  delete bookObject._userId;

  // Creates a new book object, including the userId from the authenticated user
  // Sets image URL to its storage location
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  // Saves the new book to the database
  book
    .save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Finds a single book by its ID from the database
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  // If a new image file is provided, parses the book and updates the image URL
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  // Removes the _userId field to avoid tampering
  delete bookObject._userId;

  // Finds the book by ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Check if the authenticated user owns the book
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        // Updates the book in the database
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Livre modifié!' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  // Finds the book by ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Checks if the authenticated user is the owner
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        // Gets the filename from the image URL
        const filename = book.imageUrl.split('/images/')[1];

        // Deletes the image file from the server
        fs.unlink(`images/${filename}`, () => {
          // Deletes the book from the database
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.setRating = (req, res, next) => {
  // Finds the book by its ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Checks if the user has already rated the book
      const existingRating = book.ratings.find(
        (rating) => rating.userId === req.auth.userId
      );

      if (!existingRating) {
        // If no existing rating, adds the user's rating
        book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });

        // Calculates the new average rating
        //creates new array containing "grade" values only
        const ratings = book.ratings.map((rating) => rating.grade);
        //sums all ratings then divides sum by number of ratings
        let averageRating =
          ratings.reduce((previous, current) => {
            return previous + current;
          }, 0) / ratings.length;
        //rounds rating to 1 decimal place and exports it as string
        averageRating = averageRating.toFixed(1);

        // Updates the book with the new rating and average rating
        Book.findByIdAndUpdate(
          { _id: req.params.id },
          { ratings: book.ratings, averageRating: averageRating },
          { new: true }
        )
          .then((book) => res.status(200).json(book))
          .catch((error) => res.status(401).json({ error }));
      } else {
        // If the book has already been rated, sends an error response
        return res
          .status(400)
          .json({ message: 'Livre déjà évalué, modification impossible.' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.returnBestRated = (req, res) => {
  // Finds all books and sorts them by average rating in descending order
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3) // Limits the results to the top 3 books
    .then((sortedBooks) => res.status(200).json(sortedBooks))
    .catch((error) => res.status(400).json({ error }));
};

const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: false },
  imageUrl: { type: String, required: false },
  year: { type: String, required: false },
  genre: { type: String, required: false },
  ratings: [
    {
      userId: { type: String, required: false },
      grade: { type: Number, required: false },
    },
  ],
  averageRating: { type: String, required: false },
});

module.exports = mongoose.model('Book', thingSchema);
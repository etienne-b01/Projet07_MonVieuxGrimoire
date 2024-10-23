require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

mongoose
  .connect(
    `mongodb+srv://${process.env.Mongo_DB_username}:${process.env.Mongo_DB_password}@mvgcluster.s6qau.mongodb.net/?retryWrites=true&w=majority&appName=MVGCluster`
  )
  .then(() => console.log(`Connexion à MongoDB réussie`))
  .catch(() => console.log(`Connexion à MongoDB échouée`));

//maps any request starting with /images to serve files from the images folder in the project
app.use('/images', express.static(path.join(__dirname, 'images')));

// parses incoming JSON payloads from the request body and makes the data available on req.body
app.use(express.json());

// sets CORS headers to allow the API to handle requests from a different domain or port
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //allows all domains
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); //defines allowed headers
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); //defines allowed HTTP methods
  next();
});

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes); // forwards requests starting with /api/books to bookRoutes module
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes); // forwards requests starting with /api/auth to userRoutes module

module.exports = app;

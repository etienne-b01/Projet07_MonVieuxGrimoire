require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

mongoose
  .connect(
    `mongodb+srv://${process.env.Mongo_DB_username}:${process.env.Mongo_DB_password}@mvgcluster.s6qau.mongodb.net/?retryWrites=true&w=majority&appName=MVGCluster`
  )
  .then(() =>
    console.log(
      `Connexion à MongoDB réussie, variables : ${process.env.Mongo_DB_username}, ${process.env.Mongo_DB_password}`
    )
  )
  .catch(() =>
    console.log(
      `Connexion à MongoDB échouée, variables : ${process.env.Mongo_DB_username}, ${process.env.Mongo_DB_password}`
    )
  );

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);
const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);

module.exports = app;

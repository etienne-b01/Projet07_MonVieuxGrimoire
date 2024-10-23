const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const emailRegExp = new RegExp('[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+');

exports.signup = (req, res, next) => {
  // Input validation. Includes removal of any leading and trailing whitespace
  if (!req.body.email || req.body.email.trim() === '') {
    return res.status(400).json({ error: "Veuillez saisir l'adresse mail" });
  } else if (!emailRegExp.test(req.body.email)) {
    return res.status(400).json({ error: "L'adresse email n'est pas valide." });
  }

  // Hashes the password and creates the user
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // Saves the user to the database
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // Looks up user in the database based on the email provided in the request body
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }
      // Compare the provided password (req.body.password) with the hashed password stored in the database
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // If password is correct, returns a signed JWT token that includes the user's ID, signed with a secret key (JWT_KEY)
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
              expiresIn: '24h',
            }),
          });
        })
        // Covers case where there's an error during the password comparison
        .catch((error) => res.status(500).json({ error }));
    })
    // Covers case where there's an error when querying the database for the user
    .catch((error) => res.status(500).json({ error }));
};

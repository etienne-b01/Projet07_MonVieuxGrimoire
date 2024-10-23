require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken'); // imports the 'jsonwebtoken' package for handling JWTs

module.exports = (req, res, next) => {
  try {
    // Extracts the token from the 'Authorization' header. The format is expected to be 'Bearer <token>'.
    const token = req.headers.authorization.split(' ')[1];

    // Checks the token using the secret key and if the token is valid, returns the decoded token, which contains the payload (: the user ID).
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    // Extracts the 'userId' from the decoded token.
    const userId = decodedToken.userId;

    // Attaches the 'userId' to the request object under 'req.auth' so it can be accessed.
    req.auth = {
      userId: userId,
    };

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // 1. Get the correct header, which is 'authorization'
  const authHeader = req.header('authorization');

  // 2. Check if the header doesn't exist
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. The token is sent as "Bearer <token>". We need to split the string
    //    and get only the actual token part (the second part of the array).
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Token is malformed' });
    }

    // 4. Verify the actual token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. If valid, attach the user's ID to the request object
    req.user = decoded.user;
    next(); // Proceed to the protected route
  } catch (err) {
    // 6. If the token is invalid for any reason, send an error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
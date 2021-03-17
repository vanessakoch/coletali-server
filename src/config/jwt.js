const jwt = require('jsonwebtoken');

exports.sign = payload => jwt.sign(payload, process.env.SECRET, { expiresIn: 1800 });

exports.verify = token => jwt.verify(token, process.env.SECRET);

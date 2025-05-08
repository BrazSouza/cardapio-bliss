// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (usuarioId) => {
	return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
};

module.exports = { generateToken };
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middleware/auth');

// Rotas públicas
router.post('/login', authController.login);

// Rotas protegidas
router.get('/verificar', verificarToken, authController.verificarAutenticacao);

router.post('/registro', authController.registro);


module.exports = router; 